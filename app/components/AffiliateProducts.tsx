// app/components/AffiliateProducts.tsx
import Image from "next/image";

interface Props {
  category?: string;
  title?: string;
}

interface AffiliateProduct {
  itemId: string;
  affiliateLink: string;
  category?: string;
}

interface MLProduct {
  id: string;
  title: string;
  price: number;
  original_price: number | null;
  thumbnail: string;
  affiliateLink: string;
}

// ✅ Seus produtos — edite à vontade
const affiliateProducts: AffiliateProduct[] = [
  { itemId: "MLB5724725954", affiliateLink: "https://mercadolivre.com/sec/2771JwS",  category: "Informática" },
  { itemId: "MLB5377872594", affiliateLink: "https://mercadolivre.com/sec/2gUZMuE",  category: "Informática" },
  { itemId: "MLB4209467319", affiliateLink: "https://mercadolivre.com/sec/2Wey5Ru",  category: "Games"       },
  { itemId: "MLB6009607732", affiliateLink: "https://mercadolivre.com/sec/1vYuCA3",  category: "Acessórios"  },
  { itemId: "MLB5677284030", affiliateLink: "https://mercadolivre.com/sec/152iFwD",  category: "Informática" },
  { itemId: "MLB4320059035", affiliateLink: "https://mercadolivre.com/sec/2CWVXEP",  category: "Acessórios"  },
  { itemId: "MLB5811879470", affiliateLink: "https://mercadolivre.com/sec/1Qe5TED",  category: "Games"       },
];

async function getAccessToken(): Promise<string | null> {
  const appId     = process.env.ML_APP_ID;
  const appSecret = process.env.ML_SECRET;

  if (!appId || !appSecret) {
    console.error("[ML] ML_APP_ID ou ML_SECRET não definidos no .env.local");
    return null;
  }

  try {
    const body = new URLSearchParams({
      grant_type:    "client_credentials",
      client_id:     appId,
      client_secret: appSecret,
    });

    const res = await fetch("https://api.mercadolibre.com/oauth/token", {
      method:  "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body:    body.toString(),
      cache:   "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("[ML] Erro no token:", data);
      return null;
    }

    console.log("[ML] Token obtido com sucesso ✅");
    return data.access_token as string;
  } catch (err) {
    console.error("[ML] Exceção ao obter token:", err);
    return null;
  }
}

async function fetchMLProduct(
  itemId: string,
  token: string
): Promise<Omit<MLProduct, "affiliateLink"> | null> {
  try {
    const res = await fetch(`https://api.mercadolibre.com/items/${itemId}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "User-Agent":    "buildebyte/1.0",
      },
      next: { revalidate: 3600 },
    });

    const data = await res.json();

    if (!res.ok) {
      console.error(`[ML] Erro ao buscar ${itemId}:`, res.status, data);
      return null;
    }

    console.log(`[ML] ${itemId} → ${data.title} | R$ ${data.price} ✅`);

    return {
      id:             data.id,
      title:          data.title,
      price:          data.price,
      original_price: data.original_price ?? null,
      thumbnail:      (data.thumbnail as string).replace("I.jpg", "O.jpg"),
    };
  } catch (err) {
    console.error(`[ML] Exceção ao buscar ${itemId}:`, err);
    return null;
  }
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("pt-BR", {
    style:    "currency",
    currency: "BRL",
  }).format(price);
}

function calcDiscount(original: number, current: number) {
  return Math.round(((original - current) / original) * 100);
}

export default async function AffiliateProducts({ category, title }: Props) {
  const token = await getAccessToken();

  if (!token) {
    console.error("[ML] Sem token — componente não será renderizado");
    return null;
  }

  const filtered = category
    ? affiliateProducts.filter((p) => p.category === category)
    : affiliateProducts;

  const results = await Promise.all(
    filtered.map((p) => fetchMLProduct(p.itemId, token))
  );

  const products: MLProduct[] = results
    .map((ml, i) =>
      ml ? { ...ml, affiliateLink: filtered[i].affiliateLink } : null
    )
    .filter((p): p is MLProduct => p !== null);

  console.log(`[ML] ${products.length}/${filtered.length} produtos carregados`);

  if (products.length === 0) return null;

  return (
    <section className="w-full py-8">
      {title && (
        <h2 className="text-2xl font-black uppercase tracking-tighter mb-8">
          {title}
        </h2>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => {
          const hasDiscount =
            product.original_price !== null &&
            product.original_price > product.price;
          const discount = hasDiscount
            ? calcDiscount(product.original_price!, product.price)
            : 0;

          return (
            <a
              key={product.id}
              href={product.affiliateLink}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="group flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
            >
              {/* Imagem */}
              <div className="relative w-full aspect-square bg-zinc-50 dark:bg-zinc-950">
                <Image
                  src={product.thumbnail}
                  alt={product.title}
                  fill
                  className="object-contain p-3"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  unoptimized
                />
                {discount > 0 && (
                  <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    -{discount}%
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex flex-col flex-1 p-3">
                <p className="text-xs text-zinc-700 dark:text-zinc-300 line-clamp-2 flex-1 mb-3 group-hover:text-[#0070f3] transition-colors leading-snug">
                  {product.title}
                </p>

                <div>
                  {hasDiscount && (
                    <p className="text-xs text-zinc-400 line-through">
                      {formatPrice(product.original_price!)}
                    </p>
                  )}
                  <p className="text-lg font-black text-zinc-900 dark:text-white">
                    {formatPrice(product.price)}
                  </p>
                </div>

                <div className="mt-3 w-full bg-yellow-400 hover:bg-yellow-500 text-zinc-900 font-bold text-xs text-center py-2 px-3 rounded-lg transition-colors">
                  Ver no Mercado Livre
                </div>
              </div>
            </a>
          );
        })}
      </div>

      <p className="text-xs text-zinc-400 mt-4 text-center font-mono">
        * Links de afiliado • Preços atualizados automaticamente
      </p>
    </section>
  );
}