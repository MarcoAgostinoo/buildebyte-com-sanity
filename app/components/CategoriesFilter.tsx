"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { urlFor, type SanityImageSource } from "@/app/lib/sanity";

interface Category {
  _id: string;
  title: string;
  slug: string;
}

interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  mainImage: SanityImageSource;
  publishedAt: string;
  category: string;
  categoryId: string;
}

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default function CategoriesFilter({
  categories,
  posts,
}: {
  categories: Category[];
  posts: Post[];
}) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // Filtrar posts baseado na categoria selecionada
  const filteredPosts = useMemo(() => {
    if (!selectedCategoryId) {
      return posts;
    }
    return posts.filter((post) => post.categoryId === selectedCategoryId);
  }, [selectedCategoryId, posts]);

  // Pega apenas os primeiros 14 posts
  const displayedPosts = filteredPosts.slice(0, 14);

  return (
    <div>
      {/* HEADER */}
      <header className="mb-8">
        <h1 className="text-3xl font-black text-primary mb-4 border-l-4 border-secondary pl-4">
          Categorias
        </h1>

        <p className="text-zinc-600 max-w-3xl">
          Explore os artigos por categoria e encontre o conteúdo que mais interessa para você.
        </p>
      </header>

      {/* FILTRO DE CATEGORIAS */}
      <div className="mb-8 pb-6 border-b border-zinc-200">
        <button
          onClick={() => setSelectedCategoryId(null)}
          className={`px-4 py-2 mr-2 mb-2 font-bold text-sm uppercase tracking-wider transition-all ${
            selectedCategoryId === null
              ? "bg-primary text-white"
              : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
          }`}
        >
          Todas as Categorias
        </button>

        {categories.map((category) => (
          <button
            key={category._id}
            onClick={() => setSelectedCategoryId(category._id)}
            className={`px-4 py-2 mr-2 mb-2 font-bold text-sm uppercase tracking-wider transition-all ${
              selectedCategoryId === category._id
                ? "bg-primary text-white"
                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
            }`}
          >
            {category.title}
          </button>
        ))}
      </div>

      {/* GRID DE POSTS */}
      {displayedPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedPosts.map((post, index) => {
            const imageUrl = post.mainImage
              ? urlFor(post.mainImage).width(800).height(500).quality(80).auto('format').url()
              : "";

            return (
              <article
                key={post._id}
                className="bg-white shadow-sm border border-zinc-200 overflow-hidden transform hover:shadow-lg transition-all duration-300 group"
              >
                <Link href={`/post/${post.slug}`}>
                  <div className="cursor-pointer h-full flex flex-col">
                    {/* IMAGEM */}
                    {imageUrl && (
                      <div className="overflow-hidden h-48 relative">
                        <Image
                          src={imageUrl}
                          alt={post.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          priority={index === 0}
                          loading={index === 0 ? "eager" : "lazy"}
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}

                    {/* CONTEÚDO */}
                    <div className="p-4 flex flex-col grow">
                      {/* CATEGORIA */}
                      <span className="text-xs font-bold text-primary uppercase tracking-wider mb-2">
                        {post.category}
                      </span>

                      {/* TÍTULO */}
                      <h3 className="text-lg font-bold text-foreground group-hover:text-primary mb-2 transition-colors leading-tight line-clamp-2">
                        {post.title}
                      </h3>

                      {/* EXCERPT */}
                      <p className="text-sm text-zinc-600 mb-4 line-clamp-2 grow">
                        {post.excerpt}
                      </p>

                      {/* DATA */}
                      <span className="text-xs text-zinc-500 font-medium">
                        {formatDate(post.publishedAt)}
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="py-12 text-center border-t border-zinc-200">
          <p className="text-zinc-500 italic">
            Nenhum artigo encontrado nesta categoria.
          </p>
        </div>
      )}

      {/* INFORMAÇÃO DE LIMITES */}
      {filteredPosts.length > 14 && (
        <div className="mt-8 p-4 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded">
          Mostrando 14 de {filteredPosts.length} artigos. 
          <a href="#" className="font-bold text-primary hover:underline ml-1">
            Ver todos
          </a>
        </div>
      )}
    </div>
  );
}
