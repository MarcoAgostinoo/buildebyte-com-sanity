import { client } from "@/app/lib/sanity";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

// ---------------------------------------------------------------------------
// INTERFACES
// ---------------------------------------------------------------------------

interface ClusterData {
  title: string;
  slug: string;
  description?: string;
}

interface PostCard {
  title: string;
  slug: string;
  excerpt?: string;
  imagem?: string;
  imagemLqip?: string;
  publishedAt: string;
  editorialType?: string;
  pillar?: string;
  categories?: { title: string; slug: string }[];
  author?: { name: string };
}

// ---------------------------------------------------------------------------
// CONSTANTES
// ---------------------------------------------------------------------------

const PILLAR_LABELS: Record<string, string> = {
  defesa_tecnologia:     "Defesa & Tecnologia",
  infraestrutura_digital:"Infraestrutura Digital",
  ia_automacao:          "IA & Automação",
  economia_poder:        "Economia de Poder",
  brasil:                "Brasil Estratégico",
  global:                "Cenário Global",
};

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
// DATA
// ---------------------------------------------------------------------------

async function getCluster(slug: string): Promise<ClusterData | null> {
  const query = `*[_type == "cluster" && slug.current == $slug][0] {
    title,
    "slug": slug.current,
    description
  }`;
  return await client.fetch(query, { slug });
}

async function getClusterPosts(slug: string): Promise<PostCard[]> {
  const query = `*[_type == "post" && cluster->slug.current == $slug] | order(publishedAt desc) {
    title,
    "slug": slug.current,
    excerpt,
    "imagem": mainImage.asset->url,
    "imagemLqip": mainImage.asset->metadata.lqip,
    publishedAt,
    editorialType,
    pillar,
    categories[]->{title, "slug": slug.current},
    "author": author->{ name }
  }`;
  return await client.fetch(query, { slug });
}

export async function generateStaticParams() {
  const query = `*[_type == "cluster"]{ "slug": slug.current }`;
  const clusters: { slug: string }[] = await client.fetch(query);
  return clusters.map((c) => ({ slug: c.slug }));
}

// ---------------------------------------------------------------------------
// METADATA
// ---------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cluster = await getCluster(slug);
  if (!cluster) return { title: "Série não encontrada" };
  return {
    title: `${cluster.title} — Série · Vetor Estratégico`,
    description:
      cluster.description ??
      `Todos os artigos da série ${cluster.title} no Vetor Estratégico.`,
  };
}

// ---------------------------------------------------------------------------
// PAGE
// ---------------------------------------------------------------------------

