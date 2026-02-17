import { AFFILIATE_PRODUCTS_MAP } from './products-config';

interface MLItem {
  id: string;
  title: string;
  price: number;
  thumbnail: string;
  thumbnail_id: string;
  permalink: string;
}

// User-Agent de browser real para evitar bloqueio 403 da API do ML
const BROWSER_HEADERS = {
  'Accept': 'application/json',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept-Language': 'pt-BR,pt;q=0.9',
};

async function fetchSingleItem(mlbId: string): Promise<MLItem | null> {
  try {
    const res = await fetch(
      `https://api.mercadolibre.com/items/${mlbId}`,
      {
        headers: BROWSER_HEADERS,
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

function buildImageUrl(item: MLItem): string {
  if (item.thumbnail_id) {
    return `https://http2.mlstatic.com/D_NQ_NP_${item.thumbnail_id}-V.jpg`;
  }
  if (item.thumbnail) {
    return item.thumbnail.replace('-I.jpg', '-O.jpg');
  }
  return '/placeholder-produto.png'; // fallback local
}

export async function getLiveOfertas(filteredIds?: string[]) {
  const ids = filteredIds && filteredIds.length > 0
    ? filteredIds
    : AFFILIATE_PRODUCTS_MAP.map(p => p.mlbId);

  const results = await Promise.all(ids.map(fetchSingleItem));

  const ofertas = results
    .filter((item): item is MLItem => item !== null)
    .map(item => {
      const mapping = AFFILIATE_PRODUCTS_MAP.find(p => p.mlbId === item.id);
      return {
        _id: item.id,
        title: item.title,
        imagem: buildImageUrl(item),
        price: item.price,
        affiliateLink: mapping?.affiliateLink || item.permalink,
        storeName: 'Mercado Livre',
      };
    });

  console.log(`[ML Service] ${ofertas.length}/${ids.length} produtos carregados.`);

  // Fallback: se API bloqueou, usa dados estáticos do products-config
  if (ofertas.length === 0) {
    console.warn('[ML Service] API indisponível. Usando fallback estático.');
    const fallbackList = filteredIds
      ? AFFILIATE_PRODUCTS_MAP.filter(p => filteredIds.includes(p.mlbId))
      : AFFILIATE_PRODUCTS_MAP;

    return fallbackList.map(prod => ({
      _id: prod.mlbId,
      title: prod.title ?? 'Oferta Especial',
      imagem: prod.imagemFallback ?? '/placeholder-produto.png', // ← veja nota abaixo
      price: 0,
      affiliateLink: prod.affiliateLink,
      storeName: 'Mercado Livre',
    }));
  }

  return ofertas;
}