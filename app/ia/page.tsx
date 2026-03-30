import { client } from "@/app/lib/sanity";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "IA na Defesa e Estratégia | Vetor Estratégico",
  description: "Análises técnicas sobre inteligência artificial aplicada a sistemas de defesa, guerra moderna, automação militar e impacto geoestratégico.",
};

interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  imagem: string;
  publishedAt: string;
  author: string;
  pillarBasePath?: string;
  categorySlug?: string;
}

async function getIAPosts(): Promise<Post[]> {
  // Filtra posts sobre IA aplicada a defesa, guerra moderna e estratégia
  const query = `*[_type == "post" && (title match "IA" || title match "AI" || title match "inteligência" || title match "automação" || categories[]->title match "IA" || categories[]->title match "Inteligência Artificial")] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    "imagem": mainImage.asset->url,
    publishedAt,
    "author": author->name,
    "pillarBasePath": pillar->basePath,
    "categorySlug": category->slug.current
  }`;
  return await client.fetch(query, {}, { next: { revalidate: 60 } });
}

export default async function IAPage() {
  const posts = await getIAPosts();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <header className="mb-16 border-b border-(--border) pb-8">
          <span className="text-primary font-bold tracking-widest text-xs uppercase mb-2 block">
            Defesa e Tecnologia
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase">
            Inteligência <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-blue-500">
              Artificial na Guerra
            </span>
          </h1>
          <p className="mt-6 text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl font-medium">
            Sistemas autônomos, reconhecimento de padrões, swarms de drones e guerra eletrônica. Como a IA redefiniu a capacidade operacional moderna.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.length > 0 ? (
            posts.map((post) => (
              <article key={post._id} className="group bg-(--card-bg) border border-(--border)  overflow-hidden hover:shadow-xl transition-all duration-300">
                <Link href={post.pillarBasePath && post.categorySlug ? `/${post.pillarBasePath}/${post.categorySlug}/${post.slug}` : `/artigo/${post.slug}`}>
                  <div className="relative h-48 overflow-hidden">
                    {post.imagem && (
                      <Image
                        src={post.imagem}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                    <div className="absolute top-2 right-2 bg-black/70 text-white text-xs font-bold px-2 py-1  backdrop-blur-sm">
                      IA
                    </div>
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-3 group-hover:text-primary transition-colors leading-tight">
                      {post.title}
                    </h2>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3 mb-4">
                      {post.excerpt}
                    </p>
                    <span className="text-xs font-mono text-primary uppercase font-bold">
                      Ler análise técnica →
                    </span>
                  </div>
                </Link>
              </article>
            ))
          ) : (
            <p className="text-zinc-500 col-span-full text-center py-20">Nenhuma análise de IA publicada ainda. Volta em breve.</p>
          )}
        </div>
      </div>
    </div>
  );
}
