"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Interface dos dados que virão prontos do servidor
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

  // Se a lista vier vazia, não renderiza nada
  if (!posts || posts.length === 0) {
    return null;
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const bodyHeight = document.body.offsetHeight;
      
      // Aparece quando o usuário rolar 80% da página
      if (scrollPosition >= bodyHeight * 0.8) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-4 right-4 w-80 z-50 bg-(--card-bg)  shadow-2xl p-4 transition-transform duration-500 ease-in-out border border-(--border) ${
        isVisible ? 'translate-x-0' : 'translate-x-[150%]'
      }`}
    >
      <div className="flex justify-between items-center mb-2">
         <h3 className="font-bold text-lg text-primary">Leia a seguir</h3>
         <button 
           onClick={() => setIsVisible(false)} 
           className="text-xs text-gray-500 hover:text-red-500 transition-colors"
           aria-label="Fechar recomendação"
         >
           Fechar
         </button>
      </div>
      
      <div className="space-y-4">
        {posts.map(post => (
          <Link href={`/post/${post.slug}`} key={post.slug}>
            <div className="flex items-center gap-4 hover:bg-primary/10 p-2  transition-colors group">
              <div className="w-16 h-16 relative flex-shrink-0 overflow-hidden ">
                {post.imagem ? (
                    <Image
                      src={post.imagem}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-400">
                    Sem img
                  </div>
                )}
              </div>
              <span className="text-sm font-semibold text-foreground/80 line-clamp-3 group-hover:text-primary transition-colors">
                {post.title}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}