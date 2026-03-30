/**
 * ============================================================================
 * CATEGORY HEADER - Título + Descrição da Categoria
 * ============================================================================
 */

import { FC } from "react";
import { Category } from "@/app/lib/types";

interface CategoryHeaderProps {
  category: Category;
}

export const CategoryHeader: FC<CategoryHeaderProps> = ({ category }) => {
  return (
    <header className="py-12 bg-gradient-to-b from-gray-50 to-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
          {category.title}
        </h1>
        {category.description && (
          <p className="text-lg text-gray-600 max-w-3xl leading-relaxed">
            {category.description}
          </p>
        )}
      </div>
    </header>
  );
};

export default CategoryHeader;
