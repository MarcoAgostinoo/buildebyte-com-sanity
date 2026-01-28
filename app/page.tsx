import { client } from "./lib/sanity";
import Link from 'next/link';
import Image from 'next/image';
import RecentPostsByCategory from "./components/RecentPostsByCategory";

interface FeaturedPost {
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

async function getFeaturedPosts(): Promise<FeaturedPost[]> {
  const query = `*[_type == "post" && featured == true] {
    title,
    "slug": slug.current,
    excerpt,
    "imagem": mainImage.asset->url,
    publishedAt,
    "author": author->name
  }`;
  return await client.fetch(query);
}

async function getCategoryTitles() {
  const query = `*[_type == "category"].title`;
  return await client.fetch(query);
}

export default async function Home() {
  const featuredPosts = await getFeaturedPosts();
  const categoryTitles = await getCategoryTitles();

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Featured Posts Section */}
      {featuredPosts.length > 0 && (
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Destaques</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPosts.map((post: FeaturedPost) => (
              <article key={post.slug} className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300">
                <Link href={`/post/${post.slug}`}>
                  <div>
                    {post.imagem && (
                      <Image src={post.imagem} alt={post.title} width={400} height={225} className="w-full h-48 object-cover" />
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-blue-600 hover:underline mb-2">{post.title}</h3>
                      <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>
                      <div className="text-xs text-gray-500">
                        <span>{post.author}</span> | <span>{formatDate(post.publishedAt)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}


      {/* Main Feed - Dynamic Sections per Category */}
      <section>
        {categoryTitles && categoryTitles.map((categoryTitle: string) => (
          <div key={categoryTitle} className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Últimas de {categoryTitle}</h2>
            <RecentPostsByCategory category={categoryTitle} />
          </div>
        ))}
      </section>
    </div>
  );
}