"use client";

import React, { useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { FaChevronLeft, FaChevronRight, FaShoppingCart, FaStore } from "react-icons/fa";
import Image from "next/image";
import { client } from "@/app/lib/sanity";
import { createImageUrlBuilder } from "@sanity/image-url";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const builder = createImageUrlBuilder(client as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function urlFor(source: any) {
  // 👈 Adicionamos .auto("format") para garantir que o Sanity entregue WebP sempre que possível!
  return builder.image(source).width(400).height(400).fit("fillmax").auto("format").url();
}

export interface Oferta {
  _id: string;
  title: string;
  price: number;
  originalPrice?: number;
  installments?: string;
  storeName?: string;
  affiliateLink: string;
  mainImage?: object;
  description?: string;
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function calcDiscount(original: number, current: number) {
  return Math.round(((original - current) / original) * 100);
}

export function OfertasCarousel({ ofertas }: { ofertas: Oferta[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", slidesToScroll: 1 },
    [Autoplay({ delay: 5000, stopOnInteraction: false, playOnInit: false })]
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (emblaApi) {
      const autoplay = emblaApi.plugins().autoplay;
      if (!autoplay) return;

      // Inicia o autoplay após 2 segundos para aliviar o TBT inicial
      const timer = setTimeout(() => autoplay.play(), 2000);
      return () => clearTimeout(timer);
    }
  }, [emblaApi]);

  return (
    <div className="w-full">
      {/* Aviso legal */}
      <div className="relative group/carousel max-w-9xl mx-auto px-4">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex touch-pan-y -ml-4">

            {ofertas.map((oferta) => {
                  const hasDiscount = !!oferta.originalPrice && oferta.originalPrice > oferta.price;
                  const discount    = hasDiscount ? calcDiscount(oferta.originalPrice!, oferta.price) : 0;
                  const imgUrl      = oferta.mainImage ? urlFor(oferta.mainImage) : null;

                  return (
                    <div
                      key={oferta._id}
                      className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_25%] min-w-0 pl-4 py-4"
                    >
                      <article className="flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:shadow-lg hover:border-zinc-400 dark:hover:border-zinc-600 transition-all duration-300 h-full">

                        {/* Imagem */}
                        <div className="relative aspect-square bg-zinc-50 dark:bg-zinc-950 p-4">
                          {/* Badge loja */}
                          <div className="absolute top-2 left-2 z-10 bg-black/70 text-white text-[10px] px-2 py-1 flex items-center gap-1">
                            <FaStore size={9} />
                            {oferta.storeName || "Mercado Livre"}
                          </div>

                          {/* Badge desconto */}
                          {discount > 0 && (
                            <div className="absolute top-2 right-2 z-10 bg-green-500 text-white text-[10px] font-bold px-2 py-1">
                              -{discount}%
                            </div>
                          )}

                          <a
                            href={oferta.affiliateLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Ver imagem da oferta: ${oferta.title}`} // 👈 Acessibilidade da imagem
                            className="block w-full h-full relative"
                          >
                            {imgUrl ? (
                              <Image
                                src={imgUrl}
                                alt={oferta.title}
                                fill
                                className="object-contain hover:scale-105 transition-transform duration-300"
                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <FaStore className="text-4xl text-zinc-300 dark:text-zinc-700" />
                              </div>
                            )}
                          </a>
                        </div>

                        {/* Conteúdo */}
                        <div className="p-4 flex flex-col flex-1">
                          <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 line-clamp-2 min-h-10 mb-2">
                            <a
                              href={oferta.affiliateLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-[#0070f3] transition-colors"
                            >
                              {oferta.title}
                            </a>
                          </h3>

                          {oferta.description && (
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-2">
                              {oferta.description}
                            </p>
                          )}

                          {/* Preço */}
                          <div className="mt-auto mb-4">
                            {hasDiscount && (
                              <p className="text-xs text-zinc-400 line-through">
                                {formatMoney(oferta.originalPrice!)}
                              </p>
                            )}
                            <div className="flex items-baseline gap-1 flex-wrap">
                              <span className="text-xl font-black text-green-600 dark:text-green-400">
                                {formatMoney(oferta.price)}
                              </span>
                              <span className="text-[10px] text-zinc-400">*</span>
                            </div>
                            {oferta.installments && (
                              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                                {oferta.installments}
                              </p>
                            )}
                          </div>

                          {/* Botão */}
                          <a
                            href={oferta.affiliateLink}
                            target="_blank"
                            rel="noopener noreferrer sponsored"
                            aria-label={`Pegar promoção do produto: ${oferta.title}`} // 👈 Resolve o erro "Links idênticos"
                            className="w-full bg-yellow-400 hover:bg-yellow-500 text-zinc-900 font-bold py-2 flex items-center justify-center gap-2 transition-colors text-sm"
                          >
                            <FaShoppingCart size={13} />
                            Pegar Promoção
                          </a>
                        </div>
                      </article>
                    </div>
                  );
                })}
          </div>
        </div>

        {/* Setas */}
        <button
          onClick={scrollPrev}
          aria-label="Ver ofertas anteriores" // 👈 Resolve o erro "Botões não têm um nome"
          className="absolute top-1/2 -left-2 md:-left-4 -translate-y-1/2 p-3 bg-white dark:bg-zinc-800 shadow-lg text-zinc-700 dark:text-zinc-200 hover:bg-yellow-400 hover:text-zinc-900 transition-all z-20"
        >
          <FaChevronLeft />
        </button>
        <button
          onClick={scrollNext}
          aria-label="Ver próximas ofertas" // 👈 Resolve o erro "Botões não têm um nome"
          className="absolute top-1/2 -right-2 md:-right-4 -translate-y-1/2 p-3 bg-white dark:bg-zinc-800 shadow-lg text-zinc-700 dark:text-zinc-200 hover:bg-yellow-400 hover:text-zinc-900 transition-all z-20"
        >
          <FaChevronRight />
        </button>
      </div>

      <p className="text-xs text-zinc-400 mt-2 text-center font-mono">
        * Preços atualizados manualmente • Links de afiliado — podemos receber comissão sem custo adicional para você
      </p>
    </div>
  );
}