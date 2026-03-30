/**
 * ============================================================================
 * POST HEADER - Título, Autor, Data, Categoria
 * ============================================================================
 * Seção superior de um artigo com metadados.
 */

import { FC } from "react";
import { Post } from "@/app/lib/types";
import Link from "next/link";
import { formatDate } from "@/app/lib/utils";

interface PostHeaderProps {
  post: Post;
}

/**
 * Calcula tempo de leitura baseado no número de palavras
 */
function calculateReadTime(body: any[]): number {
  const wordsPerMinute = 200;
  let wordCount = 0;

  body.forEach((block) => {
    if (block._type === "block" && block.children) {
      block.children.forEach((child: any) => {
        if (child.text) {
          wordCount += child.text.split(/\s+/).length;
        }
      });
    }
  });

  return Math.ceil(wordCount / wordsPerMinute);
}

export const PostHeader: FC<PostHeaderProps> = ({ post }) => {
  const readTime = calculateReadTime(post.body);
  const formattedDate = formatDate(post.publishedAt);

  return (
    <header className="mb-8 pb-8 border-b border-gray-200">
      {/* Categoria */}
      <div className="mb-4">
        <Link
          href={`/${post.pillar.basePath}/${post.category.slug.current}`}
          className="inline-block text-sm font-semibold text-blue-600 hover:text-blue-700 uppercase tracking-wider"
        >
          {post.category.title}
        </Link>
      </div>

      {/* Título */}
      <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight text-gray-900">
        {post.title}
      </h1>

      {/* Metadados: Autor, Data, Tempo de Leitura */}
      <div className="flex flex-wrap items-center gap-6 text-gray-600">
        {/* Autor */}
        <div className="flex items-center gap-3">
          <div>
            <p className="font-semibold text-gray-900">{post.author.name}</p>
            {post.author.slug?.current && (
              <Link
                href={`/autores/${post.author.slug.current}`}
                className="text-sm text-blue-600 hover:underline"
              >
                Ver todos os artigos
              </Link>
            )}
          </div>
        </div>

        {/* Divisor */}
        <span className="hidden sm:inline text-gray-300">•</span>

        {/* Data */}
        <time dateTime={post.publishedAt} className="text-sm">
          {formattedDate}
        </time>

        {/* Divisor */}
        <span className="hidden sm:inline text-gray-300">•</span>

        {/* Tempo de Leitura */}
        <span className="text-sm">{readTime} min de leitura</span>
      </div>

      {/* Tipo Editorial (se existir) */}
      {post.editorialType && (
        <div className="mt-6">
          <span
            className={`inline-block px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-white ${
              post.editorialType === "analise" ? "bg-blue-600" : "bg-gray-600"
            }`}
          >
            {getEditorialLabel(post.editorialType)}
          </span>
        </div>
      )}
    </header>
  );
};

function getEditorialLabel(type: string): string {
  const labels: Record<string, string> = {
    analise: "Análise Estratégica",
    relatorio: "Relatório Técnico",
    guia: "Guia Aplicado",
    comparativo: "Comparativo Técnico",
    review: "Review Estruturada",
    opiniao: "Opinião Analítica",
  };
  return labels[type] || type;
}

export default PostHeader;
