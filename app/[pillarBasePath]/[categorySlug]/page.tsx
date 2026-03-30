/**
 * ============================================================================
 * PÁGINA CATEGORIA - [pillarBasePath]/[categorySlug]/page.tsx
 * ============================================================================
 * Exibe: Título categoria + Descrição + Grid paginado de posts
 */

import { notFound } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";
import {
  getPillarByBasePath,
  getCategoryBySlug,
  getPostsByCategory,
  countPostsInCategory,
  validateCategoryInPillar,
} from "@/app/lib/sanity-helpers";
import { Breadcrumb } from "@/app/components/shared/Breadcrumb";
import { CategoryHeader } from "@/app/components/category/CategoryHeader";
import { PostGrid } from "@/app/components/post/PostCard";

interface CategoryPageProps {
  params: Promise<{
    pillarBasePath: string;
    categorySlug: string;
    searchParams?: {
      page?: string;
    };
  }>;
  searchParams?: Promise<{
    page?: string;
  }>;
}

/**
 * Gera metadados dinâmicos para SEO
 */
export async function generateMetadata(
  { params }: CategoryPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { pillarBasePath, categorySlug } = await params;
  const category = await getCategoryBySlug(categorySlug);

  if (!category) {
    return {
      title: "Categoria não encontrada",
    };
  }

  return {
    title: category.title,
    description: category.description,
    openGraph: {
      title: category.title,
      description: category.description,
      type: "website",
    },
  };
}

const POSTS_PER_PAGE = 12;

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { pillarBasePath, categorySlug } = await params;
  const { page = "1" } = (await searchParams) || {};
  const currentPage = parseInt(page, 10);

  // ── VALIDAÇÕES ──
  if (!pillarBasePath || !categorySlug) {
    notFound();
  }

  // Buscar pilar
  const pillar = await getPillarByBasePath(pillarBasePath);
  if (!pillar) {
    notFound();
  }

  // Buscar categoria
  const category = await getCategoryBySlug(categorySlug);
  if (!category) {
    notFound();
  }

  // ⚠️ VALIDAÇÃO CRÍTICA: Verificar que categoria pertence ao pilar
  if (typeof category.pillar === "object" && category.pillar && "_id" in category.pillar) {
    if ((category.pillar as any)._id !== pillar._id) {
      notFound();
    }
  }

  // Contar total de posts
  const totalPosts = await countPostsInCategory(category._id);
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  // Validar página
  if (currentPage < 1 || currentPage > Math.max(1, totalPages)) {
    notFound();
  }

  // Buscar posts (com paginação)
  const offset = (currentPage - 1) * POSTS_PER_PAGE;
  const posts = await getPostsByCategory(category._id, offset, POSTS_PER_PAGE);

  // Building breadcrumb
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: pillar.title, href: `/${pillar.basePath}` },
    { label: category.title },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Header */}
      <CategoryHeader category={category} />

      {/* Posts Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {posts.length > 0 ? (
            <>
              <div className="mb-8">
                <p className="text-gray-600">
                  Mostrando {offset + 1} - {Math.min(offset + POSTS_PER_PAGE, totalPosts)} de{" "}
                  {totalPosts} artigos
                </p>
              </div>

              <PostGrid posts={posts} />

              {/* Paginação */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center items-center gap-4">
                  {currentPage > 1 && (
                    <a
                      href={`?page=${currentPage - 1}`}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      ← Anterior
                    </a>
                  )}

                  <div className="text-gray-600">
                    Página {currentPage} de {totalPages}
                  </div>

                  {currentPage < totalPages && (
                    <a
                      href={`?page=${currentPage + 1}`}
                      className="px-4 py-2 border border-blue-300 bg-blue-50 rounded-lg text-blue-600 hover:bg-blue-100 transition-colors"
                    >
                      Próxima →
                    </a>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">
                Nenhum artigo encontrado nesta categoria ainda.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
