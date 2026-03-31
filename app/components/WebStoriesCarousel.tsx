"use client";

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import Image from "next/image";
import { FaPlay } from "react-icons/fa";
// Importação da função do GA4 do Next.js
import { sendGAEvent } from '@next/third-parties/google';

// 1. Interface atualizada para refletir o novo Backend
export interface WebStory {
  _id: string;
  title: string;
  slug: string;
  coverImage: string;
  description?: string;
  ctaText?: string;
  authorName?: string; // Campo extraído via GROQ Query
  publishedAt?: string; // Campo novo de data
}

export function WebStoriesCarousel({ webStories }: { webStories: WebStory[] }) {
  // Configuração focada em mobile: alinhamento central com espaço nas laterais
  const [emblaRef] = useEmblaCarousel({ 
    align: "center", 
    loop: false,
    containScroll: "trimSnaps" 
  });

  // Previne a renderização se o array estiver vazio
  if (!webStories || webStories.length === 0) {
    return null;
  }

  // Função para formatar a data (Ex: 05 ABR)
  const formatStoryDate = (dateString?: string) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
                 .replace('.', '')
                 .toUpperCase();
    } catch {
      return null;
    }
  };

  // Função do Google Analytics
  const handleStoryClick = (storyTitle: string) => {
    sendGAEvent('event', 'click_web_story', {
      story_title: storyTitle,
      section: 'home_carousel'
    });
  };

  return (
    /* md:hidden remove a seção no PC. mb-12 para espaçamento tático */
    <section className="mb-12 md:hidden" aria-label="Web Stories de Defesa e Inteligência">
      <div className="flex items-center gap-2 mb-6 px-4">
        <h2 className="text-xl font-black text-foreground uppercase tracking-tight flex items-center gap-2">
          {/* Animação Radar (Vermelho Vetor Estratégico) */}
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
          </span>
          Web Stories
        </h2>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {webStories.map((story) => (
            /* 85% garante que a beirada da próxima story apareça, gerando curiosidade */
            <div key={story._id} className="flex-[0_0_85%] min-w-0 px-3">
              <Link 
                href={`/web-stories/${story.slug}`}
                onClick={() => handleStoryClick(story.title)}
                className="relative block aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl group border-[3px] border-transparent active:border-red-500 transition-all duration-300"
              >
                {story.coverImage && (
                  <Image
                    src={story.coverImage}
                    alt={story.title}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 85vw, 100vw"
                    className="object-cover transition-transform duration-500 group-active:scale-105"
                  />
                )}
                
                {/* Overlay Gradiente Escuro para leitura perfeita de texto */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent p-6 flex flex-col justify-end">
                  
                  {/* Ícone Play (Indica formato vídeo/story) */}
                  <div className="absolute top-4 right-4 text-white/90 bg-black/50 rounded-full p-2 backdrop-blur-sm shadow-lg border border-white/10">
                    <FaPlay size={12} />
                  </div>

                  {/* NOVO: Linha de Metadados (Data e Autor) */}
                  {(story.publishedAt || story.authorName) && (
                    <div className="flex items-center gap-2 mb-2 font-black tracking-widest text-[10px] uppercase">
                      {story.publishedAt && (
                        <span className="text-red-500 drop-shadow-md">
                          {formatStoryDate(story.publishedAt)}
                        </span>
                      )}
                      
                      {story.publishedAt && story.authorName && (
                        <span className="text-white/30">•</span>
                      )}

                      {story.authorName && (
                        <span className="text-white/70 drop-shadow-md line-clamp-1">
                          {story.authorName}
                        </span>
                      )}
                    </div>
                  )}

                  <h3 className="text-white text-lg font-bold leading-tight drop-shadow-lg mb-2">
                    {story.title}
                  </h3>
                  
                  {story.description && (
                    <p className="text-white/80 text-xs leading-tight drop-shadow-sm line-clamp-2">
                      {story.description}
                    </p>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
      
      {/* Indicador de Deslize */}
      <p className="text-center text-foreground/40 text-[11px] mt-5 uppercase tracking-[0.25em] font-black">
        Arraste para o lado
      </p>
    </section>
  );
}