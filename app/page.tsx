import { Suspense } from "react";
import { Metadata } from "next";
import { client } from "@/app/lib/sanity";
import Link from "next/link";
import Image from "next/image";
import Ofertas from "./components/Ofertas"; // Verifique se o caminho está certo
import LatestPosts from "./components/LatestPosts"; // Verifique se o caminho está certo
import { WebStoriesCarousel } from "./components/WebStoriesCarousel";
import LeadCapture from "./components/LeadCapture";
import { formatDate } from "@/app/lib/utils";
import { FeaturedPost, CategoryWithPosts, WebStory } from "@/app/lib";
import PodcastCarousel from "./components/PodcastCarousel";
import { getPodcastEpisodes, Episode } from "@/app/lib/podcast-service";

export const metadata: Metadata = {
  title: "Vetor Estratégico - Tecnologia, Hardware e Reviews",
  description:
    "As últimas novidades em tecnologia, reviews de hardware e guias técnicos.",
  openGraph: {
    images: ["/og-image.jpg"],
  },
};

const DEFAULT_IMAGE = "/images/placeholder.jpg";

// --- QUERIES ---
// 1. Busca Destaques
async function getFeaturedPosts(): Promise<FeaturedPost[]> {
  const query = `*[_type == "post" && featured == true && !(_id in path('drafts.**'))] | order(publishedAt desc) [0...3] {
    _id, 
    title,
    "slug": slug.current,
    excerpt,
    "imagem": mainImage.asset->url,
    "imagemAlt": mainImage.alt,
    publishedAt,
    "author": author->name
  }`;
  return await client.fetch(query, {}, { next: { revalidate: 300 } });
}

// 2. Busca Categorias
async function getCategories(): Promise<CategoryWithPosts[]> {
  const query = `*[_type == "category" && !(_id in path('drafts.**')) && count(*[_type == "post" && references(^._id)]) > 0]{
    _id,
    title,
    "slug": slug.current,
    "posts": *[_type == "post" && references(^._id)] | order(publishedAt desc) [0...4] {
      _id,
      title,
      "slug": slug.current,
      "imagem": mainImage.asset->url,
      "imagemAlt": mainImage.alt,
      excerpt,
      "author": author->name,
      publishedAt,
      editorialType
    }
  }`;
  const categories = await client.fetch(
    query,
    {},
    { next: { revalidate: 300 } },
  );

  // Remove categorias com títulos duplicados
  const seenTitles = new Set<string>();
  const uniqueCategories = categories.filter((cat: CategoryWithPosts) => {
    if (seenTitles.has(cat.title)) return false;
    seenTitles.add(cat.title);
    return true;
  });

  return uniqueCategories;
}

// 3. Busca Web Stories
async function getWebStories(): Promise<WebStory[]> {
  const query = `*[_type == "webStory"] | order(_createdAt desc) [0...6] {
    _id,
    title,
    "slug": slug.current,
    "coverImage": coverImage.asset->url,
    "targetPostSlug": targetPost->slug.current
  }`;
  return await client.fetch(query, {}, { next: { revalidate: 300 } });
}

