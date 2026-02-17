"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { FaChevronLeft, FaChevronRight, FaShoppingCart, FaStore } from "react-icons/fa";
import Image from "next/image";
import { AFFILIATE_PRODUCTS_MAP } from "@/app/lib/products-config";

interface OfertaItem {
  _id: string;
  title: string;
  imagem: string;
  price: number;
  storeName: string;
  affiliateLink: string;
}

// Dados estáticos iniciais — renderiza imediatamente com títulos e fallback de imagem
const STATIC_OFERTAS: OfertaItem[] = AFFILIATE_PRODUCTS_MAP.map(p => ({
  _id: p.mlbId,
  title: p.title,
  imagem: p.imagemFallback,
  price: 0,
  storeName: "Mercado Livre",
  affiliateLink: p.affiliateLink,
}));

export function OfertasCarousel() {
  const [ofertas, setOfertas] = useState<OfertaItem[]>(STATIC_OFERTAS);
  const [loading, setLoading] = useState(true);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", slidesToScroll: 1 },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  // Busca direta do browser → ML API aceita CORS, sem passar pelo servidor Next.js
  useEffect(() => {
    const ids = AFFILIATE_PRODUCTS_MAP.map(p => p.mlbId);

    Promise.all(
      ids.map(async (mlbId) => {
        try {
          const res = await fetch(
            `https://api.mercadolibre.com/items/${mlbId}?attributes=id,title,price,thumbnail,thumbnail_id,permalink`
          );
          if (!res.ok) return null;
          const item = await res.json();
          const mapping = AFFILIATE_PRODUCTS_MAP.find(p => p.mlbId === item.id);

          const imagem = item.thumbnail_id
            ? `https://http2.mlstatic.com/D_NQ_NP_${item.thumbnail_id}-V.jpg`
            : item.thumbnail?.replace("-I.jpg", "-O.jpg") || mapping?.imagemFallback || "";

          return {
            _id: item.id,
            title: item.title,
            imagem,
            price: item.price,
            storeName: "Mercado Livre",
            affiliateLink: mapping?.affiliateLink || item.permalink,
          } as OfertaItem;
        } catch {
          return null;
        }
      })
    ).then(results => {
      const valid = results.filter((r): r is OfertaItem => r !== null);
      if (valid.length > 0) setOfertas(valid);
    }).finally(() => setLoading(false));
  }, []);

  const formatMoney = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

  return (
    <div className="relative group/carousel max-w-7xl mx-auto px-4">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y -ml-4">
          {ofertas.map((oferta) => (
            <div
              key={oferta._id}
              className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_25%] min-w-0 pl-4 py-4"
            >
              <article className="flex flex-col bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:border-primary transition-colors duration-300 shadow-sm h-full">

                {/* Imagem */}
                <div className="relative aspect-[4/3] bg-white p-4">
                  <div className="absolute top-2 left-2 z-10 bg-black/80 text-white text-[10px] px-2 py-1 rounded flex items-center gap-1">
                    <FaStore /> {oferta.storeName}
                  </div>
                  <a
                    href={oferta.affiliateLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full h-full relative"
                  >
                    {oferta.imagem ? (
                      <Image
                        src={oferta.imagem}
                        alt={oferta.title}
                        fill
                        className="object-contain hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        unoptimized // imagens externas do ML, sem necessidade de otimização Next
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-neutral-800 rounded">
                        <FaStore className="text-4xl text-gray-300" />
                      </div>
                    )}
                  </a>
                </div>

                {/* Conteúdo */}
                <div className="p-4 flex flex-col grow">
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 line-clamp-2 min-h-[2.5rem] mb-2">
                    <a
                      href={oferta.affiliateLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary"
                    >
                      {oferta.title}
                    </a>
                  </h3>

                  {/* Preço */}
                  <div className="mt-auto mb-3">
                    {oferta.price > 0 ? (
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold text-green-600 dark:text-green-500">
                          {formatMoney(oferta.price)}
                        </span>
                        <span className="text-xs text-gray-500">à vista</span>
                      </div>
                    ) : (
                      <span className={`text-sm ${loading ? "text-gray-300 animate-pulse" : "text-gray-400 italic"}`}>
                        {loading ? "Carregando..." : "Ver preço no site"}
                      </span>
                    )}
                  </div>

                  {/* Botão */}
                  <a
                    href={oferta.affiliateLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2 rounded flex items-center justify-center gap-2 transition-colors text-sm"
                  >
                    <FaShoppingCart />
                    Pegar Promoção
                  </a>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={scrollPrev}
        className="absolute top-1/2 -left-2 md:-left-4 -translate-y-1/2 p-2 bg-white rounded-full shadow-lg text-primary hover:bg-primary hover:text-white transition-all z-20"
      >
        <FaChevronLeft />
      </button>
      <button
        onClick={scrollNext}
        className="absolute top-1/2 -right-2 md:-right-4 -translate-y-1/2 p-2 bg-white rounded-full shadow-lg text-primary hover:bg-primary hover:text-white transition-all z-20"
      >
        <FaChevronRight />
      </button>
    </div>
  );
}