import { client, previewClient } from "@/app/lib/sanity";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import { notFound } from "next/navigation";
import AdComponent from "@/app/components/AdComponent";
import ReadNext from "@/app/components/ReadNext";
import Comments from "@/app/components/Comments";
import Image from "next/image";
import Link from "next/link";
import type { Metadata, ResolvingMetadata } from "next";
import { createImageUrlBuilder } from "@sanity/image-url";
import { draftMode } from "next/headers";

// --- INTERFACES ---
interface Category {
  title: string;
  slug: string;
}

interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    url?: string;
    metadata?: {
      dimensions: {
        width: number;
        height: number;
        aspectRatio: number;
      };
    };
  };
  alt?: string;
  caption?: string;
}

type Block = {
  _type: string;
  [key: string]: unknown;
};

interface Post {
  title: string;
  slug: string;
  body: (Block | SanityImage)[];
  contentHtml?: string;
  imagem: string;
  author: string;
  publishedAt: string;
  categories: Category[];
  seoTitle?: string;
  seoDescription?: string;
  excerpt: string;
}

// --- CONFIGURAÇÃO DE IMAGEM ---
const builder = createImageUrlBuilder(client);
function urlFor(source: SanityImage) {
  return builder.image(source);
}

// --- COMPONENTES CUSTOMIZADOS PARA PORTABLE TEXT (Responsivos) ---
const ptComponents: PortableTextComponents = {
  types: {
    image: ({ value }: { value: SanityImage }) => {
      if (!value?.asset?.metadata?.dimensions) return null;
      const { width, aspectRatio } = value.asset.metadata.dimensions;
      const imageUrl = urlFor(value).width(width).fit("max").auto("format").url();
      const imageWidth = 1200;
      const imageHeight = imageWidth / aspectRatio;

      return (
        <div className="my-6 sm:my-10 overflow-hidden rounded-xl shadow-md">
          <Image
            src={imageUrl}
            alt={value.alt || "Imagem do artigo"}
            width={imageWidth}
            height={imageHeight}
            loading="lazy"
            className="w-full h-auto"
          />
          {value.caption && (
            <p className="mt-2 text-center text-xs sm:text-sm text-foreground/60 italic px-4">
              {value.caption}
            </p>
          )}
        </div>
      );
    },
  },
  block: {
    h2: ({ children }) => (
      <h2 className="text-2xl sm:text-3xl font-bold mt-8 mb-4 text-foreground leading-tight">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl sm:text-2xl font-bold mt-6 mb-3 text-foreground">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary pl-4 sm:pl-6 my-6 sm:my-8 text-lg italic text-foreground/80 bg-primary/5 py-2">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => (
      <p className="mb-4 leading-relaxed">{children}</p>
    ),
  },
};

// --- BUSCA DE DADOS ---
async function getPost(slug: string): Promise<Post | null> {
  const { isEnabled: isDraftMode } = await draftMode();
  const currentClient = isDraftMode ? previewClient : client;

  const query = `*[_type == "post" && slug.current == $slug && !(_id in path('drafts.**'))][0] {
    title,
    "slug": slug.current,
    body[]{
      ...,
      _type == "image" => { ..., asset->{ ..., metadata } }
    },
    contentHtml,
    "imagem": mainImage.asset->url,
    "author": author->name,
    publishedAt,
    categories[]->{title, "slug": slug.current},
    seoTitle,
    seoDescription,
    excerpt
  }`;

  if (!slug) return null;
  return await currentClient.fetch(query, { slug }, { cache: "no-store" });
}

// --- SEO DINÂMICO ---
export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) return { title: "Post não encontrado" };

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      images: post.imagem ? [post.imagem, ...previousImages] : previousImages,
    },
  };
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// --- COMPONENTE DA PÁGINA ---
export default async function PostPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        
        {/* Coluna Principal do Artigo */}
        <main className="w-full lg:w-2/3">
          <article className="bg-[var(--card-bg)] rounded-xl p-6">
            
            {/* Categorias */}
            <div className="mb-4 sm:mb-6 flex flex-wrap gap-2">
              {post.categories?.map((category) => (
                <Link
                  key={category.slug}
                  href={`/categorias/${category.slug}`}
                  className="text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary px-3 py-1 rounded-full hover:bg-primary/20 transition-colors"
                >
                  {category.title}
                </Link>
              ))}
            </div>

            {/* Título Responsivo */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-foreground mb-4 sm:mb-6 leading-[1.1]">
              {post.title}
            </h1>

            {/* Autor e Data */}
            <div className="flex flex-wrap items-center text-xs sm:text-sm text-foreground/60 pb-6 mb-8 border-b border-[var(--border)] gap-y-2">
              <span className="font-medium text-foreground">Por {post.author}</span>
              <span className="hidden sm:inline mx-3 text-foreground/20">•</span>
              <time className="italic block sm:inline">{formatDate(post.publishedAt)}</time>
            </div>

            {/* Imagem de Capa */}
            {post.imagem && (
              <div className="w-full overflow-hidden rounded-xl sm:rounded-2xl shadow-lg mb-8 sm:mb-12">
                <Image
                  src={post.imagem}
                  alt={post.title}
                  width={1200}
                  height={675}
                  className="w-full h-auto object-cover"
                  priority
                />
              </div>
            )}

            {/* CONTEÚDO (Suporta Script HTML ou Sanity) */}
            <div className="prose prose-sm sm:prose-base md:prose-lg prose-blue max-w-none text-foreground/80 overflow-hidden">
              {post.contentHtml ? (
                <div 
                  className="article-content" 
                  dangerouslySetInnerHTML={{ __html: post.contentHtml }} 
                />
              ) : (
                post.body && <PortableText value={post.body} components={ptComponents} />
              )}
            </div>
          </article>
          <Comments />
        </main>

        {/* Sidebar (Empilha abaixo no mobile) */}
        <aside className="w-full lg:w-1/3">
          <div className="lg:sticky lg:top-24 space-y-6">
            <h4 className="text-sm font-bold text-foreground/40 uppercase tracking-widest text-center lg:text-left">
              Publicidade
            </h4>
            <div className="p-4 bg-[var(--card-bg)] rounded-lg border border-dashed border-[var(--border)] flex justify-center items-center min-h-62.5">
              <AdComponent />
            </div>
            <div className="hidden lg:flex p-4 bg-[var(--card-bg)] rounded-lg border border-dashed border-[var(--border)] justify-center items-center min-h-62.5">
              <AdComponent />
            </div>
          </div>
        </aside>

      </div>
      <ReadNext categories={post.categories} currentPostSlug={slug} />
    </div>
  );
}