// --- COMPONENTE PRINCIPAL ---
export default async function Home() {
  const [featuredPosts, categories, webStories, episodes] = await Promise.all([
    getFeaturedPosts(),
    getCategories(),
    getWebStories(),
    getPodcastEpisodes(),
  ]);

  // SET PARA CONTROLE DE DUPLICATAS
  const renderedPostIds = new Set<string>();

  // Marca os destaques como já renderizados
  featuredPosts.forEach((post) => {
    renderedPostIds.add(post._id);
  });

  // Pegamos os 5 últimos artigos gerais para a lateral esquerda (estilo Tecnoblog)
  const popularPosts = categories.flatMap(c => c.posts)
    .filter(p => !renderedPostIds.has(p._id))
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 bg-white dark:bg-zinc-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Vetor Estratégico",
            url: "https://buildbyte.com.br",
          }),
        }}
      />
      {/* --- 1. SEÇÃO DE DESTAQUES --- */}
      {featuredPosts.length > 0 && (
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-black text-primary border-l-4 border-secondary pl-4">
              Destaques
            </h2>
            <Link
              href="/destaques"
              aria-label="Ver todos os destaques"
              className="text-primary hover:underline text-sm font-bold"
            >
              Ver todos <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {featuredPosts.map((post, index) => {
              // O primeiro post é o HERO (ocupa mais espaço)
              const isHero = index === 0;

              return (
                <article
                  key={post._id}
                  className={`
                  relative group overflow-hidden rounded-2xl border border-(--border) bg-(--card-bg) shadow-sm
                  ${isHero ? "lg:col-span-2 lg:row-span-2 h-125 lg:h-auto" : "lg:col-span-2 h-60"}
                `}
                >
                  <Link
                    href={`/post/${post.slug}`}
                    className="block h-full w-full relative"
                  >
                    {/* Imagem com Overlay Gradiente para leitura */}
                    <div className="absolute inset-0 z-0">
                      <Image
                        src={post.imagem || DEFAULT_IMAGE}
                        alt={post.imagemAlt || post.title || "Imagem do artigo"}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes={
                          isHero
                            ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                            : "(max-width: 768px) 100vw, (max-width: 1200px) 25vw, 25vw"
                        }
                        priority={isHero}
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />
                    </div>

                    {/* Texto sobre a imagem (Estilo Manchete) */}
                    <div className="absolute bottom-0 left-0 p-6 z-10 w-full">
                      <span className="inline-block px-2 py-1 mb-3 text-xs font-bold text-white bg-orange-600 rounded font-mono tracking-wider">
                        {isHero ? "MANCHETE" : "EM ALTA"}
                      </span>
                      <h3
                        className={`font-black text-white leading-tight mb-2 ${isHero ? "text-3xl md:text-4xl" : "text-xl"}`}
                      >
                        {post.title}
                      </h3>
                      {isHero && (
                        <p className="text-gray-200 line-clamp-2 max-w-xl text-sm md:text-base hidden sm:block">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="mt-3 text-xs text-gray-300 font-mono tracking-tight">
                        {post.author} • {formatDate(post.publishedAt)}
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        </section>
      )}     

        {/* 2. SEÇÃO TECNOBLOG: POPULARES (SANITY) + CAST (API) */}
      <section className="mt-12 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LADO ESQUERDO: MAIS POPULARES */}
          <aside className="lg:col-span-3 lg:border-r lg:border-zinc-200 lg:dark:border-zinc-800 lg:pr-12">
            <h2 className="text-[#0070f3] text-xl font-black mb-8 uppercase tracking-tighter">Mais Populares</h2>
            <div className="flex flex-col gap-8">
              {popularPosts.map((post: CategoryWithPosts['posts'][number], index: number) => (
                <article key={post._id} className="flex gap-4 group">
                  <span className="text-3xl font-black text-zinc-200 dark:text-zinc-800 group-hover:text-[#0070f3] leading-none transition-colors">{index + 1}</span>
                  <Link href={`/post/${post.slug}`}>
                    <h4 className="font-bold text-[15px] leading-tight text-zinc-800 dark:text-zinc-100 group-hover:text-[#0070f3] transition-colors">{post.title}</h4>
                  </Link>
                </article>
              ))}
            </div>
          </aside>

          {/* LADO DIREITO: GRID DO BUILD & BYTE CAST */}
          <main className="lg:col-span-9 flex flex-col gap-10">
             <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black uppercase tracking-tighter">Build & Byte Cast</h2>
                <span className="bg-green-500/10 text-green-500 text-[10px] font-bold px-2 py-1 rounded animate-pulse uppercase">Ao Vivo / Recentes</span>
             </div>

            {/* Desktop Grid 2x2 */}
            <div className="hidden md:grid grid-cols-2 gap-x-8 gap-y-12">
              {episodes.map((ep: Episode) => (
                <article key={ep.id} className="group">
                  <a href={ep.link} target="_blank" rel="noopener noreferrer" className="block relative aspect-video overflow-hidden rounded-sm mb-4">
                    <Image src={ep.image || DEFAULT_IMAGE} alt={ep.title} fill className="object-cover transition-transform group-hover:scale-105" />
                    <span className="absolute bottom-3 left-3 bg-[#0070f3] text-white text-[10px] font-black px-2 py-0.5 uppercase tracking-widest">PODCAST</span>
                  </a>
                  <a href={ep.link} target="_blank" rel="noopener noreferrer">
                    <h3 className="text-2xl font-black leading-tight text-zinc-900 dark:text-white group-hover:text-[#0070f3] transition-colors mb-2">{ep.title}</h3>
                  </a>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                    Postado em {formatDate(ep.pubDate)} • <span className="text-zinc-800 dark:text-zinc-200">Build & Byte Cast</span>
                  </p>
                </article>
              ))}
            </div>

            {/* Mobile Carousel */}
            <div className="md:hidden">
              <PodcastCarousel episodes={episodes} defaultImage={DEFAULT_IMAGE} />
            </div>
          </main>
        </div>
      </section>

      {/* --- 3 SEÇÕES EXTRAS --- */}
      <div className="mt-20">
        <Suspense
          fallback={
            <div className="h-40 animate-pulse bg-gray-100 dark:bg-zinc-800 rounded" />
          }
        >
          <h2 className="text-2xl font-black uppercase tracking-tighter mt-12 mb-8 text-center">
            Mais Ofertas em Tempo Real
          </h2>
          <Ofertas />
        </Suspense>
      </div>
      {/* --- 4. SEÇÃO DE WEB STORIES (ESTILO INSTAGRAM) --- */}
      {webStories.length > 0 && (
        <Suspense
          fallback={
            <div className="h-60 animate-pulse bg-gray-100 dark:bg-zinc-800 rounded mt-10" />
          }
        >
          <WebStoriesCarousel webStories={webStories} />
        </Suspense>
      )}

      <div className="mt-10">
        <Suspense
          fallback={
            <div className="h-96 animate-pulse bg-gray-100 dark:bg-zinc-800 rounded" />
          }
        >
          <LatestPosts />
        </Suspense>
      </div>

      <Suspense fallback={null}>
        <LeadCapture />
      </Suspense>

      {/* --- 5. DISCLAIMER DE AFILIADOS (P0) --- */}
      <div className="mt-16 py-6 border-t border-zinc-200 dark:border-zinc-800 text-center">
        <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-3xl mx-auto font-mono">
          <span className="font-bold text-orange-600 dark:text-orange-500">
            NOTA DE TRANSPARÊNCIA:
          </span>{" "}
          O Vetor Estratégico participa de programas de afiliados. Ao comprar através
          de links em nossas ofertas (&quot;Pegar Promoção&quot;), podemos
          receber uma comissão, sem custo adicional para você. Isso financia
          nossa infraestrutura de testes e servidores.
        </p>
      </div>
    </div>
  );
}
