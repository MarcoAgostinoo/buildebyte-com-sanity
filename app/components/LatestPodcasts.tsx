import React from 'react';
import Image from 'next/image';

interface Episode {
  id: string;
  title: string;
  link: string;
  audio: string;
  pubDate: string;
  content: string;
  image?: string;
}

async function getPodcasts() {
  // Em ambiente de dev, use localhost. Em prod, sua URL completa.
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  
  try {
    const res = await fetch(`${baseUrl}/api/podcasts`, {
      next: { revalidate: 3600 } // Revalida o cache a cada hora
    });

    if (!res.ok) {
      return { episodes: [] };
    }

    return res.json();
  } catch (error) {
    console.error('Erro ao buscar podcasts:', error);
    return { episodes: [] };
  }
}

export default async function LatestPodcasts() {
  const { episodes } = await getPodcasts();

  if (!episodes || episodes.length === 0) {
    return null;
  }

  return (
    <section className="py-0">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {episodes.map((episode: Episode) => (
          <div key={episode.id} className="border  p-4 shadow-sm hover:shadow-md transition bg-white">
            {/* Imagem de Capa */}
            {episode.image && (
              <div className="relative w-full h-48 mb-4">
                <Image 
                  src={episode.image} 
                  alt={episode.title} 
                  fill
                  loading="lazy"
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            )}
            
            <h3 className="font-semibold text-lg mb-2 line-clamp-2">
              {episode.title}
            </h3>
            
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {episode.content}
            </p>

            {/* Player de Áudio Nativo */}
            <audio controls className="w-full mt-auto mb-4">
              <source src={episode.audio} type="audio/mpeg" />
              Seu navegador não suporta o elemento de áudio.
            </audio>
            
            <a 
              href={episode.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block text-blue-600 text-sm font-medium hover:underline"
            >
              Ouvir no Spotify &rarr;
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}