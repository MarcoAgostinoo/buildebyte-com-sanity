import { AFFILIATE_PRODUCTS_MAP } from './products-config';

interface MLItem {
  id: string;
  title: string;
  price: number;
  thumbnail: string;
  thumbnail_id: string;
  permalink: string;
}

async function fetchSingleItem(mlbId: string): Promise<MLItem | null> {
  try {
    const res = await fetch(
      `https://api.mercadolibre.com/items/${mlbId}?attributes=id,title,price,thumbnail,thumbnail_id,permalink`,
      {
        headers: { 'Accept': 'application/json' },
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) {
      console.warn(`[ML Service] Item ${mlbId} retornou status ${res.status}`);
      return null;
    }

    return await res.json();
  } catch (err) {
    console.warn(`[ML Service] Falha ao buscar ${mlbId}:`, err);
    return null;
  }
}

export async function getLiveOfertas(filteredIds?: string[]) {
  const ids = filteredIds && filteredIds.length > 0
    ? filteredIds
    : AFFILIATE_PRODUCTS_MAP.map(p => p.mlbId);

  // Busca todos em paralelo (sem autenticação — endpoint público)
  const results = await Promise.all(ids.map(fetchSingleItem));

  const ofertas = results
    .filter((item): item is MLItem => item !== null)
    .map(item => {
      const mapping = AFFILIATE_PRODUCTS_MAP.find(p => p.mlbId === item.id);

      // URL de alta qualidade usando thumbnail_id
      const imagem = item.thumbnail_id
        ? `https://http2.mlstatic.com/D_NQ_NP_${item.thumbnail_id}-V.jpg`
        : item.thumbnail?.replace('-I.jpg', '-O.jpg') || item.thumbnail || '';

      return {
        _id: item.id,
        title: item.title,
        imagem,
        price: item.price,
        affiliateLink: mapping?.affiliateLink || item.permalink,
        storeName: 'Mercado Livre',
        slug: '',
        description: '',
      };
    });

  console.log(`[ML Service] ${ofertas.length}/${ids.length} produtos carregados.`);

  // Fallback: se nenhum item carregou, retorna estrutura mínima com links
  if (ofertas.length === 0) {
    console.warn('[ML Service] Nenhum item carregado. Usando fallback.');
    const fallbackList = filteredIds
      ? AFFILIATE_PRODUCTS_MAP.filter(p => filteredIds.includes(p.mlbId))
      : AFFILIATE_PRODUCTS_MAP;

    return fallbackList.map(prod => ({
      _id: prod.mlbId,
      title: 'Oferta Especial Hardware',
      imagem: '',
      price: 0,
      affiliateLink: prod.affiliateLink,
      storeName: 'Mercado Livre',
      slug: '',
      description: '',
    }));
  }

  return ofertas;
}