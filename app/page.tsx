import { Suspense } from "react";
import { Metadata } from "next";
import { client, urlFor } from "@/app/lib/sanity"; // 👈 Importamos o urlFor
import Link from "next/link";
import Image from "next/image";
import Ofertas from "./components/Ofertas"; 
import LatestPosts from "./components/LatestPosts"; 
import { WebStoriesCarousel } from "./components/WebStoriesCarousel";
import LeadCapture from "./components/LeadCapture";
import { formatDate } from "@/app/lib/utils";
import { FeaturedPost, CategoryWithPosts, WebStory } from "@/app/lib";
import PodcastCarousel from "./components/PodcastCarousel";
import { getPodcastEpisodes, Episode } from "@/app/lib/podcast-service";
import MilitaryPowerTicker from "./components/MilitaryPowerTicker";

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
// 1. Busca Destaques (Agora com otimização de imagem)
async function getFeaturedPosts(): Promise<FeaturedPost[]> {
  const query = `*[_type == "post" && featured == true && !(_id in path('drafts.**'))] | order(publishedAt desc) [0...3] {
    _id, 
    title,
    "slug": slug.current,
    excerpt,
    mainImage,
    "imagemAlt": mainImage.alt,
    publishedAt,
    "author": author->name
  }`;
  const data = await client.fetch(query, {}, { next: { revalidate: 300 } });
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((post: any) => ({
    ...post,
    imagem: post.mainImage ? urlFor(post.mainImage).width(1200).height(800).quality(80).auto('format').url() : DEFAULT_IMAGE
  }));
}

// 2. Busca Categorias (Agora com otimização de imagem nos posts internos)
async function getCategories(): Promise<CategoryWithPosts[]> {
  const query = `*[_type == "category" && !(_id in path('drafts.**')) && count(*[_type == "post" && references(^._id)]) > 0]{
    _id,
    title,
    "slug": slug.current,
    "posts": *[_type == "post" && references(^._id)] | order(publishedAt desc) [0...4] {
      _id,
      title,
      "slug": slug.current,
      mainImage,
      "imagemAlt": mainImage.alt,
      excerpt,
      "author": author->name,
      publishedAt,
      editorialType
    }
  }`;
  const categories = await client.fetch(query, {}, { next: { revalidate: 300 } });

  const seenTitles = new Set<string>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const uniqueCategories = categories.filter((cat: any) => {
    if (seenTitles.has(cat.title)) return false;
    seenTitles.add(cat.title);
    
    // Otimizando imagens aninhadas
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cat.posts = cat.posts.map((post: any) => ({
      ...post,
      imagem: post.mainImage ? urlFor(post.mainImage).width(600).height(400).quality(80).auto('format').url() : DEFAULT_IMAGE
    }));
    return true;
  });

  return uniqueCategories;
}

// 3. Busca Web Stories (Agora com otimização de imagem vertical)
async function getWebStories(): Promise<WebStory[]> {
  const query = `*[_type == "webStory"] | order(_createdAt desc) [0...6] {
    _id,
    title,
    "slug": slug.current,
    coverImage,
    "targetPostSlug": targetPost->slug.current
  }`;
  const data = await client.fetch(query, {}, { next: { revalidate: 300 } });
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((story: any) => ({
    ...story,
    coverImage: story.coverImage ? urlFor(story.coverImage).width(400).height(700).quality(80).auto('format').url() : DEFAULT_IMAGE
  }));
}

