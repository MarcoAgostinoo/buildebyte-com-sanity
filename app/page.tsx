import { client } from "@/app/lib/sanity";
import Link from "next/link";
import Image from "next/image";
import OfertasBuildEByte from "./components/OfertasBuildEByte"; // Verifique se o caminho está certo
import LatestPosts from "./components/LatestPosts"; // Verifique se o caminho está certo
import { WebStoriesCarousel } from "./components/WebStoriesCarousel";
import LeadCapture from "./components/LeadCapture";

// --- INTERFACES ---
interface FeaturedPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  imagem: string;
  publishedAt: string;
  author: string;
}

interface Post {
  _id: string;
  title: string;
  slug: string;
  imagem: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  editorialType?: string;
}

interface CategoryWithPosts {
  _id: string;
  title: string;
  slug: string;
  posts: Post[];
}

interface WebStory {
  _id: string;
  title: string;
  slug: string;
  coverImage: string;
}

// --- HELPERS ---
const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("pt-BR", options);
};

// --- QUERIES ---

// 1. Busca Destaques
async function getFeaturedPosts(): Promise<FeaturedPost[]> {
  const query = `*[_type == "post" && featured == true && !(_id in path('drafts.**'))] | order(publishedAt desc) [0...3] {
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

// 2. Busca Categorias
async function getCategories(): Promise<CategoryWithPosts[]> {
  const query = `*[_type == "category" && !(_id in path('drafts.**')) && count(*[_type == "post" && references(^._id)]) > 0]{
    _id,
    title,
    "slug": slug.current,
    "posts": *[_type == "post" && references(^._id)] | order(publishedAt desc) [0...4] {
      _id,
      title,
      "slug": slug.current,
      "imagem": mainImage.asset->url,
      excerpt,
      "author": author->name,
      publishedAt,
      editorialType
    }
  }`;
  const categories = await client.fetch(
    query,
    {},
    { next: { revalidate: 60 } },
  );

  // Remove categorias com títulos duplicados
  const seenTitles = new Set<string>();
  const uniqueCategories = categories.filter((cat: CategoryWithPosts) => {
    if (seenTitles.has(cat.title)) return false;
    seenTitles.add(cat.title);
    return true;
  });

  return uniqueCategories;
}

// 3. Busca Web Stories
async function getWebStories(): Promise<WebStory[]> {
  const query = `*[_type == "webStory"] | order(_createdAt desc) [0...6] {
    _id,
    title,
    "slug": slug.current,
    "coverImage": coverImage.asset->url
  }`;
  return await client.fetch(query, {}, { next: { revalidate: 60 } });
}

// --- COMPONENTE PRINCIPAL ---
export default async function Home() {
  const [featuredPosts, categories, webStories] = await Promise.all([
    getFeaturedPosts(),
    getCategories(),
    getWebStories(),
  ]);

  // SET PARA CONTROLE DE DUPLICATAS
  const renderedPostIds = new Set<string>();

  // Marca os destaques como já renderizados
  featuredPosts.forEach((post) => {
    renderedPostIds.add(post._id);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* CSS Inline para esconder a barra de rolagem horizontal dos Stories */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* --- 1. SEÇÃO DE DESTAQUES --- */}
      {featuredPosts.length > 0 && (
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-black text-primary border-l-4 border-secondary pl-4">
              Destaques
            </h2>
            <Link
              href="/destaques"
              className="text-primary hover:underline text-sm font-bold"
            >
              Ver todos →
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {featuredPosts.map((post, index) => {
              // O primeiro post é o HERO (ocupa mais espaço)
              const isHero = index === 0;

              return (
                <article
                  key={post._id}
                  className={`
                  relative group overflow-hidden rounded-2xl border border-(--border) bg-(--card-bg) shadow-sm
                  ${isHero ? "lg:col-span-2 lg:row-span-2 h-125 lg:h-auto" : "lg:col-span-2 h-60"}
                `}
                >
                  <Link
                    href={`/post/${post.slug}`}
                    className="block h-full w-full relative"
                  >
                    {/* Imagem com Overlay Gradiente para leitura */}
                    <div className="absolute inset-0 z-0">
                      {post.imagem && (
                        <Image
                          src={post.imagem}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes={
                            isHero
                              ? "(max-width: 768px) 100vw, 50vw"
                              : "(max-width: 768px) 100vw, 25vw"
                          }
                          priority={isHero}
                        />
                      )}
                      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />
                    </div>

                    {/* Texto sobre a imagem (Estilo Manchete) */}
                    <div className="absolute bottom-0 left-0 p-6 z-10 w-full">
                      <span className="inline-block px-2 py-1 mb-3 text-xs font-bold text-white bg-blue-600 rounded">
                        {isHero ? "MANCHETE" : "EM ALTA"}
                      </span>
                      <h3
                        className={`font-black text-white leading-tight mb-2 ${isHero ? "text-3xl md:text-4xl" : "text-xl"}`}
                      >
                        {post.title}
                      </h3>
                      {isHero && (
                        <p className="text-gray-200 line-clamp-2 max-w-xl text-sm md:text-base hidden sm:block">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="mt-3 text-xs text-gray-400 font-mono">
                        {post.author} • {formatDate(post.publishedAt)}
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* --- 2. FEED POR CATEGORIAS (ESTILO EDITORIAL) --- */}
      <section className="space-y-24 mt-20">
        {categories.map((cat) => {
          // Filtragem Inteligente: Remove posts que já apareceram nos destaques ou em outras categorias
          const postsToRender = cat.posts.filter(
            (p) => !renderedPostIds.has(p._id),
          );

          // Se a categoria ficar vazia após o filtro, não renderiza nada
          if (postsToRender.length === 0) return null;

          // Adiciona os posts exibidos ao conjunto de IDs renderizados
          postsToRender.forEach((p) => renderedPostIds.add(p._id));

          return (
            <div key={cat._id} className="relative">
              {/* CABEÇALHO DA CATEGORIA - Estilo Revista */}
              <div className="flex items-end justify-between mb-10 border-b-2 border-(--border) pb-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                    Seção Técnica
                  </span>
                  <h2 className="text-3xl font-black text-foreground uppercase tracking-tighter">
                    {cat.title} <span className="text-primary">.</span>
                  </h2>
                </div>
                <Link
                  href={`/categorias/${cat.slug}`}
                  className="text-xs font-bold uppercase text-primary hover:underline tracking-widest transition-all"
                >
                  Explorar Tudo +
                </Link>
              </div>

              {/* GRID DE CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
                {postsToRender.map((post) => (
                  <article key={post._id} className="group flex flex-col">
                    <Link
                      href={`/post/${post.slug}`}
                      className="flex flex-col h-full"
                    >
                      {/* CONTAINER DA IMAGEM - Bordas mais suaves e Zoom */}
                      <div className="relative aspect-video rounded-2xl overflow-hidden mb-5 bg-(--border) shadow-sm group-hover:shadow-md transition-all">
                        {post.imagem && (
                          <Image
                            src={post.imagem}
                            alt={post.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 25vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500 group-hover:brightness-90"
                          />
                        )}
                        {/* Badge de tipo opcional se o seu schema suportar */}
                        {post.editorialType && (
                          <div className="absolute top-3 left-3">
                            <span className="bg-black/80 backdrop-blur-md text-white text-[9px] font-black px-2 py-0.5 rounded uppercase border border-white/10 tracking-widest">
                              {post.editorialType}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* META INFO */}
                      <div className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <span>{post.author}</span>
                        <span className="w-1 h-1 bg-(--border) rounded-full"></span>
                        <time>
                          {new Date(post.publishedAt).toLocaleDateString(
                            "pt-BR",
                            { day: "2-digit", month: "short" },
                          )}
                        </time>
                      </div>

                      {/* TÍTULO - Negrito e sublinhado no hover */}
                      <h3 className="font-black text-xl leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-3 decoration-primary/30 decoration-2 underline-offset-4 group-hover:underline">
                        {post.title}
                      </h3>

                      {/* RESUMO - Texto mais limpo */}
                      <p className="text-sm text-foreground/60 line-clamp-2 leading-relaxed font-medium">
                        {post.excerpt}
                      </p>

                      {/* INDICADOR DE LEITURA */}
                      <div className="mt-4 flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-primary/0 group-hover:text-primary transition-all duration-300">
                        Acessar Relatório
                        <svg
                          className="w-3 h-3 ml-1"
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
            </div>
          );
        })}
      </section>

      {/* --- 3 SEÇÕES EXTRAS --- */}
      <div className="mt-20">
        <OfertasBuildEByte />
      </div>
      {/* --- 4. SEÇÃO DE WEB STORIES (ESTILO INSTAGRAM) --- */}
      {webStories.length > 0 && <WebStoriesCarousel webStories={webStories} />}
      <div className="mt-10">
        <LatestPosts />
      </div>

      <LeadCapture />
    </div>
  );
}
