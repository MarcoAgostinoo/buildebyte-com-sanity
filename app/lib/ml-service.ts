import { AFFILIATE_PRODUCTS_MAP, ML_APP_ID, ML_SECRET } from './products-config';

// Cache simples em memória para o token
let cachedToken: string | null = null;
let tokenExpiry = 0;

async function getAccessToken() {
  if (!ML_APP_ID || !ML_SECRET) return null;
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;

  try {
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', ML_APP_ID);
    params.append('client_secret', ML_SECRET);

    const res = await fetch('https://api.mercadolibre.com/oauth/token', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: params,
      cache: 'no-store'
    });

    if (!res.ok) return null;

    const data = await res.json();
    cachedToken = data.access_token;
    tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000;
    return cachedToken;
  } catch {
    return null;
  }
}

export async function getLiveOfertas(ids: string[]) {
  try {
    if (!ids || ids.length === 0) return [];

    const token = await getAccessToken();
    const headers: HeadersInit = {
      'User-Agent': 'BuildEByte/1.0',
      'Accept': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const idsQuery = ids.join(',');
    const attributes = 'id,title,price,original_price,thumbnail,status,installments,permalink';
    
    const response = await fetch(`https://api.mercadolibre.com/items?ids=${idsQuery}&attributes=${attributes}`, {
      headers,
      next: { 
        revalidate: 3600, // O Next.js guardará esses dados por 1 hora (cache)
        tags: ['ml-products'] 
      }
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      throw new Error(`Erro ML: ${response.status} ${errorBody}`);
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