"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { client, urlFor, type SanityImageSource } from "@/app/lib/sanity";
import { type SanityImage, type PortableTextBlock } from "@/app/lib/types";

interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  imagem: string;
  publishedAt: string;
  author: { _id: string; name: string; slug?: { current: string }; image?: SanityImage; bio?: PortableTextBlock[] };
  pillarBasePath?: string;
  categorySlug?: string;
  pillarSlug?: string;
  pillar?: any;
}

// 1. Criamos uma interface para receber a imagem crua do Sanity
interface RawPost extends Omit<Post, "imagem"> {
  mainImage: SanityImageSource;
}

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("pt-BR", options);
};

import { getMorePosts } from "@/app/lib/sanity";



export default function DestaquesGrid({ initialPosts }: { initialPosts: Post[] }) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [offset, setOffset] = useState(initialPosts.length);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const loadMore = async () => {
    if (!hasMore || isLoading) return;
    setIsLoading(true);
    const newPosts = await getMorePosts(offset);
    if (newPosts.length > 0) {
      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      setOffset(offset + newPosts.length);
    } else {
      setHasMore(false);
    }
    setIsLoading(false);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* 4. Adicionamos o index no .map() para sabermos qual é o primeiro post */}
        {posts.map((post, index) => {
          // Traduz os dados do CMS para a pasta física correspondente no Next.js
          const p = (post.pillarSlug || post.pillarBasePath || (typeof post.pillar === 'object' ? post.pillar?.slug : post.pillar) || "").toLowerCase();
          const c = post.categorySlug || "geral";
          let postUrl = `/militar/geral/${post.slug}`;
          
          if (p.includes("geopolitica")) postUrl = `/militar/geopolitica/${post.slug}`;
          else if (p.includes("arsenal")) postUrl = `/militar/arsenal/${post.slug}`;
          else if (p.includes("teatro") || p.includes("operacoes") || p.includes("historia")) postUrl = `/militar/historia/${post.slug}`;
          else if (p.includes("sobrevivencia")) postUrl = `/militar/sobrevivencia/${post.slug}`;
          else if (p.includes("carreira") || p.includes("concurso")) postUrl = `/concursos/${c}/${post.slug}`;

          return (
            <article
              key={post._id || post.slug || index}
              className="bg-(--card-bg) shadow-sm border border-(--border) overflow-hidden transform hover:shadow-lg transition-all duration-300 group"
            >
              <Link href={postUrl}>
                <div className="cursor-pointer h-full flex flex-col">
                  {post.imagem && (
                    <div className="overflow-hidden h-52 relative">
                      <Image
                        src={post.imagem}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={index === 0}
                        loading={index === 0 ? "eager" : "lazy"}
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6 flex flex-col grow">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary mb-3 transition-colors leading-tight">
                      {post.title}
                    </h3>
                    <p className="text-foreground/80 text-sm mb-4 line-clamp-3 grow">
                      {post.excerpt}
                    </p>
                    <div className="text-xs text-foreground/50 flex justify-between items-center mt-auto pt-4 border-t border-[var(--border)]">
                      <span className="font-bold text-foreground/60 uppercase tracking-wider">{post.author.name}</span>
                      <span>{formatDate(post.publishedAt)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          );
        })}
      </div>
      {hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={loadMore}
            disabled={isLoading}
            className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 disabled:bg-gray-400"
          >
            {isLoading ? "Carregando..." : "Carregar Mais"}
          </button>
        </div>
      )}
    </div>
  );
}