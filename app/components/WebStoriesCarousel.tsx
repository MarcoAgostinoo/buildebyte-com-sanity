"use client";

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import Image from "next/image";
import { FaPlay } from "react-icons/fa";
// 1. Importação da função do GA4 do Next.js
import { sendGAEvent } from '@next/third-parties/google';

interface WebStory {
  _id: string;
  title: string;
  slug: string;
  coverImage: string;
}

export function WebStoriesCarousel({ webStories }: { webStories: WebStory[] }) {
  // Configuração focada em mobile: 1 slide por vez, centralizado
  const [emblaRef] = useEmblaCarousel({ 
    align: "center", 
    loop: false,
    containScroll: "trimSnaps" 
  });

  // 2. Função que dispara o evento de clique para o Google Analytics
  const handleStoryClick = (storyTitle: string) => {
    sendGAEvent('event', 'click_web_story', {
      story_title: storyTitle,
      section: 'home_carousel'
    });
  };

  return (
    /* md:hidden remove a seção completamente no PC */
    <section className="mb-12 md:hidden">
      <div className="flex items-center gap-2 mb-6 px-4">
        <h2 className="text-xl font-black text-foreground uppercase tracking-tight flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
          </span>
          Web Stories
        </h2>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {webStories.map((story) => (
            /* flex-[0_0_100%] garante 1 por vez. Se quiser ver a beiradinha do próximo, use 85% */
            <div key={story._id} className="flex-[0_0_100%] min-w-0 px-4">
              <Link 
                href={`/web-stories/${story.slug}`}
                // 3. Adicionamos o evento de clique aqui no Link
                onClick={() => handleStoryClick(story.title)}
                className="relative block aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl group border-[3px] border-transparent active:border-pink-500"
              >
                {story.coverImage && (
                  <Image
                    src={story.coverImage}
                    alt={story.title}
                    fill
                    loading="lazy"
                    sizes="100vw"
                    className="object-cover"
                  />
                )}
                
                {/* Overlay Gradiente */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-6 flex flex-col justify-end">
                  <div className="absolute top-4 right-4 text-white/90 bg-black/40 rounded-full p-2 backdrop-blur-sm">
                    <FaPlay size={12} />
                  </div>
                  <h3 className="text-white text-lg font-bold leading-tight drop-shadow-lg">
                    {story.title}
                  </h3>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
      
      {/* Indicador de Swipe */}
      <p className="text-center text-foreground/40 text-[10px] mt-4 uppercase tracking-widest font-bold">
        Arraste para o lado
      </p>
    </section>
  );
}