import { client } from "@/app/lib/sanity";
import Link from 'next/link';

async function getCategories() {
  const query = `*[_type == "category"] {
    title,
    "slug": slug.current
  }`;
  const categories = await client.fetch(query);
  return categories;
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <main className="max-w-4xl mx-auto p-10">
      <h1 className="text-4xl font-bold mb-8">Categorias</h1>
      <ul className="space-y-4">
        {categories.map((category: any) => (
          <li key={category.slug}>
            <Link href={`/categorias/${category.slug}`} className="text-2xl text-blue-500 hover:underline">
              {category.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
