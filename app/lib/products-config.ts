export const AFFILIATE_PRODUCTS_MAP = [
  {
    mlbId: "MLB4214670787",
    affiliateLink: "https://mercadolivre.com/sec/1BZ9y86",
    title: "PS5 Slim Digital",
    imagemFallback: "https://http2.mlstatic.com/D_NQ_NP_2X_914414-MLA74232499492_012024-F.jpg",
  },
  {
    mlbId: "MLB5933610210",
    affiliateLink: "https://mercadolivre.com/sec/2mQWe72",
    title: "Smart TV Samsung",
    imagemFallback: "https://http2.mlstatic.com/D_NQ_NP_2X_617325-MLA71937706646_092023-F.jpg",
  },
  {
    mlbId: "MLB5237338738",
    affiliateLink: "https://mercadolivre.com/sec/1Jx5TGM",
    title: "Moto G15",
    imagemFallback: "https://http2.mlstatic.com/D_NQ_NP_2X_617325-MLA71937706646_092023-F.jpg",
  },
  {
    mlbId: "MLB4270030011",
    affiliateLink: "https://mercadolivre.com/sec/1ygn2x2",
    title: "PS5 Slim com Leitor",
    imagemFallback: "https://http2.mlstatic.com/D_NQ_NP_2X_914414-MLA74232499492_012024-F.jpg",
  },
  {
    mlbId: "MLB5364063272",
    affiliateLink: "https://mercadolivre.com/sec/2cEzVbW",
    title: "Impressora Epson",
    imagemFallback: "https://http2.mlstatic.com/D_NQ_NP_2X_617325-MLA71937706646_092023-F.jpg",
  },
  {
    mlbId: "MLB4395367359",
    affiliateLink: "https://mercadolivre.com/sec/2L9P99z",
    title: "Ventilador Mondial",
    imagemFallback: "https://http2.mlstatic.com/D_NQ_NP_2X_617325-MLA71937706646_092023-F.jpg",
  },
  {
    mlbId: "MLB4304709309",
    affiliateLink: "https://mercadolivre.com/sec/22rDctd",
    title: "Acer Nitro V15",
    imagemFallback: "https://http2.mlstatic.com/D_NQ_NP_2X_617325-MLA71937706646_092023-F.jpg",
  },
];

export const FEATURED_ML_IDS = AFFILIATE_PRODUCTS_MAP.map(p => p.mlbId);

export const ML_APP_ID = process.env.ML_APP_ID || "";
export const ML_SECRET = process.env.ML_SECRET || "";
export const ML_AFFILIATE_ID = process.env.ML_AFFILIATE_ID || "";