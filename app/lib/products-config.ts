// Mapeamento extraído dos seus links: mlbId para API / link para o Botão
export const AFFILIATE_PRODUCTS_MAP = [
  { mlbId: "MLB4214670787", affiliateLink: "https://mercadolivre.com/sec/1BZ9y86" }, // PS5 Slim Digital
  { mlbId: "MLB5933610210", affiliateLink: "https://mercadolivre.com/sec/2mQWe72" }, // Smart TV Samsung
  { mlbId: "MLB5237338738", affiliateLink: "https://mercadolivre.com/sec/1Jx5TGM" }, // Moto G15
  { mlbId: "MLB4270030011", affiliateLink: "https://mercadolivre.com/sec/1ygn2x2" }, // PS5 Slim Disk
  { mlbId: "MLB5364063272", affiliateLink: "https://mercadolivre.com/sec/2cEzVbW" }, // Impressora Epson
  { mlbId: "MLB4395367359", affiliateLink: "https://mercadolivre.com/sec/2L9P99z" }, // Ventilador Mondial
  { mlbId: "MLB4304709309", affiliateLink: "https://mercadolivre.com/sec/22rDctd" }, // Acer Nitro V15
];

// IDs apenas para a consulta na API
export const FEATURED_ML_IDS = AFFILIATE_PRODUCTS_MAP.map(p => p.mlbId);

// Credenciais da API
export const ML_APP_ID = process.env.ML_APP_ID || "";
export const ML_SECRET = process.env.ML_SECRET || "";

// Substitua pelo seu ID de Afiliado para gerar links automáticos
export const ML_AFFILIATE_ID = process.env.ML_AFFILIATE_ID || "";