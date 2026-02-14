import { client } from "@/app/lib/sanity";
import Link from 'next/link';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

interface Post {
  title: string;
  slug: string;
  excerpt: string;
  imagem: string;
  publishedAt: string;
  author: string;
}

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('pt-BR', options);
};

async function searchPosts(term: string): Promise<Post[]> {
  const query = `*[_type == "post" && (title match $term || excerpt match $term)] | order(publishedAt desc) {
    title,
    "slug": slug.current,
    excerpt,
    "imagem": mainImage.asset->url,
    publishedAt,
    "author": author->name
  }`;
  const posts = await client.fetch(query, { term: `*${term}*` });
  return posts;
}

export default async function SearchPage({ searchParams }: { searchParams: { q: string } }) {
  const searchTerm = searchParams.q || '';
  const posts = await searchPosts(searchTerm);

  return (
    <main className="max-w-4xl mx-auto p-10">
      <h1 className="text-4xl font-bold mb-8">Resultados da busca por: &quot;{searchTerm}&quot;</h1>
      {posts.length > 0 ? (
        posts.map((post: Post) => (
          <article key={post.slug} className="mb-10 p-6 border rounded-lg shadow-sm">
            {post.imagem && (
              <Image src={post.imagem} alt={post.title} width={800} height={450} className="w-full h-auto object-cover rounded-md mb-6" />
            )}
            <Link href={`/post/${post.slug}`}>
              <h2 className="text-3xl font-bold text-blue-600 mb-4 hover:underline">{post.title}</h2>
            </Link>
            <div className="text-sm text-gray-500 mb-4">
              <span>{post.author}</span> | <span>{formatDate(post.publishedAt)}</span>
            </div>
            <p className="text-gray-600">{post.excerpt}</p>
            <Link href={`/post/${post.slug}`} className="text-blue-500 hover:underline mt-4 inline-block">
              Leia mais...
            </Link>
          </article>
        ))
      ) : (
        <p>Nenhum post encontrado.</p>
      )}
    </main>
  );
}
