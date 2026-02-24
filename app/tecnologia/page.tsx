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

async function getNoticias(): Promise<Post[]> {
  // Filtro atualizado para buscar pelo campo 'pillar' igual a 'ia_automacao'
  const query = `*[
    _type == "post" && 
    pillar == "ia_automacao" && 
    !(_id in path('drafts.**'))
  ] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    "imagem": mainImage.asset->url,
    publishedAt,
    "author": author->name
  }`;

  return await client.fetch(query, {}, { next: { revalidate: 60 } }); 
}

export default async function NoticiasPage() {
  const noticias = await getNoticias();

  return (
    <div className="max-w-9xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-primary mb-4 border-l-4 border-secondary pl-4">
          IA & Automação
        </h1>

        <p className="text-zinc-600 max-w-3xl">
          Análise técnica sobre inteligência artificial, fluxos autônomos e o 
          impacto da automação na engenharia e soberania tecnológica.
        </p>
      </header>

      {noticias.length > 0 ? (
        <DestaquesGrid initialPosts={noticias} />
      ) : (
        <div className="py-12 border-t border-zinc-200">
          <p className="text-zinc-500 italic">Nenhum artigo de IA ou Automação encontrado no momento.</p>
        </div>
      )}
    </div>
  );
}