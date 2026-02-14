"use client";

import React, { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { FaChevronLeft, FaChevronRight, FaShoppingCart, FaStore } from "react-icons/fa";
import Image from "next/image";

interface OfertaItem {
  _id: string;
  title: string;
  slug: string;
  imagem: string;
  price: number;
  originalPrice?: number;
  installments?: string;
  storeName?: string;
  affiliateLink: string;
  description: string;
}

interface OfertasCarouselProps {
  ofertas: OfertaItem[];
}

export function OfertasCarousel({ ofertas }: OfertasCarouselProps) {
  // Configuração do Embla: align 'start' ajuda a manter o espaçamento correto
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    align: "start",
    slidesToScroll: 1 // No mobile scrolla 1, você pode ajustar via breakpoints se quiser
  }, [
    Autoplay({ delay: 5000, stopOnInteraction: false })
  ]);
  
  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const formatMoney = (value: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  return (
    <div className="relative group/carousel max-w-7xl mx-auto px-4">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y -ml-4"> {/* Margem negativa para compensar o gap interno */}
          {ofertas.map((oferta) => (
            /* A MÁGICA ESTÁ AQUI:
               - flex-[0_0_100%]: 1 item no mobile (largura 100%)
               - md:flex-[0_0_50%]: 2 itens no tablet
               - lg:flex-[0_0_25%]: 4 itens no desktop
            */
            <div key={oferta._id} className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_25%] min-w-0 pl-4 py-4">
              <article className="flex flex-col bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:border-primary transition-colors duration-300 shadow-sm h-full">
                
                {/* Imagem + Loja */}
                <div className="relative aspect-[4/3] bg-white p-4">
                  {oferta.storeName && (
                    <div className="absolute top-2 left-2 z-10 bg-black/80 text-white text-[10px] px-2 py-1 rounded flex items-center gap-1">
                      <FaStore /> {oferta.storeName}
                    </div>
                  )}
                  <a href={oferta.affiliateLink} target="_blank" rel="noopener noreferrer" className="block w-full h-full relative">
                    <Image
                      src={oferta.imagem}
                      alt={oferta.title}
                      fill
                      className="object-contain hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </a>
                </div>

                {/* Conteúdo */}
                <div className="p-4 flex flex-col grow">
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 line-clamp-2 min-h-[2.5rem] mb-2">
                    <a href={oferta.affiliateLink} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                      {oferta.title}
                    </a>
                  </h3>

                  {/* Preços */}
                  <div className="mt-auto mb-3">
                    {oferta.originalPrice && (
                      <span className="text-xs text-gray-400 line-through block">
                        De: {formatMoney(oferta.originalPrice)}
                      </span>
                    )}
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-bold text-green-600 dark:text-green-500">
                        {formatMoney(oferta.price)}
                      </span>
                      <span className="text-xs text-gray-500">à vista</span>
                    </div>
                    {oferta.installments && (
                      <span className="text-[10px] text-gray-500 block">
                        {oferta.installments}
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
      
      {/* Botões de Navegação - Ocultos em telas muito pequenas se preferir, ou ajustados */}
      <button 
        onClick={scrollPrev} 
        className="absolute top-1/2 -left-2 md:-left-4 -translate-y-1/2 p-2 bg-white rounded-full shadow-lg text-primary hover:bg-primary hover:text-white transition-all z-20"
      >
        <FaChevronLeft/>
      </button>
      <button 
        onClick={scrollNext} 
        className="absolute top-1/2 -right-2 md:-right-4 -translate-y-1/2 p-2 bg-white rounded-full shadow-lg text-primary hover:bg-primary hover:text-white transition-all z-20"
      >
        <FaChevronRight/>
      </button>
    </div>
  );
}