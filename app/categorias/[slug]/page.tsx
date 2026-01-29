import { client } from "@/app/lib/sanity";
import Link from 'next/link';
import Image from 'next/image';

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('pt-BR', options);
};

async function getData(categoryTitle: string) {
  const query = `
    {
      "categoryTitle": $categoryTitle,
      "posts": *[_type == "post" && references(*[_type == "category" && title == $categoryTitle]._id)] | order(publishedAt desc) {
        title,
        "slug": slug.current,
        excerpt,
        "imagem": mainImage.asset->url,
        publishedAt,
        "author": author->name
      }
    }
  `;
  if (!categoryTitle) {
    return { categoryTitle: "Categoria não encontrada", posts: [] };
  }
  const data = await client.fetch(query, { categoryTitle });
  return data;
}

export default async function CategoryPostsPage({ params }: { params: { slug: string } }) {
  const decodedTitle = decodeURIComponent(params.slug);
  const { categoryTitle, posts } = await getData(decodedTitle);

  return (
    <main className="max-w-4xl mx-auto p-10">
      {posts && posts.length > 0 ? (
        <>
          <h1 className="text-4xl font-bold mb-8">
            Posts em <span className="text-blue-600">{categoryTitle}</span>
          </h1>
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
        <div className="text-center py-20">
            <h1 className="text-4xl font-bold mb-4">Nenhum post encontrado.</h1>
            <p className="text-gray-600">
                Não há posts para a categoria <span className="font-semibold">"{decodedTitle}"</span>.
            </p>
            <Link href="/" className="mt-8 inline-block bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                Voltar para a Home
            </Link>
        </div>
      )}
    </main>
  );
}