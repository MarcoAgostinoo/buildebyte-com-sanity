"use client";

import React, { useCallback } from "react";
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
  return builder.image(source).width(400).height(400).fit("fillmax").auto("format").quality(75).url();
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
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="w-full">
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
                      className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.33%] min-w-0 pl-4 py-4"
                    >
                      {/* CARD TÁTICO: Fundos e Bordas hardcoded para blindar contra CSS global */}
                      <article className="flex flex-col bg-[#111318] border border-[#2a2f3a] hover:border-[#c8a84b]/50 hover:shadow-[0_0_15px_rgba(200,168,75,0.15)] transition-all duration-300 h-full relative group">
                        
                        {/* Elementos visuais de HUD Militar */}
                        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#c8a84b] opacity-0 group-hover:opacity-100 transition-opacity z-20"></div>
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#c8a84b] opacity-0 group-hover:opacity-100 transition-opacity z-20"></div>

                        {/* Imagem Container */}
                        <div className="relative aspect-square bg-black/80 p-4 border-b border-[#2a2f3a]">
                          
                          {/* Badge loja */}
                          <div className="absolute top-2 left-2 z-10 bg-[#0a0b0d]/90 border border-[#2a2f3a] !text-zinc-300 text-[12px] uppercase tracking-widest px-2 py-1 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-[#27ae60] rounded-full animate-pulse"></span>
                            {oferta.storeName || "Estoque Geral"}
                          </div>

                          {/* Badge desconto */}
                          {discount > 0 && (
                            <div className="absolute top-2 right-2 z-10 bg-[#c0392b] !text-white text-[12px] font-black tracking-wider px-2 py-1">
                              -{discount}%
                            </div>
                          )}

                          <a
                            href={oferta.affiliateLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Ver imagem da oferta: ${oferta.title}`}
                            className="block w-full h-full relative"
                          >
                            {imgUrl ? (
                              <Image
                                src={imgUrl}
                                alt={oferta.title}
                                fill
                                loading="lazy"
                                className="object-contain p-4 hover:scale-105 transition-transform duration-500 filter brightness-90 group-hover:brightness-110"
                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <FaStore className="text-4xl !text-[#2a2f3a]" />
                              </div>
                            )}
                          </a>
                        </div>

                        {/* Conteúdo Textual */}
                        <div className="p-5 flex flex-col flex-1">
                          <h3 className="text-lg font-black line-clamp-2 min-h-10 mb-2 uppercase tracking-tight">
                            {/* !text-zinc-100 blinda o link contra a regra global azul */}
                            <a
                              href={oferta.affiliateLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="!text-zinc-100 hover:!text-[#c8a84b] transition-colors"
                            >
                              {oferta.title}
                            </a>
                          </h3>

                          {oferta.description && (
                            <p className="text-base !text-zinc-400 line-clamp-2 mb-3 border-l-2 border-[#c8a84b]/30 pl-2">
                              {oferta.description}
                            </p>
                          )}

                          {/* Preço */}
                          <div className="mt-auto mb-4">
                            {hasDiscount && (
                              <p className="text-[12px] !text-zinc-500 line-through mb-0.5">
                                {formatMoney(oferta.originalPrice!)}
                              </p>
                            )}
                            <div className="flex items-baseline gap-2 flex-wrap">
                              <span className="text-xl font-black !text-[#c8a84b]">
                                {formatMoney(oferta.price)}
                              </span>
                            </div>
                            {oferta.installments && (
                              <p className="text-[12px] !text-zinc-500 mt-1 uppercase tracking-wider">
                                {oferta.installments}
                              </p>
                            )}
                          </div>

                          {/* Botão de Compra */}
                          <a
                            href={oferta.affiliateLink}
                            target="_blank"
                            rel="noopener noreferrer sponsored"
                            aria-label={`Adquirir equipamento: ${oferta.title}`}
                            className="w-full bg-[#161a20] border border-[#c8a84b]/30 hover:bg-[#c8a84b] !text-[#c8a84b] hover:!text-[#0a0b0d] font-black py-2.5 flex items-center justify-center gap-2 transition-all text-base uppercase tracking-[0.15em]"
                          >
                            <FaShoppingCart size={12} />
                            Adquirir Equipamento
                          </a>
                        </div>
                      </article>
                    </div>
                  );
                })}
          </div>
        </div>

        {/* Setas Táticas */}
        <button
          onClick={scrollPrev}
          aria-label="Ver ofertas anteriores"
          className="absolute top-1/2 -left-2 md:-left-4 -translate-y-1/2 p-3 bg-[#0a0b0d]/90 border border-[#c8a84b]/30 shadow-lg !text-[#c8a84b] hover:bg-[#c8a84b] hover:!text-[#0a0b0d] transition-all z-20 opacity-0 group-hover/carousel:opacity-100"
        >
          <FaChevronLeft />
        </button>
        <button
          onClick={scrollNext}
          aria-label="Ver próximas ofertas"
          className="absolute top-1/2 -right-2 md:-right-4 -translate-y-1/2 p-3 bg-[#0a0b0d]/90 border border-[#c8a84b]/30 shadow-lg !text-[#c8a84b] hover:bg-[#c8a84b] hover:!text-[#0a0b0d] transition-all z-20 opacity-0 group-hover/carousel:opacity-100"
        >
          <FaChevronRight />
        </button>
      </div>

      <p className="text-[12px] !text-zinc-500 mt-4 text-center font-mono uppercase tracking-widest">
        * Inventário sujeito a alteração • Logística via parceiros afiliados
      </p>
    </div>
  );
}
