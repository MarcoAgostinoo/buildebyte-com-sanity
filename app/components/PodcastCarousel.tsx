'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { formatDate } from "@/app/lib/utils";

interface Episode {
  id: string;
  title: string;
  link: string;
  audio: string;
  pubDate: string;
  content: string;
  image?: string;
}

export default function PodcastCarousel({ episodes = [], defaultImage }: { episodes: Episode[], defaultImage: string }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start' });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback((index: number) => {
    emblaApi?.scrollTo(index);
  }, [emblaApi]);

  if (!episodes || episodes.length === 0) return null;

  return (
    <div className="md:hidden">
      <div className="overflow-hidden -mx-4 px-4" ref={emblaRef}>
        <div className="flex gap-4">
          {episodes.map((ep) => (
            <article key={ep.id} className="flex-[0_0_85%] min-w-0">
              <a href={ep.link} target="_blank" rel="noopener noreferrer" className="block group" aria-label={`Ouvir podcast: ${ep.title}`}>
                <div className="relative aspect-video overflow-hidden mb-3">
                  <Image
                    src={ep.image || defaultImage}
                    alt={ep.title}
                    fill
                    // 👇 A MÁGICA DA PERFORMANCE NO MOBILE
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <span className="absolute bottom-2 left-2 bg-[#0070f3] text-white text-[9px] font-black px-1.5 py-0.5 uppercase">
                    PODCAST
                  </span>
                </div>
                <h4 className="font-bold text-zinc-900 dark:text-white text-base line-clamp-2 leading-tight">
                  {ep.title}
                </h4>
                <p className="text-[11px] text-zinc-500 mt-1">
                  {formatDate(ep.pubDate)} • Build & Byte Cast
                </p>
              </a>
            </article>
          ))}
        </div>
      </div>
      
      {/* Dots Indicator */}
      <div className="flex justify-center gap-1.5 mt-4">
        {episodes.map((_, idx) => (
          <button
            key={idx}
            // 👇 A MÁGICA DA ACESSIBILIDADE
            aria-label={`Ir para o episódio ${idx + 1} do carrossel`}
            className={`h-1.5 transition-all ${
              selectedIndex === idx ? "bg-[#0070f3] w-4" : "bg-zinc-300 w-1.5"
            }`}
            onClick={() => scrollTo(idx)}
          />
        ))}
      </div>
    </div>
  );
}