export default async function ClusterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [cluster, posts] = await Promise.all([
    getCluster(slug),
    getClusterPosts(slug),
  ]);

  if (!cluster) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">

      {/* ── HEADER DO CLUSTER ───────────────────────────────────────────── */}
      <header className="mb-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-foreground/40 font-bold uppercase tracking-widest mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Início</Link>
          <span>›</span>
          <span className="text-foreground/60">Séries</span>
          <span>›</span>
          <span className="text-primary">{cluster.title}</span>
        </nav>

        {/* Hero do cluster */}
        <div className="relative overflow-hidden border border-(--border) bg-(--card-bg) p-8 sm:p-12">
          {/* Decoração de fundo */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/4 translate-y-1/2 -translate-x-1/2 pointer-events-none" />

          <div className="relative">
            <div className="flex items-start gap-4 mb-4">
              {/* Ícone de série */}
              <div className="w-12 h-12 bg-primary/10 flex items-center justify-center shrink-0">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 mb-1">
                  Série de Análises
                </p>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground leading-tight">
                  {cluster.title}
                </h1>
              </div>
            </div>

            {cluster.description && (
              <p className="text-base sm:text-lg text-foreground/60 leading-relaxed max-w-2xl">
                {cluster.description}
              </p>
            )}

            {/* Contador + linha */}
            <div className="mt-5 flex items-center gap-3">
              <div className="h-px w-8 bg-primary/30" />
              <span className="text-xs font-bold text-foreground/40 uppercase tracking-widest">
                {posts.length} {posts.length === 1 ? "artigo" : "artigos"} nesta série
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ── TIMELINE DE ARTIGOS ─────────────────────────────────────────── */}
      {posts.length === 0 ? (
        <div className="text-center py-20 text-foreground/40">
          <p className="text-lg font-bold">Nenhum artigo publicado nesta série ainda.</p>
          <p className="text-sm mt-1">Em breve novas publicações.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map((post, index) => (
            <ClusterPostCard key={post.slug} post={post} index={index + 1} total={posts.length} />
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// CARD DE ARTIGO — layout horizontal com número de ordem na série
// ---------------------------------------------------------------------------

function ClusterPostCard({
  post,
  index,
  total,
}: {
  post: PostCard;
  index: number;
  total: number;
}) {
  const editorialColor = EDITORIAL_COLORS[post.editorialType ?? ""] ?? "bg-primary";
  const editorialLabel = EDITORIAL_LABELS[post.editorialType ?? ""] ?? post.editorialType;
  const pillarLabel = post.pillar ? PILLAR_LABELS[post.pillar] : null;

  return (
    <article className="group flex gap-0 bg-(--card-bg) -2xl border border-(--border) overflow-hidden shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300">

      {/* Número de ordem na série */}
      <div className="flex flex-col items-center justify-between bg-primary/5 border-r border-(--border) px-4 py-5 min-w-[56px]">
        <span className="text-2xl font-black text-primary/30 tabular-nums leading-none">
          {String(index).padStart(2, "0")}
        </span>
        {/* Linha de progresso vertical */}
        {index < total && (
          <div className="w-px flex-1 my-3 bg-primary/10" />
        )}
        {index === total && (
          <div className="w-2 h-2 -full bg-primary/20 mt-3" />
        )}
      </div>

      {/* Imagem */}
      <Link
        href={`/post/${post.slug}`}
        className="block relative w-36 sm:w-48 shrink-0 overflow-hidden bg-foreground/5"
      >
        {post.imagem ? (
          <Image
            src={post.imagem}
            alt={post.title}
            fill
            placeholder={post.imagemLqip ? "blur" : "empty"}
            blurDataURL={post.imagemLqip}
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl opacity-20">📡</span>
          </div>
        )}
      </Link>

      {/* Conteúdo */}
      <div className="flex flex-col flex-1 p-5 min-w-0">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {post.editorialType && (
            <span
              className={`${editorialColor} text-white text-[9px] font-black px-2 py-0.5  uppercase tracking-widest`}
            >
              {editorialLabel}
            </span>
          )}
          {pillarLabel && post.pillar && (
            <Link href={`/pilares/${post.pillar}`} className="text-[9px] font-bold text-foreground/40 uppercase tracking-widest border border-foreground/15 px-1.5 py-0.5  hover:bg-foreground/5 transition-colors">
              {pillarLabel}
            </Link>
          )}
        </div>

        {/* Título */}
        <Link href={`/post/${post.slug}`}>
          <h2 className="font-black text-foreground leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h2>
        </Link>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-sm text-foreground/50 leading-relaxed line-clamp-2 mb-4 flex-1">
            {post.excerpt}
          </p>
        )}

        {/* Rodapé */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-(--border)">
          <div className="flex items-center gap-2 text-xs text-foreground/40">
            {post.author?.name && (
              <>
                <span className="font-medium">{post.author.name}</span>
                <span>·</span>
              </>
            )}
            <time>
              {new Date(post.publishedAt).toLocaleDateString("pt-BR", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </time>
          </div>

          <Link
            href={`/post/${post.slug}`}
            className="flex items-center gap-1 text-[10px] font-black text-primary uppercase tracking-wider hover:gap-2 transition-all"
          >
            Ler análise
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}