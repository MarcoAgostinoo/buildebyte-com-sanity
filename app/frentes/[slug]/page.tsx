import { client } from "@/app/lib/sanity";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

// ---------------------------------------------------------------------------
// INTERFACES (Resolve o erro do "any")
// ---------------------------------------------------------------------------
interface PostData {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  imagem?: string;
  imagemAlt?: string;
  publishedAt: string;
  editorialType?: string;
  clusterName?: string;
  authorName?: string;
}

// ---------------------------------------------------------------------------
// QUERIES TÁTICAS
// ---------------------------------------------------------------------------
async function getFrente(slug: string) {
  const query = `*[_type == "pillar" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    description
  }`;
  return await client.fetch(query, { slug }, { next: { revalidate: 3600 } });
}

async function getAnchorPost(pillarSlug: string): Promise<PostData | null> {
  const query = `*[_type == "post" && pillar->slug.current == $pillarSlug && anchor == true] | order(publishedAt desc)[0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    "imagem": mainImage.asset->url,
    "imagemAlt": mainImage.alt,
    publishedAt,
    editorialType,
    "clusterName": cluster->title,
    "authorName": author->name
  }`;
  return await client.fetch(query, { pillarSlug }, { next: { revalidate: 60 } });
}

async function getRegularPosts(pillarSlug: string, anchorId?: string): Promise<PostData[]> {
  const excludeFilter = anchorId ? `&& _id != $anchorId` : ``;
  
  const query = `*[_type == "post" && pillar->slug.current == $pillarSlug ${excludeFilter}] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    "imagem": mainImage.asset->url,
    "imagemAlt": mainImage.alt,
    publishedAt,
    editorialType,
    "clusterName": cluster->title,
    "authorName": author->name
  }`;
  return await client.fetch(query, { pillarSlug, anchorId: anchorId ?? "" }, { next: { revalidate: 60 } });
}

// ---------------------------------------------------------------------------
// METADADOS SEO
// ---------------------------------------------------------------------------
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const frente = await getFrente(slug);
  
  if (!frente) return {};

  return {
    title: `${frente.title} | Vetor Estratégico`,
    description: frente.description || `Dossiês, análises e relatórios sobre ${frente.title}.`,
  };
}

