import { client, type SanityImageSource } from "@/app/lib/sanity";
import CategoriesFilter from "@/app/components/CategoriesFilter";
import Link from "next/link";
import Image from "next/image";

// ---------------------------------------------------------------------------
// INTERFACES
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// EIXOS ESTRATÉGICOS (Destaque Principal com Imagens)
// ---------------------------------------------------------------------------
const EIXOS =[
  {
    title: "Geopolítica & Defesa",
    slug: "geopolitica-defesa",
    image: "/geopolitica.webp",
    description: "O xadrez global. Tensões de bastidores, diplomacia de poder, corrida por hegemonia e o impacto na economia mundial.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    title: "Arsenal & Tecnologia",
    slug: "arsenal-tecnologia",
    image: "/arsenal.webp",
    description: "Raio-x visceral da engenharia militar. Caças, blindados, inteligência artificial e o hardware que desequilibra o poder.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    )
  },
  {
    title: "Teatro de Operações",
    slug: "teatro-operacoes",
    image: "/teatro.webp",
    description: "Logística implacável e cerco de combate. A realidade crua do campo de batalha e como a tática é aplicada na prática.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    )
  }
];

// ---------------------------------------------------------------------------
// QUERIES SANITY ORIGINAL INTACTAS
// ---------------------------------------------------------------------------
async function getCategories(): Promise<Category[]> {
  const query = `*[_type == "category"] | order(title asc) { _id, title, "slug": slug.current }`;

  return await client.fetch(query, {}, { next: { revalidate: 3600 } });
}

async function getPosts(): Promise<Post[]> {
  const query = `*[ _type == "post" && (!defined(featured) || featured == false) && (!defined(anchor) || anchor == false) && !(_id in path('drafts.**')) && defined(categories) && categories[0] != null ] | order(publishedAt desc) { _id, title, "slug": slug.current, excerpt, mainImage, publishedAt, "category": categories[0]->title, "categoryId": categories[0]._ref }`;

  return await client.fetch(query, {}, { next: { revalidate: 60 } });
}

// ---------------------------------------------------------------------------
// PAGE COMPONENT
// ---------------------------------------------------------------------------
export default async function CategoriasPage() {
  const [categories, posts] = await Promise.all([
    getCategories(),
    getPosts(),
  ]);

  return (
    <div className="max-w-9xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      
      {/* ── SEÇÃO DE EIXOS (PILARES COM IMAGENS) ── */}
      <section className="mb-16">
        <div className="mb-8 border-l-4 border-primary pl-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 mb-1">
            Arquitetura de Conteúdo
          </p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground uppercase">
            Eixos Estratégicos
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {EIXOS.map((eixo) => (
            <Link
              key={eixo.slug}
              href={`/eixos/${eixo.slug}`}
              // FIX 3a: min-h-[320px] → min-h-80 (Tailwind v4 canonical)
              className="group relative flex flex-col bg-[#111318] border border-[#2a2f3a] hover:border-primary/50 transition-all overflow-hidden shadow-lg min-h-80"
            >
              {/* IMAGEM DE FUNDO COM OVERLAY */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <Image 
                  src={eixo.image} 
                  alt={`Fundo do eixo ${eixo.title}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  // FIX 1: removed quality={90} — defaults to 75, which matches images.qualities config
                  // FIX 2: priority enables eager loading + preload for above-the-fold / LCP images
                  priority
                  className="object-cover opacity-60 group-hover:opacity-80 transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-105"
                />
                {/* FIX 3b: bg-gradient-to-t → bg-linear-to-t (Tailwind v4 canonical) */}
                <div className="absolute inset-0 bg-linear-to-t from-[#0a0b0d] via-[#111318]/50 to-transparent" />
              </div>

              {/* CONTEÚDO DO CARTÃO */}
              <div className="relative z-10 flex flex-col h-full p-6 sm:p-8">
                <div className="w-12 h-12 flex items-center justify-center bg-black/60 backdrop-blur-sm border border-[#2a2f3a] text-primary mb-6 group-hover:text-[#c8a84b] group-hover:border-[#c8a84b]/50 transition-colors shadow-inner">
                  {eixo.icon}
                </div>
                
                <h2 className="text-xl font-black text-zinc-100 uppercase tracking-wide mb-3 group-hover:text-primary transition-colors drop-shadow-md">
                  {eixo.title}
                </h2>
                
                <p className="text-sm text-zinc-300 leading-relaxed flex-1 drop-shadow-md">
                  {eixo.description}
                </p>

                <div className="mt-8 pt-4 border-t border-[#2a2f3a]/50 flex items-center justify-between text-[10px] font-black text-zinc-400 uppercase tracking-widest group-hover:text-primary transition-colors">
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
          ))}
        </div>
      </section>

      {/* ── DIVISOR TÁTICO ── */}
      {/* FIX 3c: bg-gradient-to-r → bg-linear-to-r (Tailwind v4 canonical) */}
      <div className="w-full h-px bg-linear-to-r from-transparent via-[#2a2f3a] to-transparent my-16" />

      {/* ── SEÇÃO DE CATEGORIAS SECUNDÁRIAS ── */}
      <section>
        <div className="mb-8 border-l-4 border-zinc-700 pl-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-1">
            Filtro Tático
          </p>
          <h2 className="text-2xl font-black tracking-tight text-foreground uppercase">
            Categorias & Arquivos
          </h2>
        </div>

        {/* COMPONENTE ORIGINAL INTACTO */}
        <CategoriesFilter categories={categories} posts={posts} />
      </section>

    </div>
  );
}