"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { client, urlFor, type SanityImageSource } from "@/app/lib/sanity";

interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  imagem: string;
  publishedAt: string;
  author: string;
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

async function getMoreDestaques(offset: number): Promise<Post[]> {
  // 2. Mudamos a query para pegar o mainImage em vez da URL bruta
  const query = `*[_type == "post" && featured == true && !(_id in path('drafts.**'))] | order(publishedAt desc) [${offset}...${offset + 20}] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    mainImage,
    publishedAt,
    "author": author->name
  }`;
  
  const data = await client.fetch(query);
  
  // 3. Aplicamos a mesma otimização do page.tsx para os novos posts
  return data.map((post: RawPost) => ({
    ...post,
    imagem: post.mainImage ? urlFor(post.mainImage).width(800).height(500).quality(80).auto('format').url() : ""
  }));
}

export default function DestaquesGrid({ initialPosts }: { initialPosts: Post[] }) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [offset, setOffset] = useState(initialPosts.length);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const loadMore = async () => {
    if (!hasMore || isLoading) return;
    setIsLoading(true);
    const newPosts = await getMoreDestaques(offset);
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
        {posts.map((post, index) => (
          <article
            key={post._id}
            className="bg-(--card-bg) shadow-sm border border-(--border) overflow-hidden transform hover:shadow-lg transition-all duration-300 group"
          >
            <Link href={`/post/${post.slug}`}>
              <div className="cursor-pointer h-full flex flex-col">
                {post.imagem && (
                  <div className="overflow-hidden h-52 relative">
                    <Image
                      src={post.imagem}
                      alt={post.title}
                      fill
                      // 5. O SEGREDO DO DESEMPENHO: O atributo sizes e o priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={index === 0} // <-- O primeiro post do grid carrega instantaneamente
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
                    <span className="font-bold text-foreground/60 uppercase tracking-wider">{post.author}</span>
                    <span>{formatDate(post.publishedAt)}</span>
                  </div>
                </div>
              </div>
            </Link>
          </article>
        ))}
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