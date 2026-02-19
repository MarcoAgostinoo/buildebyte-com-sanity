"use client";
// app/components/AffiliateProducts.tsx

import { useEffect, useState } from "react";
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

const affiliateProducts: AffiliateProduct[] = [
  { itemId: "MLB5724725954", affiliateLink: "https://mercadolivre.com/sec/2771JwS",  category: "Informática" },
  { itemId: "MLB5377872594", affiliateLink: "https://mercadolivre.com/sec/2gUZMuE",  category: "Informática" },
  { itemId: "MLB4209467319", affiliateLink: "https://mercadolivre.com/sec/2Wey5Ru",  category: "Games"       },
  { itemId: "MLB6009607732", affiliateLink: "https://mercadolivre.com/sec/1vYuCA3",  category: "Acessórios"  },
  { itemId: "MLB5677284030", affiliateLink: "https://mercadolivre.com/sec/152iFwD",  category: "Informática" },
  { itemId: "MLB4320059035", affiliateLink: "https://mercadolivre.com/sec/2CWVXEP",  category: "Acessórios"  },
  { itemId: "MLB5811879470", affiliateLink: "https://mercadolivre.com/sec/1Qe5TED",  category: "Games"       },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);
}

function calcDiscount(original: number, current: number) {
  return Math.round(((original - current) / original) * 100);
}

function SkeletonCard() {
  return (
    <div className="flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden animate-pulse">
      <div className="w-full aspect-square bg-zinc-100 dark:bg-zinc-800" />
      <div className="p-3 flex flex-col gap-2">
        <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-full" />
        <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4" />
        <div className="h-5 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2 mt-2" />
        <div className="h-8 bg-zinc-200 dark:bg-zinc-700 rounded w-full mt-1" />
      </div>
    </div>
  );
}

export default function AffiliateProducts({ category, title }: Props) {
  const [products, setProducts] = useState<MLProduct[]>([]);
  const [loading, setLoading]   = useState(true);

  const filtered = category
    ? affiliateProducts.filter((p) => p.category === category)
    : affiliateProducts;

  useEffect(() => {
    const ids = filtered.map((p) => p.itemId).join(",");

    fetch(`/api/ml-products?ids=${ids}`)
      .then((r) => r.json())
      .then((data: Array<{ id: string; title: string; price: number; original_price: number | null; thumbnail: string }>) => {
        const loaded: MLProduct[] = data
          .filter((item) => item?.title)
          .map((item) => {
            const affiliate = filtered.find((p) => p.itemId === item.id)!;
            return {
              ...item,
              thumbnail:    item.thumbnail?.replace("I.jpg", "O.jpg") ?? "",
              affiliateLink: affiliate.affiliateLink,
            };
          });
        setProducts(loaded);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  return (
    <section className="w-full py-8">
      {title && (
        <h2 className="text-2xl font-black uppercase tracking-tighter mb-8">
          {title}
        </h2>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading
          ? filtered.map((_, i) => <SkeletonCard key={i} />)
          : products.map((product) => {
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
                  <div className="relative w-full aspect-square bg-zinc-50 dark:bg-zinc-950">
                    {product.thumbnail ? (
                      <Image
                        src={product.thumbnail}
                        alt={product.title}
                        fill
                        className="object-contain p-3"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-300 dark:text-zinc-700">
                        <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    {discount > 0 && (
                      <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        -{discount}%
                      </span>
                    )}
                  </div>

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