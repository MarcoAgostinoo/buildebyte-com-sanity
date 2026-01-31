"use client";

import { useState, useEffect } from 'react';
import { client } from '@/app/lib/sanity';
import Link from 'next/link';
import Image from 'next/image';

interface Post {
  title: string;
  slug: string;
  imagem: string;
}

interface ReadNextProps {
  categories: { slug: string }[];
  currentPostSlug: string;
}

async function getRelatedPosts(categories: { slug: string }[], currentPostSlug: string): Promise<Post[]> {
  if (!categories || categories.length === 0) {
    return [];
  }
  const categorySlugs = categories.map(cat => cat.slug);

  const query = `
    *[_type == "post" && slug.current != $currentPostSlug && count((categories[]->slug.current)[@ in $categorySlugs]) > 0] | order(publishedAt desc) [0...2] {
      title,
      "slug": slug.current,
      "imagem": mainImage.asset->url,
    }
  `;

  const posts = await client.fetch(query, { currentPostSlug, categorySlugs });
  return posts;
}

export default function ReadNext({ categories, currentPostSlug }: ReadNextProps) {
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    async function fetchRelated() {
      const posts = await getRelatedPosts(categories, currentPostSlug);
      setRelatedPosts(posts);
    }
    fetchRelated();
  }, [categories, currentPostSlug]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const bodyHeight = document.body.offsetHeight;
      // Show when user has scrolled past 80% of the page
      if (scrollPosition >= bodyHeight * 0.8) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-lg p-4 transition-transform duration-500 ease-in-out ${
        isVisible ? 'translate-x-0' : 'translate-x-[150%]'
      }`}
    >
      <h3 className="font-bold text-lg mb-2">Leia a seguir</h3>
      <div className="space-y-4">
        {relatedPosts.map(post => (
          <Link href={`/post/${post.slug}`} key={post.slug}>
            <div className="flex items-center gap-4 hover:bg-gray-50 p-2 rounded-md">
              <div className="w-16 h-16 relative flex-shrink-0">
                <Image
                  src={post.imagem}
                  alt={post.title}
                  fill
                  className="rounded-md object-cover"
                />
              </div>
              <span className="text-sm font-semibold text-gray-800 line-clamp-3">
                {post.title}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
