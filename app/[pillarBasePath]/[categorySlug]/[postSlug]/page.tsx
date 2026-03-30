/**
 * ============================================================================
 * PÁGINA POST - [pillarBasePath]/[categorySlug]/[postSlug]/page.tsx
 * ============================================================================
 * Exibe: Artigo completo com breadcrumb + header + body + posts relacionados
 */

import { notFound, redirect } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";
import {
  getPillarByBasePath,
  getPostComplete,
  getPostBySlugOnly,
  getRelatedPosts,
} from "@/app/lib/sanity-helpers";
import { Breadcrumb } from "@/app/components/shared/Breadcrumb";
import { PostHeader } from "@/app/components/post/PostHeader";
import { RelatedPosts } from "@/app/components/post/RelatedPosts";
import { PortableText } from "@portabletext/react";
import { generatePostPortableTextComponents } from "@/app/lib/portable-text-components";
import Image from "next/image";
import { urlFor } from "@/app/lib/sanity";

interface PostPageProps {
  params: Promise<{
    pillarBasePath: string;
    categorySlug: string;
    postSlug: string;
  }>;
}

/**
 * Gera metadados dinâmicos para SEO
 */
export async function generateMetadata(
  { params }: PostPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { postSlug } = await params;
  const post = await getPostComplete(postSlug);

  if (!post) {
    return {
      title: "Artigo não encontrado",
    };
  }

  const imageUrl = urlFor(post.mainImage).width(1200).height(630).url();

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.mainImage.alt || post.title,
        },
      ],
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author.name],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [imageUrl],
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { pillarBasePath, categorySlug, postSlug } = await params;

  // ── VALIDAÇÕES INICIAIS ──
  if (!pillarBasePath || !categorySlug || !postSlug) {
    notFound();
  }

  // Buscar pilar
  const pillar = await getPillarByBasePath(pillarBasePath);
  if (!pillar) {
    notFound();
  }

  // Buscar post
  const post = await getPostComplete(postSlug);
  if (!post) {
    notFound();
  }

  // ⚠️ VALIDAÇÃO CRÍTICA DE HIERARQUIA
  // Verificar se o post pertence ao pilar/categoria da URL

  // 1. Validar pilar
  if (post.pillar.basePath !== pillarBasePath) {
    // URL errada, redirecionar para a correta
    const correctUrl = `/${post.pillar.basePath}/${post.category.slug.current}/${post.slug.current}`;
    redirect(correctUrl);
  }

  // 2. Validar categoria
  if (post.category.slug.current !== categorySlug) {
    // URL errada, redirecionar para a correta
    const correctUrl = `/${post.pillar.basePath}/${post.category.slug.current}/${post.slug.current}`;
    redirect(correctUrl);
  }

  // 3. Validar que a categoria pertence ao pilar (estrutura crítica)
  if (typeof post.category.pillar === "object" && post.category.pillar && "_id" in post.category.pillar) {
    if ((post.category.pillar as any)._id !== post.pillar._id) {
      notFound();
    }
  }

  // 4. Validar data de publicação (article ainda não publicado)
  if (new Date(post.publishedAt) > new Date()) {
    notFound();
  }

  // Buscar posts relacionados
  const relatedPosts = await getRelatedPosts(
    post.category._id,
    post.slug.current
  );

  // Building breadcrumb
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: post.pillar.title, href: `/${post.pillar.basePath}` },
    {
      label: post.category.title,
      href: `/${post.pillar.basePath}/${post.category.slug.current}`,
    },
    { label: post.title },
  ];

  // Obter componentes PortableText customizados
  const ptComponents = generatePostPortableTextComponents();

  return (
    <article className="min-h-screen bg-white">
      {/* Breadcrumb + Header */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-8">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* Post Header */}
        <PostHeader post={post} />
      </div>

      {/* Imagem Principal */}
      {post.mainImage && (
        <div className="mb-12 -mx-4 sm:-mx-6 lg:-mx-8">
          <div className="relative w-full aspect-video bg-gray-200">
            <Image
              src={urlFor(post.mainImage).width(1200).url()}
              alt={post.mainImage.alt || post.title}
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>
      )}

      {/* Corpo do Artigo */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="prose prose-lg max-w-none">
          <PortableText value={post.body} components={ptComponents} />
        </div>
      </div>

      {/* Visão do Analista (se existir) */}
      {post.analystView && post.analystView.length > 0 && (
        <section className="mb-16 bg-blue-50 border-l-4 border-blue-600">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">
              💡 Visão do Analista
            </h2>
            <div className="prose max-w-none">
              <PortableText value={post.analystView} components={ptComponents} />
            </div>
          </div>
        </section>
      )}

      {/* Posts Relacionados */}
      {relatedPosts.length > 0 && (
        <RelatedPosts
          posts={relatedPosts}
          categoryTitle={post.category.title}
        />
      )}
    </article>
  );
}
