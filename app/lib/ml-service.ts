import { AFFILIATE_PRODUCTS_MAP } from './products-config';

export async function getLiveOfertas(ids: string[]) {
  try {
    if (!ids || ids.length === 0) return [];

    const idsQuery = ids.join(',');
    const attributes = 'id,title,price,original_price,thumbnail,status,installments,permalink';
    
    // Tentativa de busca sem o header de Authorization para evitar o erro 403 de escopo
    const response = await fetch(`https://api.mercadolibre.com/items?ids=${idsQuery}&attributes=${attributes}`, {
      next: { 
        revalidate: 3600, // O Next.js guardará esses dados por 1 hora (cache)
        tags: ['ml-products'] 
      }
    });

    if (!response.ok) {
      throw new Error(`Erro ML: ${response.status}`);
    }
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any[] = await response.json();

    return data.map((res) => {
      if (res.code !== 200 || !res.body || res.body.status !== 'active') return null;
      
      const item = res.body;
      const mapping = AFFILIATE_PRODUCTS_MAP.find(p => p.mlbId === item.id);

      return {
        _id: item.id,
        title: item.title,
        slug: item.id, // Fallback para slug
        imagem: item.thumbnail ? item.thumbnail.replace("-I.jpg", "-O.jpg") : '',
        price: item.price,
        originalPrice: item.original_price,
        installments: item.installments 
            ? `${item.installments.quantity}x de R$ ${item.installments.amount.toFixed(2)}` 
            : undefined,
        affiliateLink: mapping ? mapping.affiliateLink : item.permalink,
        storeName: "Mercado Livre",
        description: ""
      };
    }).filter((item): item is NonNullable<typeof item> => Boolean(item));
  } catch (error) {
    console.error("Erro na API do ML:", error);
    return [];
  }
}