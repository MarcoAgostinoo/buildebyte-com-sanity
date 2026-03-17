import { Suspense } from "react";
import { Metadata } from "next";
import { client, urlFor } from "@/app/lib/sanity";
import Ofertas from "./components/Ofertas";
import LatestPosts from "./components/LatestPosts";
import { WebStoriesCarousel } from "./components/WebStoriesCarousel";
import LeadCapture from "./components/LeadCapture";
import { CategoryWithPosts, WebStory, FeaturedPost } from "@/app/lib";
import { getPodcastEpisodes } from "@/app/lib/podcast-service";
import MilitaryPowerTicker from "./components/MilitaryPowerTicker";
import FeaturedPostsSection from "./components/home/FeaturedPostsSection";
import PopularPostsList from "./components/home/PopularPostsList";
import PodcastSection from "./components/home/PodcastSection";
import AffiliateDisclaimer from "./components/home/AffiliateDisclaimer";
import Script from "next/script"; // Adicione este import

export const metadata: Metadata = {
  title: "Vetor Estratégico - Defesa e Estratégia",
  description:
    "Portal brasileiro de análise técnica sobre tecnologia, defesa e infraestrutura. Estratégia, inteligência e poder.",
  openGraph: {
    images: ["https://vetorestrategico.com/og-image.png"],
  },
};

const DEFAULT_IMAGE = "/images/placeholder.png";

// --- QUERIES ---

async function getFeaturedPosts(): Promise<FeaturedPost[]> {
  const query = `*[_type == "post" && featured == true && !(_id in path('drafts.**'))] | order(publishedAt desc) [0...3] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    mainImage,
    "imagemAlt": mainImage.alt,
    "imagemLqip": mainImage.asset->metadata.lqip,
    publishedAt,
    "author": author->name
  }`;
  const data = await client.fetch(query, {}, { next: { revalidate: 300 } });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((post: any) => ({
    ...post,
    imagem: post.mainImage
      ? urlFor(post.mainImage).width(1200).height(800).quality(80).auto("format").url()
      : DEFAULT_IMAGE,
  }));
}

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
      "imagemLqip": mainImage.asset->metadata.lqip,
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cat.posts = cat.posts.map((post: any) => ({
      ...post,
      imagem: post.mainImage
        ? urlFor(post.mainImage).width(600).height(400).quality(80).auto("format").url()
        : DEFAULT_IMAGE,
    }));
    return true;
  });

  return uniqueCategories;
}

async function getWebStories(): Promise<WebStory[]> {
  const query = `*[_type == "webStory"] | order(_createdAt desc)[0...6] {
    _id,
    title,
    "slug": slug.current,
    coverImage,
    description,
    ctaText
  }`;
  const data = await client.fetch(query, {}, { next: { revalidate: 300 } });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((story: any) => ({
    ...story,
    coverImage: story.coverImage
      ? urlFor(story.coverImage).width(450).height(800).quality(80).auto("format").url()
      : DEFAULT_IMAGE,
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
  featuredPosts.forEach((post) => renderedPostIds.add(post._id));

  const popularPosts = categories
    .flatMap((c) => c.posts)
    .filter((p) => !renderedPostIds.has(p._id))
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .slice(0, 5);

  return (
    <>
      <Script
        id="home-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Vetor Estratégico",
            url: "https://vetorestrategico.com",
            description: "Portal brasileiro de análise técnica sobre tecnologia, defesa e infraestrutura.",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://vetorestrategico.com/search?q={search_term_string}",
              "query-input": "required name=search_term_string",
            },
            publisher: {
              "@type": "Organization",
              name: "Vetor Estratégico",
              logo: {
                "@type": "ImageObject",
                url: "https://vetorestrategico.com/logo.png",
              },
            },
          }),
        }}
      />

      {/* Removido o bg-white-opacity inexistente e substituído max-w-9xl por um valor válido caso não esteja no seu tema */}
      <div className="max-w-[1440px] mx-auto px-4 py-8 sm:px-6 lg:px-8 bg-transparent">
        
        <MilitaryPowerTicker />

        {/* ── 1. DESTAQUES ── */}
        <FeaturedPostsSection featuredPosts={featuredPosts} />

        {/* ── 2. MAIS POPULARES + PODCAST ── */}
        <section className="mt-12 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <PopularPostsList posts={popularPosts} />
            <PodcastSection episodes={episodes} />
          </div>
        </section>

        {/* ── 3. OFERTAS ── */}
        {/* Classes de altura corrigidas com colchetes nativos do Tailwind */}
        <div className="mt-20 min-h-[500px] lg:min-h-[450px]">
          <Suspense
            fallback={
              <div className="w-full h-[400px] flex flex-col items-center justify-center animate-pulse bg-[#111318] border border-[#2a2f3a]">
                 <div className="w-8 h-8 border-2 border-t-[#c8a84b] border-r-[#c8a84b] border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                 <p className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-[#c8a84b]/60">Carregando Inventário...</p>
              </div>
            }
          >
            <Ofertas />
          </Suspense>
        </div>

        {/* ── 4. WEB STORIES ── */}
        {webStories.length > 0 && (
          <div className="mt-1 mb-8 min-h-[50px] lg:min-h-[10px]">
            <WebStoriesCarousel webStories={webStories} />
          </div>
        )}

        {/* ── 5. LATEST POSTS + LEAD CAPTURE ── */}
        <div className="mt-10 min-h-[1200px] sm:min-h-[800px] lg:min-h-[600px]">
          <Suspense
            fallback={
              <div className="h-full animate-pulse bg-[#111318] border border-[#2a2f3a]" />
            }
          >
            <LatestPosts />
          </Suspense>
        </div>

        <Suspense fallback={null}>
          <LeadCapture />
        </Suspense>

        <AffiliateDisclaimer />
      </div>
    </>
  );
}