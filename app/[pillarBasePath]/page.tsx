/**
 * ============================================================================
 * PÁGINA PILAR - [pillarBasePath]/page.tsx
 * ============================================================================
 * Exibe: Título pilar + Descrição + Lista de categorias + Posts recentes
 */

import { notFound } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";
import { getPillarByBasePath, getCategoriesByPillar, getRecentPostsByPillar } from "@/app/lib/sanity-helpers";
import { Breadcrumb } from "@/app/components/shared/Breadcrumb";
import { PillarHeader } from "@/app/components/pillar/PillarHeader";
import { PillarCategoriesSection } from "@/app/components/pillar/PillarCategoriesSection";
import { PostGrid } from "@/app/components/post/PostCard";

interface PillarPageProps {
  params: Promise<{
    pillarBasePath: string;
  }>;
}

/**
 * Gera metadados dinâmicos para SEO
 */
export async function generateMetadata(
  { params }: PillarPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { pillarBasePath } = await params;
  const pillar = await getPillarByBasePath(pillarBasePath);

  if (!pillar) {
    return {
      title: "Pilar não encontrado",
    };
  }

  return {
    title: pillar.title,
    description: pillar.description,
    openGraph: {
      title: pillar.title,
      description: pillar.description,
      type: "website",
    },
  };
}

export default async function PillarPage({ params }: PillarPageProps) {
  const { pillarBasePath } = await params;

  // ── VALIDAÇÕES ──
  if (!pillarBasePath) {
    notFound();
  }

  // Buscar pilar
  const pillar = await getPillarByBasePath(pillarBasePath);
  if (!pillar) {
    notFound();
  }

  // Buscar categorias e posts
  const categories = await getCategoriesByPillar(pillar._id);
  const recentPosts = await getRecentPostsByPillar(pillar._id);

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: pillar.title },
          ]}
        />
      </div>

      {/* Header */}
      <PillarHeader pillar={pillar} />

      {/* Categorias */}
      {categories.length > 0 && (
        <PillarCategoriesSection pillar={pillar} categories={categories} />
      )}

      {/* Posts Recentes */}
      {recentPosts.length > 0 && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-3xl font-black text-gray-900 mb-2">
                Últimos Artigos
              </h2>
              <p className="text-gray-600">
                Confira as análises mais recentes do {pillar.title}
              </p>
            </div>
            <PostGrid posts={recentPosts} />
          </div>
        </section>
      )}
    </div>
  );
}
