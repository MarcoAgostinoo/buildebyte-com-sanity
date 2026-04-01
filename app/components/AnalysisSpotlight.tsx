import Link from "next/link";
import Image from "next/image";
import { client, urlFor } from "@/app/lib/sanity";
import { type SanityImageSource } from "@/app/lib/sanity";

// ---------------------------------------------------------------------------
// ANALYSIS SPOTLIGHT
// Seção cinematográfica de largura total destacando o artigo âncora
// (anchor = true) ou o artigo com maior rating. Visual de revista de
// defesa de alto nível — tipografia massiva, imagem de fundo tratada,
// overlay tático e indicadores de classificação editorial.
// ---------------------------------------------------------------------------

import { type SanityImage, type PortableTextBlock } from "@/app/lib/types";

interface SpotlightPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  imagem: string;
  imagemAlt: string | null;
  imagemLqip: string | null;
  pillar: string | null;
  pillarBasePath: string | null;
  categorySlug: string | null;
  editorialType: string | null;
  rating: number | null;
  author: { _id: string; name: string; slug?: { current: string }; image?: SanityImage; bio?: PortableTextBlock[] } | null;
  publishedAt: string;
  cluster: { title: string; slug: string } | null;
}

const PILLAR_LABELS: Record<string, string> = {
  geopolitica_defesa:    "Geopolítica & Defesa",
  arsenal_tecnologia:    "Arsenal & Tecnologia",
  teatro_operacoes:      "Teatro de Operações",
};

const EDITORIAL_LABELS: Record<string, string> = {
  analise:    "Análise Estratégica",
  relatorio:  "Relatório Técnico",
  guia:       "Guia Aplicado",
  comparativo:"Comparativo Técnico",
  review:     "Review Estruturada",
  opiniao:    "Opinião Analítica",
};

async function getSpotlightPost(): Promise<SpotlightPost | null> {
  // Prefer anchor posts, fallback to highest rating
  const query = `*[
    _type == "post" &&
    !(_id in path('drafts.**')) &&
    (anchor == true || defined(rating))
  ] | order(anchor desc, rating desc) [0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    "imagem": mainImage.asset->url,
    "imagemAlt": mainImage.alt,
    "imagemLqip": mainImage.asset->metadata.lqip,
    "pillar": pillar->slug.current,
    "pillarBasePath": pillar->basePath,
    "categorySlug": category->slug.current,
    editorialType,
    rating,
    "author": author->{ _id, name, "slug": slug.current, image{ asset->{ url, metadata }, alt }, bio },
    publishedAt,
    "cluster": cluster->{ title, "slug": slug.current }
  }`;

  return await client.fetch(query, {}, { next: { revalidate: 300 } });
}

