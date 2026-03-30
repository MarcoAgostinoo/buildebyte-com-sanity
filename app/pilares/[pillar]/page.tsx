import { client } from "@/app/lib/sanity";
import DestaquesGrid from "@/app/components/DestaquesGrid";
import { notFound } from "next/navigation";
import { Metadata } from "next";

// Interface tipando os dados retornados pelo Sanity
interface PillarData {
  pillar: {
    title: string;
    description: string;
  };
  posts: any[];
}

type Props = {
  params: Promise<{ pillar: string }>;
};

// Gera os Metadados para SEO dinamicamente com base no pilar
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pillar } = await params;
  const query = `*[_type == "pillar" && slug.current == $pillar][0] { title, description }`;
  const data = await client.fetch(query, { pillar });

  if (!data) return { title: "Pilar não encontrado | Vetor Estratégico" };

  return {
    title: `${data.title} | Vetor Estratégico`,
    description: data.description,
  };
}

// Componente da Página Principal do Pilar
export default async function PillarPage({ params }: Props) {
  // No Next.js 15+, os params são promises e precisam do await
  const { pillar } = await params;

  // Query otimizada que busca o Pilar E os Posts relacionados a ele em uma única requisição
  const query = `{
    "pillar": *[_type == "pillar" && slug.current == $pillar][0] {
      title,
      description
    },
    "posts": *[_type == "post" && pillar->slug.current == $pillar && !(_id in path('drafts.**'))] | order(publishedAt desc) [0...30] {
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
    }
  }`;

  const data: PillarData = await client.fetch(query, { pillar }, { next: { revalidate: 60 } });

  if (!data.pillar) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {/* Cabeçalho do Pilar Tático */}
      <header className="mb-12 border-b border-[#2a2f3a] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(var(--primary-rgb),0.8)]"></span>
            <span className="text-[12px] font-black uppercase tracking-[0.3em] text-primary">
              Frente Estratégica
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-100 uppercase mb-4">
            {data.pillar.title}
          </h1>
        </div>
        
        {data.pillar.description && (
          <p className="text-sm text-zinc-500 max-w-md leading-relaxed border-l-2 border-[#2a2f3a] pl-4">
            {data.pillar.description}
          </p>
        )}
      </header>

      {/* Grid de Artigos */}
      {data.posts && data.posts.length > 0 ? (
        <DestaquesGrid initialPosts={data.posts} />
      ) : (
        <div className="text-center py-24 border border-dashed border-[#2a2f3a] bg-[#111318]/50">
          <p className="text-zinc-500 uppercase font-black tracking-widest text-sm">
            Nenhum documento tático classificado para este pilar no momento.
          </p>
        </div>
      )}
    </div>
  );
}