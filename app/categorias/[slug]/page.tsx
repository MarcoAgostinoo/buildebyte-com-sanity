import { client } from "@/app/lib/sanity";
import Link from 'next/link';
import Image from 'next/image';

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('pt-BR', options);
};

async function getPostsByCategory(slug: string) {
  const query = `*[_type == "post" && references(*[_type == "category" && slug.current == $slug]._id)] | order(publishedAt desc) {
    title,
    "slug": slug.current,
    excerpt,
    "imagem": mainImage.asset->url,
    publishedAt,
    "author": author->name
  }`;
  if (!slug) {
    return [];
  }
  const posts = await client.fetch(query, { slug });
  return posts;
}

export default async function CategoryPostsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = await getPostsByCategory(slug);

  return (
    <main className="max-w-4xl mx-auto p-10">
      {posts.length > 0 ? (
        <>
          <h1 className="text-4xl font-bold mb-8">Posts na Categoria</h1>
          {posts.map((post: any) => (
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
          ))}
        </>
      ) : (
        <h1 className="text-4xl font-bold mb-8">Nenhum post encontrado nesta categoria.</h1>
      )}
    </main>
  );
}
