// app/api/ml-products/route.ts
import { NextRequest, NextResponse } from "next/server";

// Cache em memória do token (válido por 6h)
let cachedToken: string | null = null;
let tokenExpiry = 0;

async function getAccessToken(): Promise<string | null> {
  // Retorna token cacheado se ainda válido
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;

  const appId        = process.env.ML_APP_ID;
  const appSecret    = process.env.ML_SECRET;
  const refreshToken = process.env.ML_REFRESH_TOKEN;

  if (!appId || !appSecret || !refreshToken) {
    console.error("[ML] Variáveis de ambiente faltando");
    return null;
  }

  try {
    const res = await fetch("https://api.mercadolibre.com/oauth/token", {
      method:  "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body:    new URLSearchParams({
        grant_type:    "refresh_token",
        client_id:     appId,
        client_secret: appSecret,
        refresh_token: refreshToken,
      }).toString(),
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("[ML] Erro ao renovar token:", data);
      return null;
    }

    cachedToken = data.access_token;
    // Renova 10min antes de expirar
    tokenExpiry = Date.now() + (data.expires_in - 600) * 1000;

    // Atualiza o refresh_token se vier um novo
    if (data.refresh_token) {
      process.env.ML_REFRESH_TOKEN = data.refresh_token;
    }

    console.log("[ML] ✅ Token renovado com sucesso");
    return cachedToken;
  } catch (err) {
    console.error("[ML] Exceção ao renovar token:", err);
    return null;
  }
}

export async function GET(req: NextRequest) {
  const ids = req.nextUrl.searchParams.get("ids");
  if (!ids) return NextResponse.json([], { status: 400 });

  const token = await getAccessToken();
  if (!token) return NextResponse.json([], { status: 401 });

  try {
    const res = await fetch(
      `https://api.mercadolibre.com/items?ids=${ids}&attributes=id,title,price,original_price,thumbnail`,
      {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) {
      console.error("[ML] Erro nos itens:", res.status);
      return NextResponse.json([], { status: res.status });
    }

    const raw: Array<{ code: number; body: Record<string, unknown> }> = await res.json();

    const products = raw
      .filter((e) => e.code === 200)
      .map((e) => {
        const b = e.body as {
          id: string;
          title: string;
          price: number;
          original_price: number | null;
          thumbnail: string;
        };
        return {
          id:             b.id,
          title:          b.title,
          price:          b.price,
          original_price: b.original_price ?? null,
          thumbnail:      b.thumbnail,
        };
      });

    console.log(`[ML] ✅ ${products.length}/${ids.split(",").length} produtos retornados`);
    return NextResponse.json(products);
  } catch (err) {
    console.error("[ML] Exceção:", err);
    return NextResponse.json([], { status: 500 });
  }
}