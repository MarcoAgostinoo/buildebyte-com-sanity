
import { client } from "@/app/lib/sanity";
import DestaquesGrid from "@/app/components/DestaquesGrid";

interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  imagem: string;
  publishedAt: string;
  author: string;
  pillarBasePath?: string;
  categorySlug?: string;
  pillarSlug?: string;
}

async function getConcursos(): Promise<Post[]> {
  const query = `*[_type == "post" && pillar->slug.current == "carreiras-estrategicas" && !(_id in path('drafts.**'))] | order(publishedAt desc) [0...20] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    "imagem": mainImage.asset->url,
    publishedAt,
    "author": author->name,
    "pillarBasePath": pillar->basePath,
    "pillarSlug": pillar->slug.current,
    "categorySlug": category->slug.current
  }`;
  return await client.fetch(query, {}, { cache: "no-store" });
}

export default async function ConcursosPage() {
  const concursos = await getConcursos();

  return (
    <div className="max-w-9xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-black text-primary mb-8 border-l-4 border-secondary pl-4">
        Concursos
      </h1>
      <DestaquesGrid initialPosts={concursos} />
    </div>
  );
}
