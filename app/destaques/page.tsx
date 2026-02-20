
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
}

async function getDestaques(): Promise<Post[]> {
  const query = `*[_type == "post" && featured == true && !(_id in path('drafts.**'))] | order(publishedAt desc) [0...20] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    "imagem": mainImage.asset->url,
    publishedAt,
    "author": author->name
  }`;
  return await client.fetch(query, {}, { cache: "no-store" });
}

export default async function DestaquesPage() {
  const destaques = await getDestaques();

  return (
    <div className="max-w-9xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-black text-primary mb-8 border-l-4 border-secondary pl-4">
        Destaques
      </h1>
      <DestaquesGrid initialPosts={destaques} />
    </div>
  );
}
