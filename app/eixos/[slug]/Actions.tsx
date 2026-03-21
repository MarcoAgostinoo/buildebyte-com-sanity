"use server";

import { client } from "@/app/lib/sanity";

export interface EixoPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  imagemUrl: string | null;
  imagemAlt: string | null;
  publishedAt: string;
  pillar: string;
  editorialType: string | null;
  category: string | null;
  author: string | null;
}

export async function fetchEixoPosts(
  pillar: string,
  offset: number,
  limit: number = 20
): Promise<EixoPost[]> {
  const query = `*[
    _type == "post" &&
    pillar == $pillar &&
    !(_id in path('drafts.**'))
  ] | order(publishedAt desc) [$offset...$end] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    "imagemUrl": mainImage.asset->url,
    "imagemAlt": mainImage.alt,
    publishedAt,
    pillar,
    editorialType,
    "category": categories[0]->title,
    "author": author->name
  }`;

  return await client.fetch(
    query,
    { pillar, offset, end: offset + limit },
    { next: { revalidate: 60 } }
  );
}

export async function countEixoPosts(pillar: string): Promise<number> {
  const query = `count(*[
    _type == "post" &&
    pillar == $pillar &&
    !(_id in path('drafts.**'))
  ])`;
  return await client.fetch(query, { pillar }, { next: { revalidate: 60 } });
}