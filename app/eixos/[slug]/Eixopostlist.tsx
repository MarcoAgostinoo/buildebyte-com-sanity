"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchEixoPosts, type EixoPost } from "./Actions";

// ---------------------------------------------------------------------------
// EDITORIAL TYPE LABELS
// ---------------------------------------------------------------------------
const EDITORIAL_LABELS: Record<string, string> = {
  analise:    "Análise",
  relatorio:  "Relatório",
  guia:       "Guia",
  comparativo:"Comparativo",
  review:     "Review",
  opiniao:    "Opinião",
};

const EDITORIAL_COLORS: Record<string, string> = {
  analise:    "bg-blue-600",
  relatorio:  "bg-slate-600",
  guia:       "bg-emerald-600",
  comparativo:"bg-violet-600",
  review:     "bg-amber-600",
  opiniao:    "bg-orange-600",
};

// ---------------------------------------------------------------------------
// POST CARD
// ---------------------------------------------------------------------------
function PostCard({ post, index }: { post: EixoPost; index: number }) {
  const dateStr = new Date(post.publishedAt).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <Link
      href={`/post/${post.slug}`}
      className="group relative flex flex-col bg-(--card-bg) border border-(--border) hover:border-primary/40 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md"
    >
      {/* Image */}
      <div className="relative w-full aspect-video overflow-hidden bg-(--background-soft)">
        {post.imagemUrl ? (
          <Image
            src={post.imagemUrl}
            alt={post.imagemAlt ?? post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          /* Placeholder grid when no image */
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-10 h-10 text-(--foreground)/10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Editorial type badge over image */}
        {post.editorialType && (
          <span className={`absolute top-3 left-3 ${EDITORIAL_COLORS[post.editorialType] ?? "bg-primary"} text-white text-[9px] font-black px-2 py-0.5 uppercase tracking-widest`}>
            {EDITORIAL_LABELS[post.editorialType] ?? post.editorialType}
          </span>
        )}

        {/* Index counter — tactical style */}
        <span className="absolute bottom-3 right-3 text-[10px] font-black tabular-nums text-white/50 bg-black/50 px-1.5 py-0.5 backdrop-blur-sm">
          #{String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        {post.category && (
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/70">
            {post.category}
          </span>
        )}

        <h2 className="font-black text-base leading-snug text-(--foreground) group-hover:text-primary transition-colors line-clamp-2">
          {post.title}
        </h2>

        {post.excerpt && (
          <p className="text-sm text-(--muted-foreground) leading-relaxed line-clamp-2 flex-1">
            {post.excerpt}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 mt-auto border-t border-(--border)">
          <div className="flex items-center gap-2 min-w-0">
            {post.author && (
              <span className="text-[10px] font-bold text-(--muted-foreground) truncate">
                {post.author}
              </span>
            )}
          </div>
          <time className="text-[10px] tabular-nums text-(--muted-foreground) shrink-0 ml-2">
            {dateStr}
          </time>
        </div>
      </div>

      {/* Tactical corner marks */}
      <div className="absolute top-1.5 left-1.5 w-2 h-2 border-t border-l border-(--border) group-hover:border-primary/50 transition-colors z-10 pointer-events-none" />
      <div className="absolute bottom-1.5 right-1.5 w-2 h-2 border-b border-r border-(--border) group-hover:border-primary/50 transition-colors z-10 pointer-events-none" />
    </Link>
  );
}

// ---------------------------------------------------------------------------
// MAIN EXPORT — handles load more
// ---------------------------------------------------------------------------
interface EixoPostsListProps {
  initialPosts: EixoPost[];
  pillar: string;
  totalCount: number;
}

export default function EixoPostsList({
  initialPosts,
  pillar,
  totalCount,
}: EixoPostsListProps) {
  const [posts, setPosts] = useState<EixoPost[]>(initialPosts);
  const [isPending, startTransition] = useTransition();

  const hasMore = posts.length < totalCount;
  const remaining = totalCount - posts.length;

  function handleLoadMore() {
    startTransition(async () => {
      const next = await fetchEixoPosts(pillar, posts.length, 20);
      setPosts((prev) => [...prev, ...next]);
    });
  }

  return (
    <div>
      {/* Post count header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-5 bg-primary" />
          <span className="text-sm font-black text-(--foreground) uppercase tracking-wider">
            {posts.length}{" "}
            <span className="text-(--muted-foreground) font-medium normal-case">
              de {totalCount} publicações
            </span>
          </span>
        </div>

        {hasMore && (
          <span className="text-[10px] font-black uppercase tracking-widest text-(--muted-foreground)">
            {remaining} restantes
          </span>
        )}
      </div>

      {/* Grid */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {posts.map((post, i) => (
            <PostCard key={post._id} post={post} index={i} />
          ))}
        </div>
      ) : (
        <div className="py-24 flex flex-col items-center gap-4 text-center border border-(--border)">
          <svg className="w-12 h-12 text-(--foreground)/15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-sm font-black uppercase tracking-widest text-(--muted-foreground)">
            Nenhuma publicação encontrada neste eixo
          </p>
          <Link href="/eixos" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">
            ← Voltar aos eixos
          </Link>
        </div>
      )}

      {/* Load more */}
      {hasMore && (
        <div className="mt-12 flex flex-col items-center gap-3">
          <button
            onClick={handleLoadMore}
            disabled={isPending}
            className="
              relative group flex items-center gap-3
              border border-(--border) bg-(--card-bg)
              hover:border-primary/50 hover:bg-primary/5
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200
              px-10 py-4
            "
          >
            {/* Tactical left mark */}
            <div className="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l border-(--border) group-hover:border-primary/60 transition-colors" />
            <div className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r border-(--border) group-hover:border-primary/60 transition-colors" />

            {isPending ? (
              <>
                <svg className="w-4 h-4 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span className="text-xs font-black uppercase tracking-widest text-(--foreground)">
                  Carregando...
                </span>
              </>
            ) : (
              <>
                <span className="text-xs font-black uppercase tracking-widest text-(--foreground) group-hover:text-primary transition-colors">
                  Carregar mais {Math.min(20, remaining)} artigos
                </span>
                <svg
                  className="w-4 h-4 text-primary/50 group-hover:translate-y-0.5 transition-transform"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </>
            )}
          </button>

          <span className="text-[9px] font-black uppercase tracking-widest text-(--muted-foreground)">
            {remaining} artigos aguardam análise
          </span>
        </div>
      )}
    </div>
  );
}