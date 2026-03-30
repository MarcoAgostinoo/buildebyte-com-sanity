/**
 * ============================================================================
 * RELATED POSTS - Seção de Artigos Relacionados
 * ============================================================================
 * Mostra posts similares da mesma categoria.
 */

import { FC } from "react";
import { PostCard as PostCardType } from "@/app/lib/types";
import { PostGrid } from "./PostCard";

interface RelatedPostsProps {
  posts: PostCardType[];
  categoryTitle?: string;
}

export const RelatedPosts: FC<RelatedPostsProps> = ({
  posts,
  categoryTitle = "Categoria",
}) => {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section className="py-12 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Título */}
        <div className="mb-8">
          <h2 className="text-3xl font-black text-gray-900 mb-2">
            Artigos Relacionados
          </h2>
          <p className="text-gray-600">
            Continue explorando nossa cobertura sobre{" "}
            <span className="font-semibold text-blue-600">{categoryTitle}</span>
          </p>
        </div>

        {/* Grid de Posts */}
        <PostGrid posts={posts.slice(0, 3)} />
      </div>
    </section>
  );
};

export default RelatedPosts;
