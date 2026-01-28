import Link from 'next/link';
import Image from 'next/image';
import { client } from '../lib/sanity';

// Função para formatar a data, ajuste o caminho se necessário
function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('pt-BR', options);
}

async function getRecentPosts(category: string) {
  const query = `*[_type == "post" && references(*[_type == "category" && title == $category]._id)] | order(publishedAt desc) [0...4] {
    title,
    "slug": slug.current,
    "imagem": mainImage.asset->url,
    excerpt,
    "author": author->name,
    publishedAt,
  }`;
  const posts = await client.fetch(query, { category });
  return posts;
}

export default async function RecentPostsByCategory({ category }: { category: string }) {
  const posts = await getRecentPosts(category);

  if (!posts || posts.length === 0) {
    return <p>Nenhum post encontrado nesta categoria.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-10">
      {posts.map((post: any) => (
        <article key={post.slug} className="bg-white p-6 rounded-lg shadow-sm flex flex-col sm:flex-row items-start gap-6">
          {post.imagem && (
            <Link href={`/post/${post.slug}`} className="w-full sm:w-1/3">
              <Image src={post.imagem} alt={post.title} width={400} height={225} className="w-full h-auto object-cover rounded-md" />
            </Link>
          )}
          <div className="flex-1">
            <Link href={`/post/${post.slug}`}>
              <h3 className="text-2xl font-bold text-blue-600 hover:underline mb-3">{post.title}</h3>
            </Link>
            <p className="text-gray-600 mb-4">{post.excerpt}</p>
            <div className="text-sm text-gray-500 mb-4">
              <span>{post.author}</span> | <span>{formatDate(post.publishedAt)}</span>
            </div>
            <Link href={`/post/${post.slug}`} className="text-blue-500 hover:underline font-semibold">
              Leia mais...
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