// --- COMPONENTE PRINCIPAL ---
export default async function Home() {
  const [featuredPosts, categories, webStories, episodes] = await Promise.all([
    getFeaturedPosts(),
    getCategories(),
    getWebStories(),
    getPodcastEpisodes(),
  ]);

  const renderedPostIds = new Set<string>();

  featuredPosts.forEach((post) => {
    renderedPostIds.add(post._id);
  });

  const popularPosts = categories
    .flatMap((c) => c.posts)
    .filter((p) => !renderedPostIds.has(p._id))
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
    .slice(0, 5);

  return (
    <div className="max-w-9xl mx-auto px-4 py-8 sm:px-6 lg:px-8 bg-white-opacity">
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

      <MilitaryPowerTicker />

      {/* --- 1. SEÇÃO DE DESTAQUES --- */}
      {featuredPosts.length > 0 && (
        <section className="mb-8 bg-amber-50 background-gradient p-6">
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
              const isHero = index === 0;

              return (
                <article
                  key={post._id}
                  className={`
                  relative group overflow-hidden border border-(--border) bg-(--card-bg) shadow-sm
                  ${isHero ? "lg:col-span-2 lg:row-span-2 min-h-[400px] lg:min-h-[500px]" : "lg:col-span-2 min-h-[240px]"}
                `} // 👈 O SEGREDO DO CLS: Altura mínima fixa! Nada de 'h-auto'
                >
                  <Link
                    href={`/post/${post.slug}`}
                    className="block h-full w-full relative"
                  >
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
                        loading={isHero ? "eager" : "lazy"}
                        fetchPriority={isHero ? "high" : "auto"}
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />
                    </div>

                    <div className="absolute bottom-0 left-0 p-6 z-10 w-full">
                      <span className="inline-block px-2 py-1 mb-3 text-xs font-bold text-white bg-orange-600 font-mono tracking-wider">
                        {isHero ? "MANCHETE" : "EM ALTA"}
                      </span>
                      <h3
                        className={`font-black text-white leading-tight mb-2 ${isHero ? "text-3xl md:text-4xl" : "text-xl"}`}
                      >
                        {post.title}
                      </h3>
                      {isHero && (
                        <p className="text-white line-clamp-2 max-w-xl text-sm md:text-base hidden sm:block">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="mt-3 text-xs text-gray-100 font-mono tracking-tight">
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <aside className="lg:col-span-3 lg:border-r lg:border-zinc-200 lg:pr-12 p-4 bg-amber-50">
            <h2 className="text-[#0070f3] text-xl font-black mb-8 uppercase tracking-tighter">
              Mais Populares
            </h2>
            <div className="flex flex-col gap-8">
              {popularPosts.map(
                (post: CategoryWithPosts["posts"][number], index: number) => (
                  <article key={post._id} className="flex gap-4 group">
                    <span className="text-3xl font-black text-zinc-600 group-hover:text-[#0070f3] leading-none transition-colors">
                      {index + 1}
                    </span>
                    <Link href={`/post/${post.slug}`}>
                      <h3 className="font-bold text-[15px] leading-tight text-zinc-900 group-hover:text-[#0070f3] transition-colors">
                        {post.title}
                      </h3>
                    </Link>
                  </article>
                ),
              )}
            </div>
          </aside>

          <main className="lg:col-span-9 flex flex-col p-4 gap-4 bg-amber-50">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black uppercase tracking-tighter">
                Build & Byte Cast
              </h2>
              <span className="bg-green-500/10 text-green-700 text-[10px] font-bold px-2 py-1  animate-pulse uppercase">
                Ao Vivo / Recentes
              </span>
            </div>

            <div className="hidden md:grid grid-cols-2 gap-x-8 gap-y-12">
              {episodes.map((ep: Episode) => (
                <article key={ep.id} className="group">
                  <a
                    href={ep.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Ouvir podcast: ${ep.title}`} // 👈 Correção de Acessibilidade
                    className="block relative aspect-video overflow-hidden mb-4"
                  >
                    <Image
                      src={ep.image || DEFAULT_IMAGE}
                      alt={`Capa do episódio ${ep.title}`}
                      fill
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      quality={60}
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <span className="absolute bottom-3 left-3 bg-[#0070f3] text-white text-[10px] font-black px-2 py-0.5 uppercase tracking-widest">
                      PODCAST
                    </span>
                  </a>
                  <a href={ep.link} target="_blank" rel="noopener noreferrer">
                    <h3 className="text-2xl font-black leading-tight text-zinc-900 group-hover:text-[#0070f3] transition-colors mb-2">
                      {ep.title}
                    </h3>
                  </a>
                  <p className="text-sm text-zinc-500 font-medium">
                    Postado em {formatDate(ep.pubDate)} •{" "}
                    <span className="text-zinc-800">Build & Byte Cast</span>
                  </p>
                </article>
              ))}
            </div>

            <div className="md:hidden">
              <PodcastCarousel
                episodes={episodes}
                defaultImage={DEFAULT_IMAGE}
              />
            </div>
          </main>
        </div>
      </section>

      {/* --- 3 SEÇÕES EXTRAS --- */}
      <div className="mt-20 min-h-[400px]">
        <Suspense fallback={<div className="h-96 animate-pulse bg-gray-100" />}>
          <Ofertas />
        </Suspense>
      </div>

      {/* --- 4. SEÇÃO DE WEB STORIES (ESTILO INSTAGRAM) --- */}
      {webStories.length > 0 && (
        <div className="min-h-[350px]">
          <Suspense
            fallback={<div className="h-64 animate-pulse bg-gray-100 mt-10" />}
          >
            <WebStoriesCarousel webStories={webStories} />
          </Suspense>
        </div>
      )}

      <div className="mt-10 min-h-[800px]">
        <Suspense fallback={<div className="h-screen animate-pulse bg-gray-100" />}>
          <LatestPosts />
        </Suspense>
      </div>

      <Suspense fallback={null}>
        <LeadCapture />
      </Suspense>

      {/* --- 5. DISCLAIMER DE AFILIADOS (P0) --- */}
      <div className="mt-16 py-6 border-t bg-amber-50/60 text-center">
        <p className="text-xs text-zinc-800 max-w-3xl mx-auto font-mono">
          <span className="font-bold text-orange-600">
            NOTA DE TRANSPARÊNCIA:
          </span>{" "}
          O Vetor Estratégico participa de programas de afiliados. Ao comprar
          através de links em nossas ofertas (&quot;Pegar Promoção&quot;),
          podemos receber uma comissão, sem custo adicional para você. Isso
          financia nossa infraestrutura de testes e servidores.
        </p>
      </div>
    </div>
  );
}