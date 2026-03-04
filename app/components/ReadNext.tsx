"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export interface RelatedPost {
  title: string;
  slug: string;
  imagem: string;
}

interface ReadNextProps {
  posts: RelatedPost[]; 
}

export default function ReadNext({ posts }: ReadNextProps) {
  const [isVisible, setIsVisible] = useState(false);
  // Novo estado para rastrear se o usuário fechou manualmente
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Se não houver posts ou se o usuário já fechou, não ativa o listener
    if (!posts || posts.length === 0 || isDismissed) {
        setIsVisible(false);
        return;
    }

    const handleScroll = () => {
      // Se o usuário já fechou, ignora qualquer cálculo de scroll
      if (isDismissed) return;

      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;
      
      // Aparece quando o usuário chega aos 75% da página
      if (scrollY + windowHeight >= fullHeight * 0.75) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [posts, isDismissed]); // Reage a mudanças nos posts ou no fechamento

  // Função para fechar e impedir que reapareça
  const handleManualClose = () => {
    setIsVisible(false);
    setIsDismissed(true);
  };

  if (!posts || posts.length === 0) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 w-72 sm:w-80 z-[100] bg-zinc-900 shadow-2xl p-4 transition-all duration-500 ease-in-out border border-primary/30 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-[150%] opacity-0'
      }`}
    >
      <div className="flex justify-between items-center mb-4">
         <h3 className="font-black text-xs uppercase tracking-tighter text-primary">Recomendado</h3>
         <button 
           onClick={handleManualClose} 
           className="text-[10px] font-bold text-zinc-500 hover:text-white uppercase transition-colors"
         >
           Fechar [x]
         </button>
      </div>
      
      <div className="space-y-4">
        {posts.map(post => (
          <Link href={`/post/${post.slug}`} key={post.slug} className="group block">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 relative shrink-0 overflow-hidden border border-zinc-800">
                {post.imagem ? (
                    <Image
                      src={post.imagem}
                      alt={post.title}
                      fill
                      sizes="48px"
                      className="object-cover group-hover:scale-110 transition-transform"
                    />
                ) : (
                  <div className="w-full h-full bg-zinc-800" />
                )}
              </div>
              <span className="text-[11px] font-bold text-zinc-100 line-clamp-2 group-hover:text-primary transition-colors">
                {post.title}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}