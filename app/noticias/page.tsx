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
  // Ajuste na query: verificar dentro do array 'categories' em vez do campo singular 'category'
  const query = `*[
    _type == "post" && 
    "noticias" in categories[]->slug.current && 
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
          Notícias Estratégicas
        </h1>

        <p className="text-zinc-600 max-w-3xl">
          Cobertura técnica de eventos em tempo real com foco em capacidade militar, 
          tecnologia aplicada e impacto sistêmico. Menos manchete. Mais engenharia, 
          poder e direção — sempre com análise do que isso significa para o Brasil.
        </p>
      </header>

      {noticias.length > 0 ? (
        <DestaquesGrid initialPosts={noticias} />
      ) : (
        <p className="text-zinc-500 italic">Nenhuma notícia encontrada nesta categoria.</p>
      )}
    </div>
  );
}