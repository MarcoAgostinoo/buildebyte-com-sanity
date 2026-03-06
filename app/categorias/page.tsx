import { client, type SanityImageSource } from "@/app/lib/sanity";
import CategoriesFilter from "@/app/components/CategoriesFilter";

interface Category {
  _id: string;
  title: string;
  slug: string;
}

interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  mainImage: SanityImageSource;
  publishedAt: string;
  category: string;
  categoryId: string;
}

async function getCategories(): Promise<Category[]> {
  const query = `*[_type == "category"] | order(title asc) {
    _id,
    title,
    "slug": slug.current
  }`;

  return await client.fetch(query, {}, { next: { revalidate: 3600 } });
}

async function getPosts(): Promise<Post[]> {
  const query = `*[
    _type == "post" &&
    (!defined(featured) || featured == false) &&
    (!defined(anchor) || anchor == false) &&
    !(_id in path('drafts.**')) &&
    defined(categories) &&
    categories[0] != null
  ] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    mainImage,
    publishedAt,
    "category": categories[0]->title,
    "categoryId": categories[0]._ref
  }`;

  return await client.fetch(query, {}, { next: { revalidate: 60 } });
}

export default async function CategoriasPage() {
  const [categories, posts] = await Promise.all([
    getCategories(),
    getPosts(),
  ]);

  return (
    <div className="max-w-9xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <CategoriesFilter categories={categories} posts={posts} />
    </div>
  );
}