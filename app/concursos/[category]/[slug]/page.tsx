import { client } from "@/app/lib/sanity";
import { notFound } from "next/navigation";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import Link from "next/link";
import { Metadata } from "next";

type Props = {
  params: Promise<{ category: string; slug: string }>;
};

// Gera os metadados (título, descrição) da página para SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const query = `*[_type == "post" && slug.current == $slug][0] {
    title,
    seoTitle,
    seoDescription,
    "imageUrl": mainImage.asset->url
  }`;
  const post = await client.fetch<{ title: string, seoTitle?: string, seoDescription?: string, imageUrl?: string }>(query, { slug });

  if (!post) return { title: "Artigo não encontrado" };

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription,
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || "",
      images: post.imageUrl ? [post.imageUrl] : [],
    },
  };
}

export default async function ConcursoPostPage({ params }: Props) {
  // No Next.js 15+, os params são promises e precisam do await
  const { category, slug } = await params;

  // Query para buscar o artigo completo pelo slug
  const query = `*[_type == "post" && slug.current == $slug][0] {
    title,
    excerpt,
    body,
    "imageUrl": mainImage.asset->url,
    "imageAlt": mainImage.alt,
    "categorySlug": category->slug.current
  }`;

  const post = await client.fetch(query, { slug });

  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10 border-b border-[#2a2f3a] pb-8">
        <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[12px] mb-4">
          <Link href="/concursos" className="hover:text-white transition-colors">Concursos</Link>
          <span className="text-zinc-600">/</span>
          <span className="capitalize">{category.replace(/-/g, ' ')}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-6">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="text-zinc-400 text-lg leading-relaxed mb-6 border-l-2 border-[#2a2f3a] pl-4">
            {post.excerpt}
          </p>
        )}
      </header>

      {post.imageUrl && (
        <div className="relative w-full aspect-video mb-12 border border-[#2a2f3a] rounded-md overflow-hidden">
          <Image src={post.imageUrl} alt={post.imageAlt || post.title} fill sizes="(max-width: 768px) 100vw, 896px" priority className="object-cover" />
        </div>
      )}

      <div className="prose prose-invert prose-lg max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:text-zinc-100 prose-a:text-primary hover:prose-a:text-primary/80 prose-p:text-zinc-300 prose-strong:text-zinc-100 prose-blockquote:border-primary prose-blockquote:text-zinc-400">
        {post.body ? <PortableText value={post.body} /> : <p>Conteúdo não disponível.</p>}
      </div>
    </article>
  );
}
