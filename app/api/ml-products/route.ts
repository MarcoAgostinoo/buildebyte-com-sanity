// app/api/ml-products/route.ts
// Endpoint: GET /api/ml-products?ids=MLB123,MLB456

import { NextRequest, NextResponse } from "next/server";

export interface MLProduct {
  id: string;
  title: string;
  price: number;
  original_price: number | null;
  currency_id: string;
  thumbnail: string;
  condition: string;
  available_quantity: number;
}

async function fetchProduct(itemId: string): Promise<MLProduct | null> {
  try {
    const res = await fetch(`https://api.mercadolibre.com/items/${itemId}`, {
      next: { revalidate: 3600 }, // cache de 1 hora
    });

    if (!res.ok) return null;

    const data = await res.json();

    return {
      id: data.id,
      title: data.title,
      price: data.price,
      original_price: data.original_price,
      currency_id: data.currency_id,
      thumbnail: data.thumbnail.replace("I.jpg", "O.jpg"), // imagem maior
      condition: data.condition,
      available_quantity: data.available_quantity,
    };
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.get("ids");

  if (!ids) {
    return NextResponse.json({ error: "IDs não informados" }, { status: 400 });
  }

  const itemIds = ids.split(",").map((id) => id.trim());

  const products = await Promise.all(itemIds.map(fetchProduct));

  return NextResponse.json(products.filter(Boolean));
}