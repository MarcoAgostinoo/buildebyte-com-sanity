
import { client } from "@/app/lib/sanity";
import DestaquesGrid from "@/app/components/DestaquesGrid";
import { Metadata } from "next";
import { type SanityImage, type PortableTextBlock } from "@/app/lib/types";

interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  imagem: string;
  publishedAt: string;
  author: { _id: string; name: string; slug?: { current: string }; image?: SanityImage; bio?: PortableTextBlock[] };
  pillarBasePath?: string;
  categorySlug?: string;
  pillarSlug?: string;
}

export const metadata: Metadata = {
  title: "Concursos & Carreiras | Vetor Estratégico",
  description: "Notícias, editais e análises sobre os principais concursos públicos militares, policiais e de inteligência do Brasil.",
};

async function getConcursos(): Promise<Post[]> {
  const query = `*[_type == "post" && pillar->slug.current == "carreiras-estrategicas" && !(_id in path('drafts.**'))] | order(publishedAt desc) [0...20] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    "imagem": mainImage.asset->url,
    publishedAt,
    "author": author->{ _id, name, "slug": slug.current, image{ asset->{ url, metadata }, alt }, bio },
    "pillarBasePath": pillar->basePath,
    "pillarSlug": pillar->slug.current,
    "categorySlug": category->slug.current
  }`;
  // Adicionado revalidate para performance em produção
  return await client.fetch(query, {}, { next: { revalidate: 60 } });
}

export default async function ConcursosPage() {
  const concursos = await getConcursos();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-12 border-b border-[#2a2f3a] pb-8">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-primary uppercase">
          Concursos & Carreiras
        </h1>
        <p className="mt-4 text-lg text-zinc-400 max-w-3xl">
          Notícias, editais e análises sobre os principais concursos públicos militares, policiais e de inteligência do Brasil.
        </p>
      </header>
      <DestaquesGrid initialPosts={concursos} />
    </div>
  );
}
