import { client, urlFor, type SanityImageSource } from "@/app/lib/sanity";
import Image from "next/image";
import Link from "next/link";
import { type SanityImage, type PortableTextBlock } from "@/app/lib/types";

interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  imagem: string;
  publishedAt: string;
  author: { _id: string; name: string; slug?: { current: string }; image?: SanityImage; bio?: PortableTextBlock[] };
  editorialType?: string;
  pillarName?: string;
  pillarBasePath?: string;
  categorySlug?: string;
  pillarSlug?: string;
}

interface RawPost extends Omit<Post, "imagem"> {
  mainImage: SanityImageSource;
}

// 1. QUERY ATUALIZADA: Puxa TUDO em ordem cronológica (O verdadeiro "Radar")
async function getRadar(): Promise<Post[]> {
  const query = `*[ _type == "post" && !(_id in path('drafts.**')) ] | order(publishedAt desc)[0...30] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    mainImage,
    publishedAt,
    editorialType,
    "pillarName": pillar->title,
    "pillarBasePath": pillar->basePath,
    "pillarSlug": pillar->slug.current,
    "categorySlug": category->slug.current,
    "author": author->{ _id, name, "slug": slug.current, image{ asset->{ url, metadata }, alt }, bio }
  }`;

  const data = await client.fetch(query, {}, { next: { revalidate: 60 } });

  return data.map((post: RawPost) => ({
    ...post,
    imagem: post.mainImage ? urlFor(post.mainImage).width(640).height(400).quality(75).fit('crop').auto('format').url() : ""
  }));
}

export default async function RadarPage() {
  const posts = await getRadar();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      
      {/* HEADER DO RADAR */}
      <header className="mb-12 border-b border-[#2a2f3a] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#6aaa01] animate-pulse shadow-[0_0_10px_#6aff00]"></span>
            <span className="text-[12px] font-black uppercase tracking-[0.3em] text-[#6aaa01]">
              Monitoramento em Tempo Real
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground uppercase">
            Radar Estratégico
          </h1>
        </div>
        <p className="text-sm text-zinc-500 max-w-md leading-relaxed border-l-2 border-[#2a2f3a] pl-4">
          O feed cronológico de despachos do Vetor. Todas as frentes operacionais consolidadas em um único painel de inteligência.
        </p>
      </header>

      {/* FEED DE NOTÍCIAS (LISTA VERTICAL TÁTICA) */}
      {posts.length > 0 ? (
        <div className="flex flex-col gap-6">
          {posts.map((post) => {
            // Traduz os dados do CMS para a pasta física correspondente no Next.js
            const p = (post.pillarSlug || post.pillarBasePath || "").toLowerCase();
            const c = post.categorySlug || "geral";
            let postUrl = `/militar/geral/${post.slug}`;
            if (p.includes("geopolitica")) postUrl = `/militar/geopolitica/${post.slug}`;
            else if (p.includes("arsenal")) postUrl = `/militar/arsenal/${post.slug}`;
            else if (p.includes("teatro") || p.includes("operacoes") || p.includes("historia")) postUrl = `/militar/historia/${post.slug}`;
            else if (p.includes("sobrevivencia")) postUrl = `/militar/sobrevivencia/${post.slug}`;
            else if (p.includes("carreira") || p.includes("concurso")) postUrl = `/concursos/${c}/${post.slug}`;
            
            return (
              <Link 
                key={post._id || post.slug} 
                href={postUrl}
                className="group flex flex-col sm:flex-row bg-[#111318] border border-[#2a2f3a] hover:border-primary/50 transition-all overflow-hidden shadow-md"
              >
              {/* Imagem (Esquerda) */}
              <div className="w-full sm:w-64 shrink-0 relative aspect-video sm:aspect-auto border-r border-[#2a2f3a]">
                {post.imagem ? (
                  <Image
                    src={post.imagem}
                    alt={post.title}
                    fill
                    className="object-cover grayscale-50 group-hover:grayscale-0 transition-all duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-zinc-900" />
                )}
                {/* Badges Flutuantes */}
                <div className="absolute top-2 left-2 flex gap-2">
                  {post.pillarName && (
                    <span className="bg-black/90 border border-zinc-700 text-zinc-300 text-[12px] font-black px-2 py-0.5 uppercase tracking-widest backdrop-blur-sm">
                      {post.pillarName}
                    </span>
                  )}
                </div>
              </div>

              {/* Corpo do Texto (Direita) */}
              <div className="flex flex-col flex-1 p-5 sm:p-6 justify-center">
                <div className="flex items-center gap-3 mb-3 text-[12px] font-black uppercase tracking-widest text-zinc-500">
                  <time dateTime={post.publishedAt} className="text-primary/80">
                    {new Date(post.publishedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} • {new Date(post.publishedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </time>
                  <span>|</span>
                  <span>{post.editorialType || "Despacho"}</span>
                </div>

                <h2 className="text-lg sm:text-xl font-black text-zinc-100 uppercase leading-snug mb-3 group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                
                <p className="text-sm text-zinc-400 leading-relaxed line-clamp-2">
                  {post.excerpt}
                </p>
              </div>
            </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-24 border border-dashed border-[#2a2f3a] bg-[#111318]/50">
          <p className="text-zinc-500 uppercase font-black tracking-widest">
            Radar limpo. Nenhuma atividade detectada.
          </p>
        </div>
      )}
    </div>
  );
}