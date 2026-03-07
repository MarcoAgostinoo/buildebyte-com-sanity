import Link from "next/link";
import Image from "next/image";
import { Episode } from "@/app/lib/podcast-service";
import { formatDate } from "@/app/lib/utils";
import PodcastCarousel from "../PodcastCarousel";

const DEFAULT_IMAGE = "/images/placeholder.png";

type PodcastSectionProps = {
    episodes: Episode[];
};

export default function PodcastSection({ episodes }: PodcastSectionProps) {
    return (
        <main className="lg:col-span-9 flex flex-col p-4 gap-4 bg-amber-50">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black uppercase tracking-tighter">
                    Vetor Estratégico Cast
                </h2>
                <span className="bg-green-500/10 text-green-900 text-[10px] font-bold px-2 py-1 animate-pulse uppercase">
                    Ao Vivo / Recentes
                </span>
            </div>

            <div className="hidden md:grid grid-cols-2 gap-x-8 gap-y-12">
                {episodes.map((ep: Episode) => (
                    <article key={ep.id} className="group">
                        <a
                            href={ep.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block relative aspect-video overflow-hidden mb-4"
                        >
                            <Image
                                src={
                                    ep.image && ep.image.startsWith("http")
                                        ? ep.image
                                        : `https://vetorestrategico.com${ep.image || DEFAULT_IMAGE}`
                                }
                                alt={`Capa do episódio ${ep.title}`}
                                fill
                                loading="lazy"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                quality={75}
                                className="object-cover transition-transform group-hover:scale-105"
                            />
                            <span className="absolute bottom-3 left-3 bg-[#0070f3] text-white text-[10px] font-black px-2 py-0.5 uppercase tracking-widest">
                                PODCAST
                            </span>
                        </a>
                        <a
                            href={ep.link}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <h3 className="text-2xl font-black leading-tight text-zinc-900 group-hover:text-[#0070f3] transition-colors mb-2">
                                {ep.title}
                            </h3>
                        </a>
                        <p className="text-sm text-zinc-500 font-medium">
                            Postado em {formatDate(ep.pubDate)} •{" "}
                            <span className="text-zinc-800">
                                Vetor Estratégico Cast
                            </span>
                        </p>
                    </article>
                ))}
            </div>

            <div className="md:hidden">
                <PodcastCarousel episodes={episodes} defaultImage={DEFAULT_IMAGE} />
            </div>
        </main>
    );
}
