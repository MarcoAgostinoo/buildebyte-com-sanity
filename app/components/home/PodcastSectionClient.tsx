"use client";

import dynamic from "next/dynamic";
import { Episode } from "@/app/lib/podcast-service";

const PodcastSection = dynamic(() => import("./PodcastSection"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col h-full bg-[#0a0b0d] border border-[#2a2f3a] p-6 shadow-lg">
      <div className="h-6 w-1/3 bg-[#111318] border border-[#2a2f3a] animate-pulse mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex flex-col border border-[#2a2f3a] overflow-hidden bg-[#111318]">
            <div className="aspect-video bg-zinc-900 animate-pulse" />
            <div className="flex flex-col gap-3 p-5">
              <div className="h-4 w-full bg-zinc-800 animate-pulse" />
              <div className="h-4 w-2/3 bg-zinc-800 animate-pulse" />
              <div className="h-3 w-1/3 bg-[#2a2f3a] animate-pulse mt-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
});

export default function PodcastSectionClient({ episodes }: { episodes: Episode[] }) {
  return (
    <div className="flex flex-col h-full bg-[#0a0b0d] border border-[#2a2f3a] shadow-lg relative overflow-hidden">
      
      {/* HEADER DO PODCAST */}
      <div className="p-5 border-b border-[#2a2f3a] bg-[#111318] flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div className="flex flex-col gap-1">
          <p className="text-[12px] font-black uppercase tracking-[0.3em] text-primary/70 font-mono">
            Frequência Aberta
          </p>
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-zinc-100">
            Vetor Estratégico <span className="text-primary">Cast</span>
          </h2>
        </div>

        {/* Live / Recentes Badge Tático */}
        <div className="flex items-center gap-2 border border-red-900/50 bg-red-500/10 px-3 py-1.5 shrink-0">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
          <span className="text-[12px] font-black uppercase tracking-widest text-red-500 font-mono">
            Sinal Ativo
          </span>
        </div>
      </div>

      <div className="p-5 flex-1 relative z-10">
        <PodcastSection episodes={episodes} />
      </div>

      {/* DETALHES DE FUNDO */}
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
    </div>
  );
}