import { client } from '@/app/lib/sanity';
import { NextResponse } from 'next/server';

interface Post {
  title: string;
  slug: string;
  publishedAt: string;
  overview: string | null;
  description: string | null;
  author: string | null;
}

export async function GET() {
  // Busca os posts no Sanity ordenados por data de publicação.
  // Projetamos apenas os campos essenciais para o RSS para manter a query leve.
  const query = `*[_type == "post"] | order(publishedAt desc) {
    title,
    "slug": slug.current,
    publishedAt,
    overview,
    description,
    "author": author->name
  }`;

  const posts = await client.fetch(query);
  const siteUrl = 'https://www.vetorestrategico.com';

  // Construção manual do XML (RSS 2.0) para máxima performance e compatibilidade
  const feedXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Vetor Estratégico</title>
    <link>${siteUrl}</link>
    <description>Análise estratégica sobre tecnologia, defesa e poder.</description>
    <language>pt-BR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <copyright>Todos os direitos reservados ${new Date().getFullYear()}, Vetor Estratégico</copyright>
    ${posts.map((post: Post) => {
      const postUrl = `${siteUrl}/post/${post.slug}`;
      // Fallback para garantir que sempre haja uma descrição
      const summary = post.description || post.overview || '';
      
      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <description><![CDATA[${summary}]]></description>
      ${post.author ? `<dc:creator><![CDATA[${post.author}]]></dc:creator>` : ''}
    </item>`;
    }).join('')}
  </channel>
</rss>`;

  return new NextResponse(feedXml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}