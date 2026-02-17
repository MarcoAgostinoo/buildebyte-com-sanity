import { AFFILIATE_PRODUCTS_MAP } from './products-config';

// Interface para tipar a resposta da API do ML e evitar 'any'
interface MLResponseItem {
  code: number;
  body?: {
    id: string;
    title: string;
    price: number;
    thumbnail: string;       // ← campo correto para imagem
    thumbnail_id: string;    // ← ID da imagem para montar URL de alta qualidade
    permalink: string;
    [key: string]: unknown;
  };
}

export async function getLiveOfertas(filteredIds?: string[]) {
  const ids = filteredIds && filteredIds.length > 0
    ? filteredIds
    : AFFILIATE_PRODUCTS_MAP.map(p => p.mlbId);

  try {
    // ↓ Adicionamos 'thumbnail' e 'thumbnail_id' nos atributos buscados
    const url = `https://api.mercadolibre.com/items?ids=${ids.join(',')}&attributes=id,price,title,thumbnail,thumbnail_id,permalink`;

    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      console.error(`[ML Service] API retornou status ${response.status}`);
      throw new Error("API Offline");
    }

    const data: MLResponseItem[] = await response.json();

    const results = data.map((res) => {
      if (res.code !== 200 || !res.body) {
        console.warn(`[ML Service] Item com code ${res.code} ignorado.`);
        return null;
      }

      const item = res.body;
      const mapping = AFFILIATE_PRODUCTS_MAP.find(p => p.mlbId === item.id);

      // Monta URL de alta qualidade a partir do thumbnail_id (se disponível)
      // Formato oficial ML: https://http2.mlstatic.com/D_NQ_NP_{thumbnail_id}-V.jpg
      const imagem = item.thumbnail_id
        ? `https://http2.mlstatic.com/D_NQ_NP_${item.thumbnail_id}-V.jpg`
        : item.thumbnail?.replace('-I.jpg', '-O.jpg') || item.thumbnail || '';

      return {
        _id: item.id,
        title: item.title,
        imagem,
        price: item.price,
        affiliateLink: mapping?.affiliateLink || item.permalink,
        storeName: "Mercado Livre"
      };
    }).filter(Boolean);

    console.log(`[ML Service] ${results.length}/${ids.length} produtos carregados com sucesso.`);
    return results;

  } catch (error) {
    console.error('[ML Service] Falha ao buscar da API. Usando fallback.', error);

    // FALLBACK com thumbnail direto (URL pública do ML por ID)
    const fallbackList = filteredIds
      ? AFFILIATE_PRODUCTS_MAP.filter(p => filteredIds.includes(p.mlbId))
      : AFFILIATE_PRODUCTS_MAP;

    return fallbackList.map(prod => ({
      _id: prod.mlbId,
      title: "Oferta Especial Hardware",
      // Thumbnail público disponível sem autenticação
      imagem: `https://http2.mlstatic.com/D_NQ_NP_2X_${prod.mlbId.replace('MLB', '')}-F.jpg`,
      price: 0,
      affiliateLink: prod.affiliateLink,
      storeName: "Mercado Livre"
    }));
  }
}