export default async function AnalysisSpotlight() {
  const post = await getSpotlightPost();
  if (!post) return null;

  const pillarLabel = post.pillar ? PILLAR_LABELS[post.pillar] : null;
  const editorialLabel = post.editorialType ? EDITORIAL_LABELS[post.editorialType] : null;

  const dateStr = new Date(post.publishedAt).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Traduz os dados do CMS para a pasta física correspondente no Next.js
  const p = (post.pillar || post.pillarBasePath || "").toLowerCase();
  const c = post.categorySlug || "geral";
  let postUrl = `/militar/geral/${post.slug}`;
  if (p.includes("geopolitica")) postUrl = `/militar/geopolitica/${post.slug}`;
  else if (p.includes("arsenal")) postUrl = `/militar/arsenal/${post.slug}`;
  else if (p.includes("teatro") || p.includes("operacoes") || p.includes("historia")) postUrl = `/militar/historia/${post.slug}`;
  else if (p.includes("sobrevivencia")) postUrl = `/militar/sobrevivencia/${post.slug}`;
  else if (p.includes("carreira") || p.includes("concurso")) postUrl = `/concursos/${c}/${post.slug}`;

  return (
    <section className="my-16 relative overflow-hidden">
      {/* Label acima */}
      <div className="flex items-center gap-3 mb-0">
        <div className="w-1 h-5 bg-amber-500" />
        <p className="text-[12px] font-black uppercase tracking-[0.35em] text-zinc-500">
          Dossiê em Destaque
        </p>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      {/* Main card */}
      <Link
        href={postUrl}
        className="group relative flex flex-col lg:flex-row min-h-96 lg:min-h-[480px] overflow-hidden border border-zinc-800 hover:border-amber-500/30 transition-all duration-500"
      >
        {/* ── IMAGE SIDE (full bg on mobile, 60% on lg) ── */}
        <div className="absolute inset-0 lg:relative lg:w-3/5 shrink-0 overflow-hidden">
          {post.imagem && (
            <Image
              src={post.imagem}
              alt={post.imagemAlt ?? post.title}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              priority
              placeholder={post.imagemLqip ? "blur" : "empty"}
              blurDataURL={post.imagemLqip ?? undefined}
              className="object-cover opacity-40 lg:opacity-80 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
            />
          )}
          {/* Gradient — mobile: bottom-heavy; lg: right-edge fade */}
          <div className="absolute inset-0 bg-linear-to-t from-[#0a0b0d] via-[#0a0b0d]/50 to-transparent lg:hidden" />
          <div className="absolute inset-0 hidden lg:block bg-linear-to-r from-transparent via-[#0a0b0d]/20 to-[#0a0b0d]" />
        </div>

        {/* ── CONTENT SIDE ── */}
        <div className="relative z-10 flex flex-col justify-center lg:justify-start lg:w-2/5 p-7 sm:p-10 lg:pl-8 mt-auto lg:mt-0 bg-transparent lg:bg-[#0a0b0d]">
          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-2 mb-5">
            {editorialLabel && (
              <span className="text-[12px] font-black uppercase tracking-widest bg-amber-500 text-[#0a0b0d] px-2.5 py-1">
                {editorialLabel}
              </span>
            )}
            {pillarLabel && (
              <span className="text-[12px] font-black uppercase tracking-wider border border-amber-500/30 text-amber-500/70 px-2.5 py-1">
                {pillarLabel}
              </span>
            )}
            {post.rating && (
              <span className="ml-auto text-[12px] font-black tabular-nums text-emerald-400 border border-emerald-400/20 px-2.5 py-1">
                {post.rating}/10
              </span>
            )}
          </div>

          {/* Title — massive */}
          <h2
            className="text-3xl sm:text-4xl xl:text-5xl font-black text-zinc-100 group-hover:text-white leading-tight uppercase mb-5 transition-colors drop-shadow-lg"
            style={{ fontFamily: "var(--font-bebas-neue, sans-serif)", letterSpacing: "-0.01em" }}
          >
            {post.title}
          </h2>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-sm text-zinc-400 group-hover:text-zinc-300 leading-relaxed mb-6 transition-colors line-clamp-3 lg:line-clamp-4">
              {post.excerpt}
            </p>
          )}

          {/* Cluster pill */}
          {post.cluster && (
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 bg-amber-500/60" />
              <span className="text-[12px] font-black uppercase tracking-widest text-amber-500/60">
                Série: {post.cluster.title}
              </span>
            </div>
          )}

          {/* Meta */}
          <div className="flex items-center gap-3 text-[12px] text-zinc-600 mb-7">
            {post.author && <span className="font-bold text-zinc-500">{post.author.name}</span>}
            <span>·</span>
            <time className="tabular-nums">{dateStr}</time>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3 text-[12px] font-black uppercase tracking-widest text-amber-500 group-hover:text-amber-400 transition-colors">
            Ler Dossiê Completo
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>

        {/* Tactical marks */}
        <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-zinc-700 group-hover:border-amber-500/60 transition-colors z-20 pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-zinc-700 group-hover:border-amber-500/60 transition-colors z-20 pointer-events-none" />

        {/* Amber top accent on hover */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-amber-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-20" />
      </Link>
    </section>
  );
}
