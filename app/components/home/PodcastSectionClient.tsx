"use client";

import dynamic from "next/dynamic";
import { Episode } from "@/app/lib/podcast-service";

const PodcastSection = dynamic(() => import("./PodcastSection"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col gap-4 flex-1">
      <div className="grid grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex flex-col border border-zinc-700 overflow-hidden">
            <div className="aspect-video bg-zinc-800 animate-pulse" />
            <div className="flex flex-col gap-2 p-4">
              <div className="h-4 w-3/4 bg-zinc-800 animate-pulse" />
              <div className="h-3 w-1/2 bg-zinc-800 animate-pulse mt-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
});

export default function PodcastSectionClient({ episodes }: { episodes: Episode[] }) {
  return (
    <div className="flex flex-col h-full">

      {/* HEADER — estilos inline para escapar do global.css h2 override */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-700">
        <div className="flex flex-col gap-1">
          <p
            className="font-black uppercase tracking-[0.3em]"
            style={{ fontSize: "0.925rem", color: "#71717a" }} /* Escurecido: de #9ca3af para #71717a */
          >
            Transmissão Estratégica
          </p>
          <h2
            className="font-black uppercase leading-none tracking-tight"
            style={{
              fontFamily: "var(--font-bebas-neue, sans-serif)",
              fontSize: "1.875rem",  /* text-3xl */
              color: "#a1a1aa", /* Escurecido: de #ffffff para #a1a1aa */
              marginBottom: 0,
            }}
          >
            Vetor Estratégico Cast
          </h2>
        </div>

        {/* Live badge */}
        <div className="ml-auto flex items-center gap-2 border border-zinc-600 bg-zinc-900 px-3 py-1.5">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          <span
            className="font-black uppercase tracking-[0.2em]"
            style={{ fontSize: "0.925rem", color: "#a1a1aa" }} /* Escurecido: de #d1d5db para #a1a1aa */
          >
            Ao Vivo / Recentes
          </span>
        </div>
      </div>

      <PodcastSection episodes={episodes} />
    </div>
  );
}