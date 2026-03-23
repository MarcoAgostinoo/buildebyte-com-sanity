import { client, type SanityImageSource } from "@/app/lib/sanity";
import CategoriesFilter from "@/app/components/CategoriesFilter";
import Link from "next/link";
import Image from "next/image";

// ---------------------------------------------------------------------------
// INTERFACES
// ---------------------------------------------------------------------------
interface FilterItem {
  _id: string;
  title: string;
  slug: string;
}

interface Pillar {
  _id: string;
  title: string;
  slug: string;
  description?: string;
}

interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  mainImage: SanityImageSource;
  publishedAt: string;
  category: string; // Mantido com esse nome para não quebrar o CategoriesFilter
  categoryId: string;
}

// ---------------------------------------------------------------------------
// DICIONÁRIO VISUAL (Mapeamento de Ícones e Capas por Slug)
// ---------------------------------------------------------------------------
const VISUAL_MAP: Record<string, { image: string; icon: React.ReactNode }> = {
  "geopolitica-e-defesa": {
    image: "/geopolitica.webp",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  "arsenal-e-tecnologia": {
    image: "/arsenal.webp",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
  },
  "teatro-de-operacoes": {
    image: "/teatro.webp",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
  },
  "manual-de-sobrevivencia": {
    image: "/sobrevivencia.webp", // Crie esta imagem na sua pasta public
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
      </svg>
    ),
  },
  "carreiras-estrategicas": {
    image: "/concursos.webp", // Crie esta imagem na sua pasta public
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  }
};

const FALLBACK_VISUAL = {
  image: "/default-frente.webp",
  icon: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
    </svg>
  )
};

// ---------------------------------------------------------------------------
// QUERIES SANITY
// ---------------------------------------------------------------------------

async function getPillars(): Promise<Pillar[]> {
  const query = `*[_type == "pillar"] | order(title asc) { _id, title, "slug": slug.current, description }`;
  return await client.fetch(query, {}, { next: { revalidate: 3600 } });
}

// BYPASS: Busca Clusters, mas retorna no formato que o componente CategoriesFilter exige
async function getFilterItems(): Promise<FilterItem[]> {
  const query = `*[_type == "cluster"] | order(title asc) { _id, title, "slug": slug.current }`;
  return await client.fetch(query, {}, { next: { revalidate: 3600 } });
}

// BYPASS: Busca os posts atrelados ao cluster, fingindo ser "category"
async function getPosts(): Promise<Post[]> {
  const query = `*[ _type == "post" && (!defined(featured) || featured == false) && (!defined(anchor) || anchor == false) && !(_id in path('drafts.**')) && defined(cluster) ] | order(publishedAt desc) { 
    _id, 
    title, 
    "slug": slug.current, 
    excerpt, 
    mainImage, 
    publishedAt, 
    "category": cluster->title, 
    "categoryId": cluster._ref 
  }`;
  return await client.fetch(query, {}, { next: { revalidate: 60 } });
}

// ---------------------------------------------------------------------------
// PAGE COMPONENT
// ---------------------------------------------------------------------------
export default async function FrentesPage() {
  const [pilares, filterItems, posts] = await Promise.all([
    getPillars(),
    getFilterItems(),
    getPosts(),
  ]);

  return (
    <div className="max-w-9xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      
      {/* ── SEÇÃO DE FRENTES (PILARES COM IMAGENS) ── */}
      <section className="mb-16">
        <div className="mb-8 border-l-4 border-primary pl-4">
          <p className="text-[12px] font-black uppercase tracking-[0.2em] text-primary/60 mb-1">
            Arquitetura de Conteúdo
          </p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground uppercase">
            Frentes Estratégicas
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pilares.map((pilar) => {
            const visual = VISUAL_MAP[pilar.slug] || FALLBACK_VISUAL;

            return (
              <Link
                key={pilar._id}
                href={`/frentes/${pilar.slug}`}
                className="group relative flex flex-col bg-[#111318] border border-[#2a2f3a] hover:border-primary/50 transition-all overflow-hidden shadow-lg min-h-80"
              >
                {/* IMAGEM DE FUNDO COM OVERLAY */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <Image 
                    src={visual.image} 
                    alt={`Fundo da frente ${pilar.title}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority
                    className="object-cover opacity-60 group-hover:opacity-80 transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#0a0b0d] via-[#111318]/50 to-transparent" />
                </div>

                {/* CONTEÚDO DO CARTÃO */}
                <div className="relative z-10 flex flex-col h-full p-6 sm:p-8">
                  <div className="w-12 h-12 flex items-center justify-center bg-black/60 backdrop-blur-sm border border-[#2a2f3a] text-primary mb-6 group-hover:text-[#c8a84b] group-hover:border-[#c8a84b]/50 transition-colors shadow-inner">
                    {visual.icon}
                  </div>
                  
                  <h2 className="text-xl font-black text-zinc-100 uppercase tracking-wide mb-3 group-hover:text-primary transition-colors drop-shadow-md">
                    {pilar.title}
                  </h2>
                  
                  {pilar.description && (
                    <p className="text-sm text-zinc-300 leading-relaxed flex-1 drop-shadow-md">
                      {pilar.description}
                    </p>
                  )}

                  <div className="mt-8 pt-4 border-t border-[#2a2f3a]/50 flex items-center justify-between text-[12px] font-black text-zinc-400 uppercase tracking-widest group-hover:text-primary transition-colors">
                    <span>Acessar Dossiês</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
                
                {/* Marcadores táticos de borda */}
                <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-zinc-600/50 group-hover:border-primary/80 transition-colors z-20" />
                <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-zinc-600/50 group-hover:border-primary/80 transition-colors z-20" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── DIVISOR TÁTICO ── */}
      <div className="w-full h-px bg-linear-to-r from-transparent via-[#2a2f3a] to-transparent my-16" />

      {/* ── SEÇÃO DE FILTRO SECUNDÁRIO ── */}
      <section>
        <div className="mb-8 border-l-4 border-zinc-700 pl-4">
          <p className="text-[12px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-1">
            Filtro Tático
          </p>
          <h2 className="text-2xl font-black tracking-tight text-foreground uppercase">
            Séries & Arquivos
          </h2>
        </div>

        {/* COMPONENTE ORIGINAL INTACTO (Alimentado com Clusters disfarçados) */}
        <CategoriesFilter categories={filterItems} posts={posts} />
      </section>

    </div>
  );
}