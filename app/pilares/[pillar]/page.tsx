import { client } from "@/app/lib/sanity";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

// ---------------------------------------------------------------------------
// INTERFACES
// ---------------------------------------------------------------------------

interface Category {
  title: string;
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
  categories?: { title: string; slug: string }[];
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

// ---------------------------------------------------------------------------
// DATA
// ---------------------------------------------------------------------------

async function getCategory(slug: string): Promise<Category | null> {
  const query = `*[_type == "category" && slug.current == $slug][0] {
    title,
    description
  }`;
  return await client.fetch(query, { slug });
}

async function getCategoryPosts(slug: string): Promise<PostCard[]> {
  const query = `*[_type == "post" && $slug in categories[]->slug.current] | order(publishedAt desc) {
    title,
    "slug": slug.current,
    excerpt,
    "imagem": mainImage.asset->url,
    "imagemLqip": mainImage.asset->metadata.lqip,
    publishedAt,
    editorialType,
    categories[]->{title, "slug": slug.current},
    "author": author->{ name }
  }`;
  return await client.fetch(query, { slug });
}

export async function generateStaticParams() {
  const query = `*[_type == "category"]{ "slug": slug.current }`;
  const categories = await client.fetch(query);
  return categories.map((c: { slug: string }) => ({ slug: c.slug }));
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
  const category = await getCategory(slug);
  if (!category) return { title: "Categoria não encontrada" };
  return {
    title: `${category.title} — Vetor Estratégico`,
    description: category.description || `Artigos sobre ${category.title}`,
  };
}

// ---------------------------------------------------------------------------
// PAGE
// ---------------------------------------------------------------------------

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [category, posts] = await Promise.all([
    getCategory(slug),
    getCategoryPosts(slug),
  ]);

  if (!category) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">

      {/* ── HEADER DA CATEGORIA ─────────────────────────────────────────── */}
      <header className="mb-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-foreground/40 font-bold uppercase tracking-widest mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Início</Link>
          <span>›</span>
          <span className="text-foreground/60">Categorias</span>
          <span>›</span>
          <span className="text-primary">{category.title}</span>
        </nav>

        {/* Hero da categoria */}
        <div className="relative overflow-hidden rounded-2xl border border-(--border) bg-(--card-bg) p-8 sm:p-12">
          {/* Gradiente decorativo */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl shrink-0">
                📂
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 mb-1">
                  Categoria
                </p>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground leading-tight">
                  {category.title}
                </h1>
              </div>
            </div>

            {category.description && (
              <p className="text-base sm:text-lg text-foreground/60 leading-relaxed max-w-2xl">
                {category.description}
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
          <p className="text-lg font-bold">Nenhuma publicação encontrada nesta categoria.</p>
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
        {/* Categorias */}
        {post.categories && post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.categories.map((cat) => (
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