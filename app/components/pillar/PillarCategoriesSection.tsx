/**
 * ============================================================================
 * PILLAR CATEGORIES SECTION - Lista de Categorias do Pilar
 * ============================================================================
 */

import { FC } from "react";
import { CategoryWithPostCount, Pillar } from "@/app/lib/types";
import Link from "next/link";

interface PillarCategoriesSectionProps {
  pillar: Pillar;
  categories: CategoryWithPostCount[];
}

export const PillarCategoriesSection: FC<PillarCategoriesSectionProps> = ({
  pillar,
  categories,
}) => {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gray-50 border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Título */}
        <div className="mb-8">
          <h2 className="text-3xl font-black text-gray-900 mb-2">
            Categorias
          </h2>
          <p className="text-gray-600">
            Explore os diferentes eixos de análise em {pillar.title}
          </p>
        </div>

        {/* Grid de Categorias */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category._id}
              href={`/${pillar.basePath}/${category.slug.current}`}
              className="group block p-6 rounded-lg border border-gray-200 bg-white hover:border-blue-400 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {category.title}
                </h3>
                <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                  {category.postsCount}
                </span>
              </div>

              {category.description && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {category.description}
                </p>
              )}

              <div className="mt-4 text-blue-600 group-hover:text-blue-700 font-semibold text-sm">
                Explorar →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PillarCategoriesSection;
