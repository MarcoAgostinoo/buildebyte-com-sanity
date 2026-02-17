import { ML_AFFILIATE_ID } from './products-config';

export async function getLiveOfertas(ids: string[]) {
  try {
    if (!ids || ids.length === 0) return [];

    const idsQuery = ids.join(',');
    // Buscamos os dados sem precisar de Token para informações públicas
    const response = await fetch(`https://api.mercadolibre.com/items?ids=${idsQuery}`, {
      next: { 
        revalidate: 3600, // O Next.js guardará esses dados por 1 hora (cache)
        tags: ['ml-products'] 
      }
    });

    if (!response.ok) throw new Error('Erro ao buscar dados do ML');
    
    const data = await response.json();

    return data.map((res: any) => {
      if (res.code !== 200) return null;
      const item = res.body;
      
      // Gerando link de afiliado simples
      // Se tiver um ID de afiliado configurado, adiciona o parâmetro matt_tool
      const affiliateLink = ML_AFFILIATE_ID && ML_AFFILIATE_ID !== "SEU_ID_DE_AFILIADO_AQUI"
        ? `${item.permalink}?matt_tool=${ML_AFFILIATE_ID}`
        : item.permalink;

      return {
        _id: item.id,
        title: item.title,
        slug: item.id, // Fallback para slug
        // O ML envia miniaturas pequenas por padrão. O código abaixo pega a imagem em alta resolução.
        imagem: item.thumbnail ? item.thumbnail.replace("-I.jpg", "-O.jpg") : '',
        price: item.price,
        originalPrice: item.original_price,
        installments: item.installments 
            ? `${item.installments.quantity}x de R$ ${item.installments.amount.toFixed(2)}` 
            : null,
        affiliateLink: affiliateLink,
        storeName: "Mercado Livre",
        description: "" // Campo de compatibilidade
      };
    }).filter(Boolean);
  } catch (error) {
    console.error("Erro na API do ML:", error);
    return [];
  }
}