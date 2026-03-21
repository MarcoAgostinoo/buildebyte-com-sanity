import { Suspense } from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { client, urlFor } from "@/app/lib/sanity";
import { CategoryWithPosts, WebStory, FeaturedPost } from "@/app/lib";
import { getPodcastEpisodes } from "@/app/lib/podcast-service";

// ── Componentes SSR ──
import MilitaryPowerTicker from "./components/MilitaryPowerTicker";
import FeaturedPostsSection from "./components/home/FeaturedPostsSection";
import ThreatIndexBar from "./components/ThreatIndexBar";
import EditorialPillars from "./components/EditorialPillars";
import AnalysisSpotlight from "./components/AnalysisSpotlight";
import PodcastSectionClient from "./components/home/PodcastSectionClient";
import AffiliateDisclaimer from "./components/home/AffiliateDisclaimer";

// ── Lazy (abaixo do fold) ──
const PopularPostsList = dynamic(() => import("./components/home/PopularPostsList"));
const Ofertas = dynamic(() => import("./components/Ofertas"), {
  loading: () => <div className="h-80 animate-pulse bg-zinc-900 border border-zinc-800" />,
});
const WebStoriesCarousel = dynamic(() =>
  import("./components/WebStoriesCarousel").then((m) => m.WebStoriesCarousel)
);
const LeadCapture = dynamic(() => import("./components/LeadCapture"));
const LatestPosts  = dynamic(() => import("./components/LatestPosts"));

export const metadata: Metadata = {
  title: "Vetor Estratégico - Defesa e Estratégia",
  description:
    "Portal brasileiro de análise técnica sobre tecnologia, defesa e infraestrutura. Estratégia, inteligência e poder.",
  openGraph: { images: ["https://vetorestrategico.com/og-image.png"] },
};

// ---------------------------------------------------------------------------
// PRIORIDADE DOS PILARES
// ---------------------------------------------------------------------------
const PILLAR_PRIORITY: Record<string, number> = {
  "Geopolítica & Defesa": 0,
  "Arsenal & Tecnologia": 1,
  "Teatro de Operações":  2,
};

const DEFAULT_IMAGE = "/images/placeholder.png";

// ---------------------------------------------------------------------------
// QUERIES
// ---------------------------------------------------------------------------
async function getFeaturedPosts(): Promise<FeaturedPost[]> {
  const query = `*[_type == "post" && featured == true && !(_id in path('drafts.**'))] | order(publishedAt desc) [0...3] {
    _id, title, "slug": slug.current, excerpt, mainImage,
    "imagemAlt": mainImage.alt,
    "imagemLqip": mainImage.asset->metadata.lqip,
    publishedAt, pillar, editorialType, "author": author->name
  }`;
  const data = await client.fetch(query, {}, { next: { revalidate: 300 } });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const posts: FeaturedPost[] = data.map((p: any) => ({
    ...p,
    imagem: p.mainImage
      ? urlFor(p.mainImage).width(1200).height(800).quality(80).auto("format").url()
      : DEFAULT_IMAGE,
  }));
  return posts.sort(
    (a, b) =>
      (PILLAR_PRIORITY[a.pillar ?? ""] ?? 99) -
      (PILLAR_PRIORITY[b.pillar ?? ""] ?? 99)
  );
}

async function getCategories(): Promise<CategoryWithPosts[]> {
  const query = `*[_type == "category" && !(_id in path('drafts.**')) && count(*[_type == "post" && references(^._id)]) > 0] {
    _id, title, "slug": slug.current,
    "posts": *[_type == "post" && references(^._id)] | order(publishedAt desc) [0...4] {
      _id, title, "slug": slug.current, mainImage,
      "imagemAlt": mainImage.alt,
      "imagemLqip": mainImage.asset->metadata.lqip,
      excerpt, "author": author->name, publishedAt, pillar, editorialType
    }
  }`;
  const categories = await client.fetch(query, {}, { next: { revalidate: 300 } });
  const seenTitles = new Set<string>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return categories.filter((cat: any) => {
    if (seenTitles.has(cat.title)) return false;
    seenTitles.add(cat.title);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cat.posts = cat.posts.map((p: any) => ({
      ...p,
      imagem: p.mainImage
        ? urlFor(p.mainImage).width(600).height(400).quality(80).auto("format").url()
        : DEFAULT_IMAGE,
    }));
    return true;
  });
}

