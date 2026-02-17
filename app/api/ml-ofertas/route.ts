import { NextResponse } from 'next/server';
import { AFFILIATE_PRODUCTS_MAP } from '@/app/lib/products-config';

const BROWSER_HEADERS = {
  'Accept': 'application/json',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept-Language': 'pt-BR,pt;q=0.9',
};

export async function GET() {
  const ids = AFFILIATE_PRODUCTS_MAP.map(p => p.mlbId);

  const results = await Promise.all(
    ids.map(async (mlbId) => {
      try {
        const res = await fetch(
          `https://api.mercadolibre.com/items/${mlbId}`,
          { headers: BROWSER_HEADERS }
          // Sem 'next: { revalidate }' aqui — o cache é feito no response abaixo
        );
        if (!res.ok) return null;
        const item = await res.json();
        const mapping = AFFILIATE_PRODUCTS_MAP.find(p => p.mlbId === item.id);

        const imagem = item.thumbnail_id
          ? `https://http2.mlstatic.com/D_NQ_NP_${item.thumbnail_id}-V.jpg`
          : item.thumbnail?.replace('-I.jpg', '-O.jpg') || '';

        return {
          _id: item.id,
          title: item.title,
          imagem,
          price: item.price,
          affiliateLink: mapping?.affiliateLink || item.permalink,
          storeName: 'Mercado Livre',
        };
      } catch {
        return null;
      }
    })
  );

  const ofertas = results.filter(Boolean);

  return NextResponse.json(ofertas, {
    headers: {
      // Cache de 1 hora no CDN/browser
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
