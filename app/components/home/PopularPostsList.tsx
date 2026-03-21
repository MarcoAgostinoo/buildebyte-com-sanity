import Link from "next/link";
import Image from "next/image";
import { CategoryWithPosts } from "@/app/lib";

// ---------------------------------------------------------------------------
// CORES DE PILAR: Escurecidas para tons mais sóbrios
// ---------------------------------------------------------------------------
const PILLAR_COLOR: Record<string, { border: string; text: string; bg: string }> = {
  geopolitica_defesa: { border: "#2d4263", text: "#4a6fa5", bg: "rgba(31,58,95,0.15)" },
  arsenal_tecnologia: { border: "#a68a3d", text: "#b89d5a", bg: "rgba(200,168,75,0.12)" },
  teatro_operacoes:   { border: "#922b21", text: "#b03a2e", bg: "rgba(192,57,43,0.12)"  },
};

const PILLAR_LABEL: Record<string, string> = {
  geopolitica_defesa: "Geopolítica",
  arsenal_tecnologia: "Arsenal",
  teatro_operacoes:   "Teatro Op.",
};

type Post = CategoryWithPosts["posts"][number];

export default function PopularPostsList({ posts }: { posts: Post[] }) {
  return (
    <div className="flex flex-col h-full">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-zinc-800">
        <div className="flex flex-col gap-1">
          <p className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: "#4b5563" }}>
            Inteligência Editorial
          </p>
          <h2
            className="font-black uppercase leading-none tracking-tight"
            style={{
              fontFamily: "var(--font-bebas-neue, sans-serif)",
              fontSize: "1.875rem",
              color: "#a1a1aa", // Cinza médio (zinc-400) em vez de branco puro
              marginBottom: 0,
            }}
          >
            Mais Populares
          </h2>
        </div>
        {/* Signal bars */}
        <div className="ml-auto flex items-end gap-[3px]">
          {[4, 6, 8, 10, 13].map((h, i) => (
            <div
              key={i}
              className="w-[3px] bg-primary/40"
              style={{ height: `${h}px`, opacity: 0.25 + i * 0.1 }}
            />
          ))}
        </div>
      </div>

      {/* LIST */}
      <div className="flex flex-col divide-y divide-zinc-800/50 flex-1">
        {posts.map((post, index) => {
          const ps = post.pillar ? (PILLAR_COLOR[post.pillar] ?? null) : null;
          const pl = post.pillar ? (PILLAR_LABEL[post.pillar] ?? null) : null;

          return (
            <Link
              key={post._id}
              href={`/post/${post.slug}`}
              className="group flex items-stretch gap-3 py-4 hover:bg-zinc-900/40 -mx-2 px-2 transition-colors duration-200"
            >
              {/* Index - Escurecido */}
              <span
                className="font-black tabular-nums leading-none shrink-0 w-9 pt-0.5 group-hover:text-primary transition-colors"
                style={{
                  fontFamily: "var(--font-bebas-neue, sans-serif)",
                  fontSize: "2.25rem",
                  color: "#3f3f46",    /* zinc-700 — tom de sombra */
                  lineHeight: 1,
                }}
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              {/* Thumbnail */}
              {post.imagem && (
                <div className="relative w-[72px] shrink-0 overflow-hidden bg-zinc-900 self-stretch min-h-[54px] border border-zinc-800/50">
                  <Image
                    src={post.imagem}
                    alt={post.title}
                    fill
                    sizes="72px"
                    className="object-cover grayscale opacity-40 group-hover:opacity-80 transition-all duration-500"
                  />
                </div>
              )}

              {/* Text - Título Escurecido */}
              <div className="flex flex-col justify-between gap-1.5 flex-1 min-w-0">
                {pl && ps && (
                  <span
                    className="self-start text-[12px] font-black uppercase tracking-[0.18em] px-1.5 py-0.5 border"
                    style={{ color: ps.text, borderColor: ps.border, backgroundColor: ps.bg }}
                  >
                    {pl}
                  </span>
                )}
                <h3
                  className="font-black uppercase leading-snug line-clamp-2 tracking-wide transition-all"
                  style={{
                    fontSize: "1.175rem",
                    color: "#71717a", // Cinza zinc-500 (mais escuro e discreto)
                    marginBottom: 0,
                    letterSpacing: "0.04em",
                  }}
                >
                  {post.title}
                </h3>
                {post.publishedAt && (
                  <span className="text-[12px] tabular-nums font-mono" style={{ color: "#3f3f46" }}>
                    {new Date(post.publishedAt).toLocaleDateString("pt-BR", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </span>
                )}
              </div>

              {/* Arrow */}
              <svg
                className="w-3.5 h-3.5 shrink-0 self-center opacity-30 group-hover:opacity-100 transition-all"
                style={{ color: "#3f3f46" }}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          );
        })}
      </div>

      {/* CTA */}
      <div className="pt-4 mt-4 border-t border-zinc-800">
        <Link
          href="/radar"
          className="group flex items-center justify-between gap-3 px-4 py-3.5 border border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 transition-all"
        >
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/40 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary/60" />
            </span>
            <span
              className="font-black uppercase tracking-widest transition-all"
              style={{ fontSize: "1.0075rem", color: "#000000" }} // Texto do botão escurecido
            >
              Ver todas as publicações
            </span>
          </div>
          <svg
            className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100"
            style={{ color: "#3f3f46" }}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}