async function getWebStories(): Promise<WebStory[]> {
  const query = `*[_type == "webStory"] | order(_createdAt desc)[0...6] {
    _id, title, "slug": slug.current, coverImage, description, ctaText
  }`;
  const data = await client.fetch(query, {}, { next: { revalidate: 300 } });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((s: any) => ({
    ...s,
    coverImage: s.coverImage
      ? urlFor(s.coverImage).width(450).height(800).quality(80).auto("format").url()
      : DEFAULT_IMAGE,
  }));
}

// ---------------------------------------------------------------------------
// PAGE
// ---------------------------------------------------------------------------
export default async function Home() {
  const [featuredPosts, categories, webStories, episodes] = await Promise.all([
    getFeaturedPosts(),
    getCategories(),
    getWebStories(),
    getPodcastEpisodes(),
  ]);

  const renderedPostIds = new Set<string>();
  featuredPosts.forEach((p) => renderedPostIds.add(p._id));

  const popularPosts = categories
    .flatMap((c) => c.posts)
    .filter((p) => !renderedPostIds.has(p._id))
    .sort((a, b) => {
      const diff =
        (PILLAR_PRIORITY[a.pillar ?? ""] ?? 99) -
        (PILLAR_PRIORITY[b.pillar ?? ""] ?? 99);
      return diff !== 0
        ? diff
        : new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    })
    .slice(0, 5);

  return (
    <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">

      {/* ── 1. TICKER ── */}
      <div className="py-4">
        <MilitaryPowerTicker />
      </div>

      {/* ── 2. DESTAQUES HERO ── */}
      <FeaturedPostsSection featuredPosts={featuredPosts} />

      {/* ── 3. THREAT INDEX BAR ── */}
      <ThreatIndexBar />

      {/* ── 4. MAIS POPULARES + PODCAST ──────────────────────────────────
       *  REGRA: col-span NUNCA dentro dos componentes filhos.
       *  Os <div> wrappers abaixo são filhos diretos do grid e controlam
       *  quantas colunas cada bloco ocupa.
       * ─────────────────────────────────────────────────────────────── */}
      <section className="mt-12 mb-10">
        {/* Divisor tático */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-5 bg-zinc-700" />
          <div className="flex-1 h-px bg-zinc-800" />
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-700">
            Inteligência & Transmissão
          </span>
          <div className="flex-1 h-px bg-zinc-800" />
          <div className="w-1 h-5 bg-zinc-700" />
        </div>

        {/* Grid 12 colunas — col-span nos wrappers diretos */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Popular: 4 colunas */}
          <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-zinc-800 pb-8 lg:pb-0 lg:pr-8">
            <PopularPostsList posts={popularPosts} />
          </div>

          {/* Podcast: 8 colunas */}
          <div className="lg:col-span-8">
            <PodcastSectionClient episodes={episodes} />
          </div>
        </div>
      </section>

      {/* ── 5. ANALYSIS SPOTLIGHT ── */}
      <AnalysisSpotlight />

      {/* ── 6. EDITORIAL PILLARS ── */}
      <EditorialPillars />

      {/* ── DIVISOR TÁTICO ── */}
      <div className="w-full h-px bg-linear-to-r from-transparent via-zinc-700 to-transparent my-10" />

      {/* ── 7. OFERTAS ── */}
      <section className="mb-14">
        <Suspense fallback={<div className="h-80 animate-pulse bg-zinc-900 border border-zinc-800" />}>
          <Ofertas />
        </Suspense>
      </section>

      {/* ── DIVISOR TÁTICO ── */}
      <div className="w-full h-px bg-linear-to-r from-transparent via-zinc-700 to-transparent mb-10" />

      {/* ── 8. WEB STORIES ── */}
      {webStories.length > 0 && (
        <section className="mb-14">
          <WebStoriesCarousel webStories={webStories} />
        </section>
      )}

      {/* ── 9. ÚLTIMAS PUBLICAÇÕES ── */}
      <section className="mb-6">
        <Suspense fallback={<div className="h-96 animate-pulse bg-zinc-900 border border-zinc-800" />}>
          <LatestPosts />
        </Suspense>
      </section>

      {/* ── 10. LEAD CAPTURE ── */}
      <Suspense fallback={null}>
        <LeadCapture />
      </Suspense>

      {/* ── 11. DISCLAIMER ── */}
      <AffiliateDisclaimer />

    </div>
  );
}