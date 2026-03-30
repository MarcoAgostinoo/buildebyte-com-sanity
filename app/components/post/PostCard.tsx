/**
 * ============================================================================
 * POST CARD - Card de Artigo para Grids e Listas
 * ============================================================================
 * Mostra: thumbnail, título, excerpt, autor, data, categoria.
 */

import { FC } from "react";
import { PostCard as PostCardType } from "@/app/lib/types";
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/app/lib/utils";
import { urlFor } from "@/app/lib/sanity";

interface PostCardProps {
  post: PostCardType;
}

export const PostCard: FC<PostCardProps> = ({ post }) => {
  // It's assumed post.pillar.basePath holds the pillar SLUG (e.g., "manual-de-sobrevivencia")
  const pillarSlug = post.pillar?.basePath?.toLowerCase() || "";

  // This map translates a pillar slug into its corresponding category slug within the /militar route
  const MILITAR_CATEGORY_MAP: Record<string, string> = {
    "geopolitica-e-defesa": "geopolitica",
    "arsenal-e-tecnologia": "arsenal",
    "teatro-de-operacoes": "historia",
    "manual-de-sobrevivencia": "sobrevivencia",
  };

  let postUrl = '';
  let categoryUrl = '';
  const militarCategory = MILITAR_CATEGORY_MAP[pillarSlug];

  if (militarCategory) {
    // Logic for all pillars that fall under the /militar base path
    postUrl = `/militar/${militarCategory}/${post.slug.current}`;
    categoryUrl = `/militar/${militarCategory}`;
  } else if (pillarSlug === 'carreiras-estrategicas') {
    // Logic for the /concursos base path pillar
    const categorySlug = post.category.slug.current;
    postUrl = `/concursos/${categorySlug}/${post.slug.current}`;
    categoryUrl = `/concursos/${categorySlug}`;
  } else {
    // Fallback for any pillar not explicitly mapped. This signals a data or mapping issue.
    const categorySlug = post.category.slug.current;
    postUrl = `/${pillarSlug}/${categorySlug}/${post.slug.current}`;
    categoryUrl = `/${pillarSlug}/${categorySlug}`;
  }

  const imageUrl = urlFor(post.mainImage).width(400).height(300).url();
  const formattedDate = formatDate(post.publishedAt);

  return (
    <article className="group flex flex-col h-full border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white">
      {/* Imagem */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <Link href={postUrl}>
          <Image
            src={imageUrl}
            alt={post.mainImage.alt || post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
      </div>

      {/* Conteúdo */}
      <div className="flex flex-col flex-grow p-4">
        {/* Categoria */}
        <Link
          href={categoryUrl}
          className="text-xs font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wider mb-2"
        >
          {post.category.slug.current}
        </Link>

        {/* Título */}
        <Link href={postUrl}>
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 mb-2 line-clamp-2 transition-colors">
            {post.title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">
          {post.excerpt || "Leia o artigo completo para saber mais..."}
        </p>

        {/* Footer: Autor + Data */}
        <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-4">
          <span className="font-semibold">{post.author.name}</span>
          <time dateTime={post.publishedAt}>{formattedDate}</time>
        </div>
      </div>
    </article>
  );
};

interface PostGridProps {
  posts: PostCardType[];
  className?: string;
}

export const PostGrid: FC<PostGridProps> = ({ posts, className = "" }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
};

export default PostCard;
