import Image from "next/image";
import { Episode } from "@/app/lib/podcast-service";
import { formatDate } from "@/app/lib/utils";
import PodcastCarousel from "../PodcastCarousel";

const DEFAULT_IMAGE = "/images/placeholder.png";

function episodeImageSrc(ep: Episode): string {
  if (!ep.image) return DEFAULT_IMAGE;
  if (ep.image.startsWith("http")) return ep.image;
  return `https://vetorestrategico.com${ep.image}`;
}

export default function PodcastSection({ episodes }: { episodes: Episode[] }) {
  return (
    <div className="flex flex-col h-full">

      {/* DESKTOP GRID */}
      <div className="hidden md:grid grid-cols-2 gap-6 flex-1">
        {episodes.map((ep) => (
          <article
            key={ep.id}
            className="group flex flex-col bg-[#111318] border border-[#2a2f3a] hover:border-primary/50 overflow-hidden transition-all duration-300 relative shadow-md"
          >
            {/* Thumbnail */}
            <a
              href={ep.link}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-video overflow-hidden shrink-0 block border-b border-[#2a2f3a]"
            >
              <Image
                src={episodeImageSrc(ep)}
                alt={`Capa: ${ep.title}`}
                fill
                loading="lazy"
                sizes="(max-width: 1024px) 50vw, 33vw"
                quality={75}
                className="object-cover grayscale-50 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 opacity-80 group-hover:opacity-100 sepia-[.2]"
              />

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-linear-to-t from-[#111318] via-transparent to-transparent opacity-90 pointer-events-none" />

              {/* Badge de Transmissão */}
              <span className="absolute top-3 left-3 text-[12px] font-black uppercase tracking-[0.2em] bg-black/80 backdrop-blur-sm text-primary border border-primary/30 px-2.5 py-1">
                Áudio
              </span>

              {/* Play icon (Aparece no Hover) */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center shadow-[0_0_25px_rgba(var(--primary-rgb),0.6)] backdrop-blur-md">
                  <svg className="w-6 h-6 text-white translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </a>

            {/* Content */}
            <div className="flex flex-col gap-3 p-5 flex-1 relative z-10">
              <a
                href={ep.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block flex-1"
              >
                <h3 className="font-black text-sm text-zinc-200 group-hover:text-primary leading-snug line-clamp-2 transition-colors uppercase tracking-wide">
                  {ep.title}
                </h3>
              </a>

              {/* Meta Info */}
              <div className="flex items-center justify-between pt-4 border-t border-[#2a2f3a]/60 mt-auto">
                <span className="text-[12px] font-mono font-bold text-zinc-500 uppercase">
                  {formatDate(ep.pubDate)}
                </span>
                <span className="text-[12px] font-black uppercase tracking-[0.2em] text-zinc-600 group-hover:text-primary transition-colors">
                  Ouvir Relatório
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* MOBILE CAROUSEL */}
      <div className="md:hidden mt-2">
        <PodcastCarousel episodes={episodes} defaultImage={DEFAULT_IMAGE} />
      </div>
    </div>
  );
}