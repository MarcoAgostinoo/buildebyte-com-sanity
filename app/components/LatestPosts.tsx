import { client, urlFor, type SanityImageSource } from "@/app/lib/sanity";
import Image from "next/image";
import Link from "next/link";

interface Post {
  title: string;
  slug: string;
  imagem: string;
  alt: string;
  publishedAt: string;
  category: string;
  editorialType?: string;
}

interface RawPost extends Omit<Post, "imagem"> {
  mainImage: SanityImageSource;
}

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// 👇 1. Adicionamos o Promise<Post[]> aqui para o TypeScript saber o que a função retorna
async function getData(): Promise<Post[]> {
  const query = `*[
    _type == "post" &&
    (!defined(featured) || featured == false) &&
    (!defined(anchor) || anchor == false) &&
    !(_id in path("drafts.**"))
  ]
  | order(publishedAt desc)[0...8] {
    title,
    "slug": slug.current,
    mainImage,
    "alt": mainImage.alt,
    publishedAt,
    "category": categories[0]->title,
    editorialType
  }`;

  const data = await client.fetch(query, {}, { next: { revalidate: 3600 } });

  return data.map((post: RawPost) => ({
    title: post.title,
    slug: post.slug,
    alt: post.alt || "",
    publishedAt: post.publishedAt,
    category: post.category,
    editorialType: post.editorialType,
    imagem: post.mainImage ? urlFor(post.mainImage).width(800).height(500).quality(75).auto('format').url() : ""
  }));
}

export default async function LatestPosts() {
  const data = await getData();

  if (!data || data.length === 0) return null;

  return (
    <section className="py-16 bg-transparent">
      <div className="max-w-7xl mx-auto bg-amber-50 p-4">

        {/* CABEÇALHO EDITORIAL */}
        <div className="flex items-end justify-between mb-10 border-b-2 border-(--border) pb-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
              Stream de Conteúdo
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-foreground uppercase tracking-tighter">
              Últimas <span className="text-primary">Publicações</span>
            </h2>
          </div>
        </div>

        {/* GRID SISTÊMICO */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {/* 👇 2. Tipamos explicitamente post e idx aqui para eliminar o erro 7006 */}
          {data.map((post: Post, idx: number) => (
            <article key={idx} className="group flex flex-col">
              <Link href={`/post/${post.slug}`} className="flex flex-col h-full">

                {/* IMAGEM */}
                {/* 👇 3. Removemos os colchetes do aspect-16/10 para agradar o Tailwind */}
                <div className="relative aspect-16/10 w-full overflow-hidden bg-(--border) mb-4">
                  {post.imagem ? (
                    <Image
                      src={post.imagem}
                      alt={post.alt || post.title}
                      fill
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-90"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-foreground/20 font-bold uppercase tracking-widest">
                      No Image
                    </div>
                  )}

                  {/* BADGE DE CATEGORIA */}
                  <div className="absolute top-3 left-3 flex gap-1">
                    <span className="bg-black/80 backdrop-blur-md text-white text-[9px] font-black px-2 py-0.5 uppercase tracking-wider border border-white/10">
                      {post.category || "Geral"}
                    </span>
                  </div>
                </div>

                {/* META INFO */}
                <div className="flex items-center gap-2 mb-2">
                  {post.editorialType && (
                    <span className="text-[10px] font-bold text-primary uppercase tracking-tighter">
                      {post.editorialType}
                    </span>
                  )}
                  <span className="text-[10px] text-foreground/40 font-medium">
                    {formatDate(post.publishedAt)}
                  </span>
                </div>

                {/* TÍTULO */}
                <h3 className="text-lg font-bold text-foreground leading-snug mb-3 line-clamp-2 group-hover:text-primary transition-colors decoration-primary/30 decoration-2 underline-offset-4 group-hover:underline">
                  {post.title}
                </h3>

                {/* CTA */}
                <div className="mt-auto flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30 group-hover:text-primary transition-colors">
                  Leia o Relatório
                  <svg
                    className="w-3 h-3 ml-1 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </div>

              </Link>
            </article>
          ))}
        </div>

        {/* BOTÃO MOBILE */}
        <div className="mt-12 sm:hidden text-center">
          <Link
            href="/arquivo"
            className="inline-block bg-primary text-white font-black text-xs px-8 py-4 uppercase tracking-widest w-full"
          >
            Ver todo o arquivo
          </Link>
        </div>
      </div>
    </section>
  );
}