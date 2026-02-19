// app/api/ml-products/route.ts
// Proxy server-side: faz o fetch com token OAuth, sem CORS

import { NextRequest, NextResponse } from "next/server";

async function getAccessToken(): Promise<string | null> {
  const appId     = process.env.ML_APP_ID;
  const appSecret = process.env.ML_SECRET;
  if (!appId || !appSecret) return null;

  const res = await fetch("https://api.mercadolibre.com/oauth/token", {
    method:  "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body:    new URLSearchParams({
      grant_type:    "client_credentials",
      client_id:     appId,
      client_secret: appSecret,
    }).toString(),
    cache: "no-store",
  });

  if (!res.ok) return null;
  const data = await res.json();
  return data.access_token ?? null;
}

export async function GET(req: NextRequest) {
  const ids = req.nextUrl.searchParams.get("ids");
  if (!ids) return NextResponse.json([], { status: 400 });

  const token = await getAccessToken();

  const headers: Record<string, string> = { Accept: "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  try {
    const res = await fetch(
      `https://api.mercadolibre.com/items?ids=${ids}&attributes=id,title,price,original_price,thumbnail`,
      { headers, next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      console.error("[ML Proxy] status:", res.status, await res.text());
      return NextResponse.json([], { status: res.status });
    }

    const raw: Array<{ code: number; body: Record<string, unknown> }> = await res.json();

    const products = raw
      .filter((e) => e.code === 200)
      .map((e) => {
        const b = e.body as {
          id: string; title: string; price: number;
          original_price: number | null; thumbnail: string;
        };
        return {
          id: b.id, title: b.title, price: b.price,
          original_price: b.original_price ?? null,
          thumbnail: b.thumbnail,
        };
      });

    return NextResponse.json(products);
  } catch (err) {
    console.error("[ML Proxy] erro:", err);
    return NextResponse.json([], { status: 500 });
  }
}