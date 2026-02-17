import { ML_AFFILIATE_ID } from './products-config';

interface MLResponseItem {
  code: number;
  body: {
    id: string;
    title: string;
    permalink: string;
    thumbnail: string;
    price: number;
    original_price: number;
    installments: {
      quantity: number;
      amount: number;
    } | null;
  };
}

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

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Sem detalhes');
      throw new Error(`API respondeu com status ${response.status} (${response.statusText}): ${errorText}`);
    }
    
    const data: MLResponseItem[] = await response.json();

    return data.map((res) => {
      if (res.code !== 200) return null;
      const item = res.body;
      
      // Gerando link de afiliado simples
      // Se tiver um ID de afiliado configurado, adiciona o parâmetro matt_tool
      // Cast to string to avoid type overlap error if config is literal
      const isPlaceholder = (ML_AFFILIATE_ID as string) === "SEU_ID_DE_AFILIADO_AQUI";
      const affiliateLink = ML_AFFILIATE_ID && !isPlaceholder
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
            : undefined,
        affiliateLink: affiliateLink,
        storeName: "Mercado Livre",
        description: "" // Campo de compatibilidade
      };
    }).filter((item): item is NonNullable<typeof item> => Boolean(item));
  } catch (error) {
    console.error("Erro na API do ML:", error);
    return [];
  }
}