import { client } from "@/app/lib/sanity";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

// ---------------------------------------------------------------------------
// INTERFACES
// ---------------------------------------------------------------------------

interface PostCard {
  title: string;
  slug: string;
  excerpt?: string;
  imagem?: string;
  imagemLqip?: string;
  publishedAt: string;
  editorialType?: string;
  topics?: { title: string; slug: string }[];
  author?: { name: string };
}

// ---------------------------------------------------------------------------
// CONSTANTES
// ---------------------------------------------------------------------------

const EDITORIAL_LABELS: Record<string, string> = {
  analise: "Análise",
  relatorio: "Relatório",
  guia: "Guia",
  comparativo: "Comparativo",
  review: "Review",
  opiniao: "Opinião",
};

const EDITORIAL_COLORS: Record<string, string> = {
  analise:    "bg-blue-600",
  relatorio:  "bg-slate-600",
  guia:       "bg-emerald-600",
  comparativo:"bg-violet-600",
  review:     "bg-amber-600",
  opiniao:    "bg-orange-600",
};

// Mapeamento entre o SLUG da URL (kebab-case) e o VALOR no Sanity (snake_case)
const PILLAR_DATA: Record<string, { title: string; value: string; description: string }> = {
  "defesa-tecnologia": { 
    title: "Defesa & Tecnologia", 
    value: "defesa_tecnologia", 
    description: "Análises sobre sistemas de defesa, soberania militar e tecnologias de dissuasão." 
  },
  "infraestrutura-digital": { 
    title: "Infraestrutura Digital", 
    value: "infraestrutura_digital", 
    description: "Cabos submarinos, datacenters, 5G e a espinha dorsal da conectividade estratégica." 
  },
  "ia-automacao": { 
    title: "IA & Automação", 
    value: "ia_automacao", 
    description: "O impacto da inteligência artificial e automação na economia e no poder estatal." 
  },
  "economia-poder": { 
    title: "Economia de Poder", 
    value: "economia_poder", 
    description: "Sanções, guerras comerciais, commodities e a geoeconomia como arma." 
  },
  "brasil": { 
    title: "Brasil Estratégico", 
    value: "brasil", 
    description: "O papel do Brasil no tabuleiro global, base industrial e soberania nacional." 
  },
  "global": { 
    title: "Cenário Global", 
    value: "global", 
    description: "Movimentos geopolíticos, alianças e tensões entre grandes potências." 
  },
};

// ---------------------------------------------------------------------------
// DATA
// ---------------------------------------------------------------------------

async function getPillarPosts(pillarValue: string): Promise<PostCard[]> {
  // Filtra pelo campo 'pillar' (string) em vez de referência de categoria
  const query = `*[_type == "post" && pillar == $pillarValue] | order(publishedAt desc) {
    title,
    "slug": slug.current,
    excerpt,
    "imagem": mainImage.asset->url,
    "imagemLqip": mainImage.asset->metadata.lqip,
    publishedAt,
    editorialType,
    "topics": categories[]->{title, "slug": slug.current},
    "author": author->{ name }
  }`;
  return await client.fetch(query, { pillarValue });
}

export async function generateStaticParams() {
  return Object.keys(PILLAR_DATA).map((slug) => ({ pillar: slug }));
}

// ---------------------------------------------------------------------------
// METADATA
// ---------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pillar: string }>;
}): Promise<Metadata> {
  const { pillar } = await params;
  const data = PILLAR_DATA[pillar];
  if (!data) return { title: "Pilar não encontrado" };
  return {
    title: `${data.title} — Vetor Estratégico`,
    description: data.description,
  };
}

// ---------------------------------------------------------------------------
// PAGE
// ---------------------------------------------------------------------------

export default async function PillarPage({
  params,
}: {
  params: Promise<{ pillar: string }>;
}) {
  const { pillar } = await params;
  const data = PILLAR_DATA[pillar];

  if (!data) notFound();
  
  const posts = await getPillarPosts(data.value);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">

      {/* ──HEADER DO PILAR EDITORIAL ─────────────────────────────────────────── */}
      <header className="mb-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-foreground/40 font-bold uppercase tracking-widest mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Início</Link>
          <span>›</span>
          <span className="text-foreground/60">Pilares</span>
          <span>›</span>
          <span className="text-primary">{data.title}</span>
        </nav>

        {/* Hero do Pilar */}
        <div className="relative overflow-hidden rounded-2xl border border-(--border) bg-(--card-bg) p-8 sm:p-12">
          {/* Gradiente decorativo */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl shrink-0">
                🎯
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 mb-1">
                  PILAR EDITORIAL
                </p>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground leading-tight">
                  {data.title}
                </h1>
              </div>
            </div>

            {data.description && (
              <p className="text-base sm:text-lg text-foreground/60 leading-relaxed max-w-2xl">
                {data.description}
              </p>
            )}

            <div className="mt-5 flex items-center gap-2">
              <div className="h-px w-8 bg-primary/30" />
              <span className="text-xs font-bold text-foreground/40 uppercase tracking-widest">
                {posts.length} {posts.length === 1 ? "publicação" : "publicações"}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ── GRID DE ARTIGOS ─────────────────────────────────────────────── */}
      {posts.length === 0 ? (
        <div className="text-center py-20 text-foreground/40">
          <p className="text-lg font-bold">Nenhuma publicação encontrada neste pilar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// CARD DE ARTIGO
// ---------------------------------------------------------------------------

function PostCard({ post }: { post: PostCard }) {
  const editorialColor =
    EDITORIAL_COLORS[post.editorialType ?? ""] ?? "bg-primary";
  const editorialLabel =
    EDITORIAL_LABELS[post.editorialType ?? ""] ?? post.editorialType;

  return (
    <article className="group flex flex-col bg-(--card-bg) rounded-2xl border border-(--border) overflow-hidden shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300">
      {/* Imagem */}
      <Link href={`/post/${post.slug}`} className="block relative aspect-video overflow-hidden bg-foreground/5">
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
            <span className="text-4xl opacity-20">📡</span>
          </div>
        )}
        {/* Badge editorial sobre a imagem */}
        {post.editorialType && (
          <span
            className={`absolute top-3 left-3 ${editorialColor} text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest`}
          >
            {editorialLabel}
          </span>
        )}
      </Link>

      {/* Conteúdo */}
      <div className="flex flex-col flex-1 p-5">
        {/* Pilares */}
        {post.topics && post.topics.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.topics.map((cat) => (
              <span
                key={cat.slug}
                className="text-[9px] font-bold text-foreground/40 uppercase tracking-widest"
              >
                {cat.title}
              </span>
            ))}
          </div>
        )}

        {/* Título */}
        <Link href={`/post/${post.slug}`}>
          <h2 className="font-black text-foreground leading-tight mb-3 group-hover:text-primary transition-colors line-clamp-3">
            {post.title}
          </h2>
        </Link>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-sm text-foreground/55 leading-relaxed line-clamp-2 mb-4 flex-1">
            {post.excerpt}
          </p>
        )}

        {/* Rodapé do card */}
        <div className="flex items-center justify-between pt-3 border-t border-(--border) mt-auto">
          <span className="text-xs text-foreground/40 font-medium">
            {new Date(post.publishedAt).toLocaleDateString("pt-BR", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
          <Link
            href={`/post/${post.slug}`}
            className="text-[10px] font-black text-primary uppercase tracking-wider hover:gap-2 flex items-center gap-1 transition-all"
          >
            Ler
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}