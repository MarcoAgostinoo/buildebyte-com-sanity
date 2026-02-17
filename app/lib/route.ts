import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // O Mercado Livre envia um corpo avisando qual item mudou
    const body = await request.json();

    // Se o tópico for "items", limpamos o cache para o site buscar o preço novo
    if (body.topic === "items") {
      // @ts-expect-error: Discrepância de tipos no ambiente Next.js atual
      revalidateTag('ml-products');
      console.log(`Cache limpo para o item: ${body.resource}`);
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
  }
}