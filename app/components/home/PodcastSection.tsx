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
      <div className="hidden md:grid grid-cols-2 gap-4 flex-1">
        {episodes.map((ep) => (
          <article
            key={ep.id}
            className="group flex flex-col border border-zinc-700 hover:border-zinc-500 bg-zinc-900/50 overflow-hidden transition-colors duration-200"
          >
            {/* Thumbnail */}
            <a
              href={ep.link}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-video overflow-hidden shrink-0 block"
            >
              <Image
                src={episodeImageSrc(ep)}
                alt={`Capa: ${ep.title}`}
                fill
                loading="lazy"
                sizes="(max-width: 1024px) 50vw, 33vw"
                quality={75}
                className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500 opacity-70 group-hover:opacity-100"
              />

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-linear-to-t from-zinc-950/90 via-transparent to-transparent pointer-events-none" />

              {/* Badge */}
              <span className="absolute top-3 left-3 text-[9px] font-black uppercase tracking-widest bg-primary text-white px-2.5 py-1">
                PODCAST
              </span>

              {/* Play icon */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center shadow-xl">
                  <svg className="w-5 h-5 text-white translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </a>

            {/* Content */}
            <div className="flex flex-col gap-2.5 p-4 flex-1">
              <a
                href={ep.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block flex-1"
              >
                <h3
                  className="font-black text-base text-zinc-100 group-hover:text-white leading-snug line-clamp-2 transition-colors uppercase"
                  style={{ fontFamily: "var(--font-bebas-neue, sans-serif)", letterSpacing: "0.02em", fontSize: "1.25rem" }}
                >
                  {ep.title}
                </h3>
              </a>

              {/* Meta */}
              <div className="flex items-center gap-2 pt-3 border-t border-zinc-700 mt-auto">
                <span className="text-[12px] font-mono tabular-nums text-white">
                  {formatDate(ep.pubDate)}
                </span>
                <span className="text-zinc-600">·</span>
                <span className="text-[10px] font-black uppercase tracking-wider text-white">
                  Vetor Cast
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* MOBILE CAROUSEL */}
      <div className="md:hidden">
        <PodcastCarousel episodes={episodes} defaultImage={DEFAULT_IMAGE} />
      </div>
    </div>
  );
}