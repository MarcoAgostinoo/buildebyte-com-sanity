import { Suspense } from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { client, urlFor } from "@/app/lib/sanity";
import { Post as FeaturedPost, type SanityImage, type PortableTextBlock } from "@/app/lib/types";
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
const PopularPostsList = dynamic(
  () => import("./components/home/PopularPostsList"),
);
const Ofertas = dynamic(() => import("./components/Ofertas"), {
  loading: () => (
    <div className="h-80 animate-pulse bg-zinc-900 border border-zinc-800" />
  ),
});
const WebStoriesCarousel = dynamic(() =>
  import("./components/WebStoriesCarousel").then((m) => m.WebStoriesCarousel),
);
const LeadCapture = dynamic(() => import("./components/LeadCapture"));

// ATUALIZAÇÃO TÁTICA: Renomeado para refletir o novo Módulo de Sobrevivência
const SurvivalPosts = dynamic(() => import("./components/SurvivalPosts"));

export interface WebStory {
  _id: string;
  title: string;
  slug: string;
  coverImage: string;
  description?: string;
  ctaText?: string;
}

export interface CategoryPost {
  _id: string;
  title: string;
  slug: string;
  publishedAt: string;
  pillar?: string;
  author?: { _id: string; name: string; slug?: { current: string }; image?: SanityImage; bio?: PortableTextBlock[] };
  [key: string]: unknown;
}

// Tipagem local definida para evitar o erro de compilação
export interface CategoryWithPosts {
  _id: string;
  title: string;
  slug: string;
  basePath: string;
  posts: CategoryPost[];
}

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
  geopolitica_defesa: 0,
  arsenal_tecnologia: 1,
  teatro_operacoes: 2,
  carreiras_estrategicas: 3, // Assumindo slug a partir do título
  manual_de_sobrevivencia: 4, // Assumindo slug a partir do título
};

const DEFAULT_IMAGE = "/images/placeholder.png";

// ---------------------------------------------------------------------------
// QUERIES ATUALIZADAS (Adequadas para a nova arquitetura relacional)
// ---------------------------------------------------------------------------
async function getFeaturedPosts(): Promise<FeaturedPost[]> {
  const query = `*[_type == "post" && featured == true && !(_id in path('drafts.**'))] | order(publishedAt desc) [0...3] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    mainImage,
    "imagemAlt": mainImage.alt,
    "imagemLqip": mainImage.asset->metadata.lqip,
    "author": author->{ _id, name, "slug": slug.current, image{ asset->{ url, metadata }, alt }, bio },
    publishedAt,
    "pillar": pillar->slug.current,
    "pillarBasePath": pillar->basePath,
    "categorySlug": category->slug.current
  }`;
  const data = await client.fetch(query, {}, { next: { revalidate: 300 } });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const posts: FeaturedPost[] = data.map((p: any) => ({
    ...p,
    imagem: p.mainImage
      ? urlFor(p.mainImage)
          .width(1200)
          .height(800)
          .quality(80)
          .auto("format")
          .url()
      : DEFAULT_IMAGE,
  }));

  return posts.sort(
    (a, b) =>
      (PILLAR_PRIORITY[(a.pillar as unknown as string) ?? ""] ?? 99) -
      (PILLAR_PRIORITY[(b.pillar as unknown as string) ?? ""] ?? 99),
  );
}

async function getPillarsWithPosts(): Promise<CategoryWithPosts[]> {
  const query = `*[_type == "pillar" && !(_id in path('drafts.**')) && count(*[_type == "post" && references(^._id)]) > 0] {
    _id, title, "slug": slug.current, "basePath": basePath,
    "posts": *[_type == "post" && references(^._id)] | order(publishedAt desc) [0...4] {
      _id, title, "slug": slug.current, mainImage,
      "imagemAlt": mainImage.alt,
      "imagemLqip": mainImage.asset->metadata.lqip,
      excerpt, "author": author->{ _id, name, "slug": slug.current, image{ asset->{ url, metadata }, alt }, bio }, publishedAt, "pillar": pillar->slug.current, 
      "pillarBasePath": pillar->basePath, "categorySlug": category->slug.current, editorialType
    }
  }`;
  const pillars = await client.fetch(query, {}, { next: { revalidate: 300 } });

  const seenTitles = new Set<string>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return pillars.filter((pillar: any) => {
    if (seenTitles.has(pillar.title)) return false;
    seenTitles.add(pillar.title);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pillar.posts = pillar.posts.map((p: any) => ({
      ...p,
      imagem: p.mainImage
        ? urlFor(p.mainImage)
            .width(600)
            .height(400)
            .quality(80)
            .auto("format")
            .url()
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
      ? urlFor(s.coverImage)
          .width(450)
          .height(800)
          .quality(80)
          .auto("format")
          .url()
      : DEFAULT_IMAGE,
  }));
}

// ---------------------------------------------------------------------------
// PAGE
// ---------------------------------------------------------------------------
export default async function Home() {
  const [featuredPosts, pillarsData, webStories, episodes] = await Promise.all([
    getFeaturedPosts(),
    getPillarsWithPosts(),
    getWebStories(),
    getPodcastEpisodes(),
  ]);

  const renderedPostIds = new Set<string>();
  featuredPosts.forEach((p) => renderedPostIds.add(p._id));

  const popularPosts = pillarsData
    .flatMap((p) => p.posts)
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

      {/* ── 4. MAIS POPULARES + PODCAST ── */}
      <section className="my-16 relative">
        {/* Divisor Tático (Feixe de Transmissão) */}
        <div className="flex items-center gap-4 mb-10 w-full">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(var(--primary-rgb),0.8)] shrink-0" />
          <div className="flex-1 h-px bg-linear-to-r from-primary/50 via-[#2a2f3a] to-[#2a2f3a]" />
          <span className="text-[12px] font-black uppercase tracking-[0.4em] text-primary/80 font-mono shrink-0 px-2">
            Inteligência & Transmissão
          </span>
          <div className="flex-1 h-px bg-linear-to-l from-primary/50 via-[#2a2f3a] to-[#2a2f3a]" />
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(var(--primary-rgb),0.8)] shrink-0" />
        </div>

        {/* Grid Operacional (Sem bordas vazadas, as bordas agora estão nos componentes filhos) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Top Decodificações (4 colunas) */}
          <div className="lg:col-span-4 flex flex-col h-full">
            <PopularPostsList posts={popularPosts} />
          </div>

          {/* Podcast / Áudio (8 colunas) */}
          <div className="lg:col-span-8 flex flex-col h-full">
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
        <Suspense
          fallback={
            <div className="h-80 animate-pulse bg-zinc-900 border border-zinc-800" />
          }
        >
          <Ofertas />
        </Suspense>
      </section>

      {/* ── DIVISOR TÁTICO ── */}
      <div className="w-full h-px bg-linear-to-r from-transparent via-zinc-700 to-transparent mb-10" />

      {/* ── 8. WEB STORIES ── */}
      <WebStoriesCarousel webStories={webStories} />

      {/* ── 9. PROTOCOLOS DE SOBREVIVÊNCIA ── */}
      <section className="mb-6">
        <Suspense
          fallback={
            <div className="h-96 animate-pulse bg-zinc-900 border border-zinc-800" />
          }
        >
          <SurvivalPosts />
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