// ---------------------------------------------------------------------------
// PAGE COMPONENT
// ---------------------------------------------------------------------------
export default async function FrentePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Executa as buscas táticas
  const frente = await getFrente(slug);
  if (!frente) notFound(); 

  const anchorPost = await getAnchorPost(slug);
  const regularPosts = await getRegularPosts(slug, anchorPost?._id);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      
      {/* ── CABEÇALHO DA FRENTE ── */}
      <header className="mb-12 border-b border-[#2a2f3a] pb-8">
        <Link href="/frentes" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary/60 hover:text-primary transition-colors mb-6">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Voltar para Frentes
        </Link>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground uppercase">
          {frente.title}
        </h1>
        {frente.description && (
          <p className="mt-4 text-lg text-foreground/70 max-w-3xl leading-relaxed border-l-2 border-primary/30 pl-4">
            {frente.description}
          </p>
        )}
      </header>

      {/* ── ARTIGO ÂNCORA ── */}
      {anchorPost && (
        <section className="mb-16">
          <div className="mb-6 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <h2 className="text-[12px] font-black uppercase tracking-[0.2em] text-red-500">
              Dossiê Definitivo (Âncora)
            </h2>
          </div>

          <Link href={`/artigo/${anchorPost.slug}`} className="group block relative bg-[#111318] border border-[#2a2f3a] hover:border-primary/50 transition-all overflow-hidden shadow-2xl">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-3/5 relative aspect-video md:aspect-auto">
                {anchorPost.imagem ? (
                  <Image 
                    src={anchorPost.imagem} 
                    alt={anchorPost.imagemAlt || anchorPost.title} 
                    fill 
                    priority
                    // Correção Tailwind: grayscale-30
                    className="object-cover grayscale-30 group-hover:grayscale-0 transition-all duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-zinc-900" />
                )}
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-transparent to-[#111318] hidden md:block" />
              </div>

              <div className="w-full md:w-2/5 p-8 flex flex-col justify-center relative z-10">
                <div className="flex gap-2 mb-4">
                  {anchorPost.editorialType && (
                    <span className="bg-primary/10 border border-primary/20 text-primary text-[12px] font-black px-2 py-0.5 uppercase tracking-widest">
                      {anchorPost.editorialType}
                    </span>
                  )}
                  {anchorPost.clusterName && (
                    <span className="border border-zinc-700 text-zinc-400 text-[12px] font-black px-2 py-0.5 uppercase tracking-widest">
                      {anchorPost.clusterName}
                    </span>
                  )}
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-black text-zinc-100 uppercase leading-tight mb-4 group-hover:text-primary transition-colors">
                  {anchorPost.title}
                </h3>
                
                <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                  {anchorPost.excerpt}
                </p>

                <div className="mt-auto pt-6 border-t border-[#2a2f3a] flex items-center justify-between">
                  <span className="text-xs text-zinc-500 font-bold">
                    Por {anchorPost.authorName || "Redação"}
                  </span>
                  <span className="text-[12px] font-black text-primary uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
                    Ler Dossiê <span aria-hidden="true">&rarr;</span>
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* ── DIVISOR ── */}
      {anchorPost && regularPosts.length > 0 && (
        <div className="w-full h-px bg-linear-to-r from-transparent via-[#2a2f3a] to-transparent my-16" />
      )}

      {/* ── TROPA REGULAR (GRID DE ARTIGOS) ── */}
      {regularPosts.length > 0 && (
        <section>
          <div className="mb-8 border-l-4 border-zinc-700 pl-4">
            <h2 className="text-xl font-black tracking-tight text-foreground uppercase">
              Últimos Relatórios
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Correção TypeScript: tipo alterado de any para PostData */}
            {regularPosts.map((post: PostData) => (
              <Link key={post._id} href={`/artigo/${post.slug}`} className="group flex flex-col bg-[#111318] border border-[#2a2f3a] hover:border-primary/40 transition-colors shadow-md h-full">
                
                <div className="relative aspect-video w-full overflow-hidden border-b border-[#2a2f3a]">
                  {post.imagem ? (
                    <Image 
                      src={post.imagem} 
                      alt={post.imagemAlt || post.title} 
                      fill 
                      // Correção Tailwind: grayscale-50
                      className="object-cover filter grayscale-50 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-900" />
                  )}
                  <div className="absolute top-3 left-3 flex gap-2">
                    {post.editorialType && (
                      <span className="bg-black/80 backdrop-blur-sm border border-primary/30 text-primary text-[12px] font-black px-2 py-0.5 uppercase tracking-widest shadow-lg">
                        {post.editorialType}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  {post.clusterName && (
                    <span className="text-[12px] font-black text-primary/60 uppercase tracking-widest mb-2 block">
                      Série: {post.clusterName}
                    </span>
                  )}
                  <h3 className="text-lg font-black text-zinc-100 uppercase leading-snug mb-3 group-hover:text-primary transition-colors line-clamp-3">
                    {post.title}
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed line-clamp-3 mb-4 flex-1">
                    {post.excerpt}
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-[#2a2f3a] flex items-center justify-between text-zinc-500 text-xs font-bold">
                    <time dateTime={post.publishedAt}>
                      {new Date(post.publishedAt).toLocaleDateString('pt-BR')}
                    </time>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Se não houver nenhum artigo */}
      {!anchorPost && regularPosts.length === 0 && (
        <div className="text-center py-24 border border-dashed border-[#2a2f3a] bg-[#111318]/50">
          <svg className="w-12 h-12 text-zinc-700 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-zinc-500 uppercase font-black tracking-widest">
            Nenhum dossiê decodificado nesta frente ainda.
          </p>
        </div>
      )}

    </div>
  );
}