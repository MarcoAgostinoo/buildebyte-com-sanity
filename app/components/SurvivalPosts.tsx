import { client, urlFor, type SanityImageSource } from "@/app/lib/sanity";
import Image from "next/image";
import Link from "next/link";

interface Post {
  title: string;
  slug: string;
  imagem: string;
  alt: string;
  publishedAt: string;
  pillarName?: string;
  editorialType?: string;
}

interface RawPost extends Omit<Post, "imagem"> {
  mainImage: SanityImageSource;
}

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// Algoritmo de Fisher-Yates para baralhar a matriz (Array) de forma eficiente
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

async function getData(): Promise<Post[]> {
  // AJUSTE: Removidas as restrições de 'featured' e 'anchor' e adicionada ordenação por data
  const query = `*[
    _type == "post" &&
    pillar->slug.current == "manual-de-sobrevivencia" &&
    !(_id in path("drafts.**"))
  ] | order(publishedAt desc)[0...30] {
    title,
    "slug": slug.current,
    mainImage,
    "alt": mainImage.alt,
    publishedAt,
    "pillarName": pillar->title,
    editorialType
  }`;

  const data: RawPost[] = await client.fetch(query, {}, { next: { revalidate: 3600 } });

  const randomizedData = shuffleArray(data).slice(0, 4);

  return randomizedData.map((post) => ({
    title: post.title,
    slug: post.slug,
    alt: post.alt || "",
    publishedAt: post.publishedAt,
    pillarName: post.pillarName,
    editorialType: post.editorialType,
    imagem: post.mainImage ? urlFor(post.mainImage).width(800).height(500).quality(75).auto('format').url() : ""
  }));
}

export default async function SurvivalPosts() {
  const data = await getData();

  return (
    <section className="py-16 w-full bg-[#0a0b0d] border-t border-b border-[#2a2f3a] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-primary/5 via-[#0a0b0d] to-[#0a0b0d] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 border-b border-[#2a2f3a] pb-6 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shadow-[0_0_10px_rgba(249,115,22,0.8)]"></span>
              <span className="text-[12px] font-black uppercase tracking-[0.3em] text-orange-500/80 font-mono">
                Preparação & Resiliência
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-100 uppercase tracking-tight">
              Protocolos de <span className="text-orange-500">Sobrevivência</span>
            </h2>
          </div>
          
          <Link 
            href="/frentes/manual-de-sobrevivencia" 
            className="hidden sm:flex items-center gap-2 text-[12px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-orange-500 transition-colors border border-[#2a2f3a] px-4 py-2 hover:bg-orange-500/5"
          >
            Acessar Manual Completo <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        {data.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.map((post: Post, idx: number) => (
              <article key={idx} className="group relative flex flex-col bg-[#111318] border border-[#2a2f3a] hover:border-orange-500/50 transition-all duration-300 shadow-lg">
                
                <Link href={`/artigo/${post.slug}`} className="flex flex-col h-full relative z-10">
                  <div className="relative aspect-video w-full overflow-hidden border-b border-[#2a2f3a]">
                    {post.imagem ? (
                      <Image
                        src={post.imagem}
                        alt={post.alt || post.title}
                        fill
                        loading={idx === 0 ? "eager" : "lazy"}
                        sizes="(max-width: 768px) 100vw, 25vw"
                        className="object-cover filter grayscale-50 group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105 sepia-[.3]"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-[12px] text-zinc-700 font-black uppercase tracking-widest">
                        Sinal Perdido
                      </div>
                    )}

                    <div className="absolute inset-0 bg-linear-to-t from-[#111318] via-transparent to-transparent opacity-90" />

                    <div className="absolute top-3 left-3 flex gap-1">
                      <span className="bg-black/90 backdrop-blur-md text-orange-400 text-[12px] font-black px-2.5 py-1 uppercase tracking-[0.2em] border border-orange-900 shadow-lg">
                        {post.pillarName || "Sobrevivência"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col flex-1 p-5 relative">
                    <div className="flex items-center gap-3 mb-3 text-[12px] font-black tracking-widest uppercase font-mono text-zinc-500">
                      <time dateTime={post.publishedAt} className="text-orange-500/70">
                        {formatDate(post.publishedAt)}
                      </time>
                      {post.editorialType && (
                        <>
                          <span className="text-[#2a2f3a]">|</span>
                          <span>{post.editorialType}</span>
                        </>
                      )}
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-zinc-200 leading-snug mb-4 group-hover:text-orange-400 transition-colors line-clamp-3">
                      {post.title}
                    </h3>

                    <div className="mt-auto pt-4 border-t border-[#2a2f3a]/60 flex items-center justify-between text-[12px] font-black uppercase tracking-[0.2em] text-zinc-600 group-hover:text-orange-500 transition-colors">
                      <span>Acessar Protocolo</span>
                      <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </Link>

                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-orange-500/30 group-hover:border-orange-500/80 transition-colors z-20 pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-orange-500/30 group-hover:border-orange-500/80 transition-colors z-20 pointer-events-none" />
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-[#2a2f3a] bg-[#111318]/50 flex flex-col items-center justify-center">
            <svg className="w-10 h-10 text-orange-500/30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-orange-500/50 uppercase font-black tracking-widest text-xs">
              Nenhum protocolo ativo detectado.
            </p>
          </div>
        )}

        <div className="mt-8 sm:hidden w-full">
          <Link
            href="/frentes/manual-de-sobrevivencia"
            className="flex justify-center items-center gap-2 bg-[#111318] border border-[#2a2f3a] text-zinc-300 font-black text-[12px] py-4 uppercase tracking-[0.2em] w-full hover:bg-orange-600 hover:text-white transition-all active:scale-95"
          >
            Acessar Manual Completo <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}