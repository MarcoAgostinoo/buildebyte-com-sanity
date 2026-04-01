import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { client, urlFor } from "@/app/lib/sanity";
import { SanityImage } from "@/app/lib/types";

export const metadata: Metadata = {
  title: "Pilares Editoriais | Vetor Estratégico",
  description:
    "Explore nossos eixos de análise estratégica: Geopolítica, Defesa, Tecnologia, Operações, Sobrevivencialismo e Carreiras.",
};

// Tipagem local para os dados retornados pela query
interface PostShowcase {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt: string;
  mainImage: SanityImage;
  categorySlug?: string;
  authorName?: string;
}

interface PillarShowcase {
  _id: string;
  title: string;
  slug: string;
  basePath: string;
  description?: string;
  posts: PostShowcase[];
}

// Query GROQ otimizada para pegar todos os pilares e os 3 posts mais recentes de cada um
async function getPillarsShowcase(): Promise<PillarShowcase[]> {
  const query = `*[_type == "pillar" && !(_id in path('drafts.**'))] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    basePath,
    description,
    "posts": *[_type == "post" && references(^._id) && !(_id in path('drafts.**'))] | order(publishedAt desc)[0...3] {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      publishedAt,
      mainImage,
      "categorySlug": category->slug.current,
      "authorName": author->name
    }
  }`;
  return await client.fetch(query, {}, { next: { revalidate: 300 } });
}

export default async function PilaresPage() {
  const pillars = await getPillarsShowcase();

  // Ordem de exibição recomendada (pode ser ajustado caso os slugs do CMS sejam diferentes)
  const PRIORITY: Record<string, number> = {
    "geopolitica-defesa": 1,
    "arsenal-tecnologia": 2,
    "teatro-operacoes": 3,
    "sobrevivencialismo": 4, // ou manual-de-sobrevivencia
    "concursos-carreiras": 5, // ou carreiras-estrategicas
  };

  // Ordena com base na prioridade definida acima
  pillars.sort((a, b) => (PRIORITY[a.slug] || 99) - (PRIORITY[b.slug] || 99));

  return (
    <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* ── HEADER TÁTICO ── */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-2 h-2 bg-primary animate-pulse shadow-[0_0_8px_rgba(var(--primary-rgb),0.8)]"></span>
          <h1 className="font-black uppercase tracking-[0.2em] text-zinc-800 text-3xl sm:text-4xl">
            Pilares <span className="text-primary">Editoriais</span>
          </h1>
        </div>
        <p className="text-zinc-400 max-w-3xl text-lg">
          A guerra moderna não começa com tiros. Começa com semicondutores,
          drones, satélites e cadeias industriais. Explore todos os nossos
          eixos de análise de inteligência e poder.
        </p>
      </div>

      {/* ── LISTA DOS 5 PILARES COM SEUS CARDS ── */}
      <div className="space-y-20">
        {pillars.map((pillar) => {
          // Só exibe o pilar se ele possuir artigos publicados
          if (!pillar.posts || pillar.posts.length === 0) return null;

          return (
            <section key={pillar._id} className="relative border-t border-[#2a2f3a] pt-10">
              
              {/* Título e Link do Pilar */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-wider text-zinc-100 mb-2">
                    {pillar.title}
                  </h2>
                  {pillar.description && (
                    <p className="text-zinc-400 max-w-2xl">{pillar.description}</p>
                  )}
                </div>
                <Link
                  href={`/${pillar.basePath}`}
                  className="shrink-0 text-[12px] font-black uppercase tracking-[0.1em] text-primary hover:text-white transition-colors flex items-center gap-2"
                >
                  Acessar Arquivo <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>

              {/* Grid: 3 Cards (Mostruário) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pillar.posts.map((post) => {
                  // Lógica de mapeamento da rota correspondente à estrutura física do Next.js
                  const p = (pillar.basePath || pillar.slug || "").toLowerCase();
                  const c = (post.categorySlug || "geral").toLowerCase();
                  
                  let postUrl = `/militar/geral/${post.slug}`;
                  if (p.includes("geopolitica")) postUrl = `/militar/geopolitica/${post.slug}`;
                  else if (p.includes("arsenal")) postUrl = `/militar/arsenal/${post.slug}`;
                  else if (p.includes("teatro") || p.includes("operacoes") || p.includes("historia")) postUrl = `/militar/historia/${post.slug}`;
                  else if (p.includes("sobrevivencia")) postUrl = `/militar/sobrevivencia/${post.slug}`;
                  else if (p.includes("carreira") || p.includes("concurso")) postUrl = `/concursos/${c}/${post.slug}`;
                  else postUrl = `/${p}/${c}/${post.slug}`; // Fallback

                  const imageUrl = post.mainImage ? urlFor(post.mainImage).width(600).height(400).quality(80).auto("format").url() : "/images/placeholder.png";

                  return (
                    <Link
                      key={post._id}
                      href={postUrl}
                      className="group flex flex-col bg-[#0a0b0d] border border-[#2a2f3a] hover:border-primary/50 transition-colors overflow-hidden h-full"
                    >
                      <div className="relative w-full aspect-video overflow-hidden border-b border-[#2a2f3a]">
                        <Image
                          src={imageUrl}
                          alt={post.title}
                          fill
                          className="object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="text-lg font-bold text-zinc-200 group-hover:text-primary transition-colors line-clamp-2 mb-3">
                          {post.title}
                        </h3>
                        {post.excerpt && <p className="text-sm text-zinc-500 line-clamp-3 mb-4 flex-1">{post.excerpt}</p>}
                        <div className="mt-auto flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-zinc-600 border-t border-[#2a2f3a]/50 pt-4">
                          <span>{post.authorName || "Inteligência"}</span>
                          <span className="text-primary group-hover:translate-x-1 transition-transform">Ler Decodificação &rarr;</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}