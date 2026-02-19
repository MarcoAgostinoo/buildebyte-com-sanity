// lib/affiliate-products.ts
// Adicione ou remova produtos aqui conforme necessário

export interface AffiliateProduct {
  itemId: string;       // ID do item específico (MLB + números)
  affiliateLink: string; // Seu link de afiliado
  category?: string;    // Categoria opcional para filtrar/agrupar
}

export const affiliateProducts: AffiliateProduct[] = [
  {
    itemId: "MLB5724725954",
    affiliateLink: "https://mercadolivre.com/sec/2771JwS",
    category: "Informática",
  },
  {
    itemId: "MLB5377872594",
    affiliateLink: "https://mercadolivre.com/sec/2gUZMuE",
    category: "Informática",
  },
  {
    itemId: "MLB4209467319",
    affiliateLink: "https://mercadolivre.com/sec/2Wey5Ru",
    category: "Games",
  },
  {
    itemId: "MLB6009607732",
    affiliateLink: "https://mercadolivre.com/sec/1vYuCA3",
    category: "Acessórios",
  },
  {
    itemId: "MLB5677284030",
    affiliateLink: "https://mercadolivre.com/sec/152iFwD",
    category: "Informática",
  },
  {
    itemId: "MLB4320059035",
    affiliateLink: "https://mercadolivre.com/sec/2CWVXEP",
    category: "Acessórios",
  },
  {
    itemId: "MLB5811879470",
    affiliateLink: "https://mercadolivre.com/sec/1Qe5TED",
    category: "Games",
  },
];