import { client, previewClient } from "@/app/lib/sanity";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import { notFound } from "next/navigation";
import AdComponent from "@/app/components/AdComponent";
import Image from "next/image";
import Link from "next/link";
import type { Metadata, ResolvingMetadata } from "next";
import imageUrlBuilder from "@sanity/image-url";
import { draftMode } from "next/headers";
import { ReactNode } from "react";

// Define interfaces for our Sanity data
interface Category {
  title: string;
  slug: string;
}

interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    url?: string; // a asset expandida terá a url
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
  imagem: string;
  author: string;
  publishedAt: string;
  categories: Category[];
  seoTitle?: string;
  seoDescription?: string;
  excerpt: string;
}

interface PageProps {
  params: { slug: string };
}

// Configuração do builder de imagem
const builder = imageUrlBuilder(client);
function urlFor(source: SanityImage) {
  return builder.image(source);
}

// Componentes customizados para o PortableText
const ptComponents: PortableTextComponents = {
  types: {
    image: ({ value }: { value: SanityImage }) => {
      if (!value?.asset?.metadata?.dimensions) {
        return null;
      }

      const { width, aspectRatio } = value.asset.metadata.dimensions;
      const imageUrl = urlFor(value).width(width).fit("max").auto("format").url();
      const imageWidth = 1200; // Largura máxima para a imagem no layout
      const imageHeight = imageWidth / aspectRatio;

      return (
        <div className="my-10 overflow-hidden rounded-xl shadow-lg">
          <Image
            src={imageUrl}
            alt={value.alt || "Imagem do artigo"}
            width={imageWidth}
            height={imageHeight}
            loading="lazy"
            className="w-full h-auto"
          />
          {value.caption && (
            <p className="mt-2 text-center text-sm text-gray-500 italic">
              {value.caption}
            </p>
          )}
        </div>
      );
    },
  },
  block: {
    h2: ({ children }: { children?: ReactNode }) => (
      <h2 className="text-3xl font-bold mt-12 mb-4 text-gray-800">
        {children}
      </h2>
    ),
    h3: ({ children }: { children?: ReactNode }) => (
      <h3 className="text-2xl font-bold mt-8 mb-3 text-gray-800">{children}</h3>
    ),
    h4: ({ children }: { children?: ReactNode }) => (
      <h4 className="text-xl font-bold mt-6 mb-2 text-gray-800">{children}</h4>
    ),
    blockquote: ({ children }: { children?: ReactNode }) => (
      <blockquote className="border-l-4 border-blue-500 pl-6 my-8 text-xl italic text-gray-700">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({ children, value }: { children?: ReactNode, value?: { href: string } }) => {
      if (!value?.href) return <>{children}</>;
      const rel = !value.href.startsWith("/")
        ? "noreferrer noopener"
        : undefined;
      return (
        <a
          href={value.href}
          rel={rel}
          className="text-blue-600 hover:underline"
        >
          {children}
        </a>
      );
    },
  },
};


// 1. Busca de dados ajustada para o novo Schema
async function getPost(slug: string): Promise<Post | null> {
  const { isEnabled: isDraftMode } = await draftMode();
  const currentClient = isDraftMode ? previewClient : client;

  const query = `*[_type == "post" && slug.current == $slug][0] {
    title,
    "slug": slug.current,
    body[]{
      ...,
      _type == "image" => {
        ...,
        asset->{
          ...,
          metadata
        }
      }
    },
    "imagem": mainImage.asset->url,
    "author": author->name,
    publishedAt,
    categories[]->{title, "slug": slug.current},
    seoTitle,
    seoDescription,
    excerpt
  }`;

  if (!slug) return null;
  return await currentClient.fetch(query, { slug });
}

// 2. SEO Dinâmico utilizando os novos campos do Schema
export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = params;
  const post = await getPost(slug);

  if (!post) {
    return { title: "Post não encontrado" };
  }

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
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("pt-BR", options);
};

// 3. Componente de Página Principal
export default async function PostPage({ params }: PageProps) {
  const { slug } = params;
  console.log("Rendering post for slug:", slug);
  const post = await getPost(slug);
  console.log("Fetched post data:", post);

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto  sm:p-6 lg:p-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Coluna Principal do Artigo */}
        <div className="w-full lg:w-2/3">
          <article className="bg-white sm:p-8 rounded-xl shadow-sm border border-gray-100">
            {/* Categorias Dinâmicas */}
            <div className="mb-6">
              {post.categories && (
                <div className="flex flex-wrap gap-2">
                  {post.categories.map((category: Category) => (
                    <Link
                      key={category.slug}
                      href={`/categorias/${category.slug}`}
                      className="text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
                    >
                      {category.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="mt-4 text-lg text-gray-600 leading-relaxed border-b border-gray-200 pb-6 mb-6">
                {post.excerpt}
              </p>
            )}

            {/* Meta Dados: Autor e Data */}
            <div className="flex items-center text-sm text-gray-500 pb-8 border-b border-gray-300">
              {post.author && (
                <span className="font-medium text-gray-900">
                  Por {post.author}
                </span>
              )}
              {post.author && post.publishedAt && (
                <span className="mx-3 text-gray-300">•</span>
              )}
              {post.publishedAt && (
                <time dateTime={post.publishedAt} className="italic">
                  {formatDate(post.publishedAt)}
                </time>
              )}
            </div>

            {/* Imagem Principal Otimizada */}
            {post.imagem && (
              <div className="w-full overflow-hidden rounded-2xl shadow-lg">
                <Image
                  src={post.imagem}
                  alt={post.title}
                  width={1200}
                  height={675}
                  className="w-full h-auto block transition-transform duration-500 hover:scale-105"
                  loading="eager"
                />
              </div>
            )}

            {/* Conteúdo Rico (PortableText) com Estilo Profissional */}
            <div className="prose prose-blue prose-lg max-w-none text-gray-700 leading-relaxed">
              {console.log("Before rendering PortableText")}
              <PortableText value={post.body} components={ptComponents} />
              {console.log("After rendering PortableText")}
            </div>
          </article>
        </div>

        {/* Sidebar com AdComponent Sticky */}
        <aside className="w-full lg:w-1/3">
          <div className="lg:sticky lg:top-24 space-y-6">
            <div className="p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <AdComponent />
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <AdComponent />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}