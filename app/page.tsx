import { client } from "@/app/lib/sanity";
import Link from "next/link";
import Image from "next/image";
import RecentPostsByCategory from "@/app/components/RecentPostsByCategory";

// --- INTERFACES ---
interface FeaturedPost {
  _id: string; // Adicionado ID para controle de duplicatas
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
}

interface CategoryWithPosts {
  _id: string;
  title: string;
  posts: Post[];
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

// 1. Busca Destaques (Adicionei _id na query)
async function getFeaturedPosts(): Promise<FeaturedPost[]> {
  const query = `*[_type == "post" && featured == true && !(_id in path('drafts.**'))] {
    _id, 
    title,
    "slug": slug.current,
    excerpt,
    "imagem": mainImage.asset->url,
    publishedAt,
    "author": author->name
  }`;
  return await client.fetch(query, {}, { cache: "no-store" });
}

// 2. Busca Categorias
async function getCategories(): Promise<CategoryWithPosts[]> {
  const query = `*[_type == "category" && !(_id in path('drafts.**')) && count(*[_type == "post" && references(^._id)]) > 0]{
    _id,
    title,
    "posts": *[_type == "post" && references(^._id)] | order(publishedAt desc) [0...4] {
      _id,
      title,
      "slug": slug.current,
      "imagem": mainImage.asset->url,
      excerpt,
      "author": author->name,
      publishedAt,
    }
  }`;
  const categories = await client.fetch(query, {}, { cache: "no-store" });

  // Remove categorias com títulos duplicados, se houver
  const uniqueCategories = categories.filter(
    (value: CategoryWithPosts, index: number, self: CategoryWithPosts[]) =>
      index === self.findIndex((t) => t.title === value.title),
  );

  return uniqueCategories;
}

// --- COMPONENTE PRINCIPAL ---
export default async function Home() {
  const [featuredPosts, categories] = await Promise.all([
    getFeaturedPosts(),
    getCategories(),
  ]);

  // SET PARA CONTROLE DE DUPLICATAS
  // Armazena os IDs de todos os posts que já foram renderizados na tela
  const renderedPostIds = new Set<string>();

  // 1. Primeiro, adicionamos os posts em DESTAQUE à lista de "já mostrados"
  featuredPosts.forEach((post) => {
    renderedPostIds.add(post._id);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      
      {/* --- SEÇÃO DE DESTAQUES --- */}
      {featuredPosts.length > 0 && (
        <section className="mb-16">
          <h2 className="text-3xl font-black text-gray-900 mb-8 border-l-4 border-blue-600 pl-4">
            Destaques
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPosts.map((post) => (
              <article 
                key={post._id} // Usar ID é mais seguro que slug
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transform hover:shadow-lg transition-all duration-300 group"
              >
                <Link href={`/post/${post.slug}`}>
                  <div className="cursor-pointer h-full flex flex-col">
                    {post.imagem && (
                      <div className="overflow-hidden h-52 relative">
                         <Image 
                           src={post.imagem} 
                           alt={post.title} 
                           fill
                           className="object-cover group-hover:scale-105 transition-transform duration-500" 
                         />
                      </div>
                    )}
                    <div className="p-6 flex flex-col grow">
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 mb-3 transition-colors leading-tight">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3 grow">
                        {post.excerpt}
                      </p>
                      <div className="text-xs text-gray-400 flex justify-between items-center mt-auto pt-4 border-t border-gray-50">
                        <span className="font-bold text-gray-500 uppercase tracking-wider">{post.author}</span>
                        <span>{formatDate(post.publishedAt)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* --- SEÇÃO DE POSTS RECENTES POR CATEGORIA --- */}
      <RecentPostsByCategory />

      {/* --- FEED POR CATEGORIAS --- */}
      <section className="space-y-20 mt-16">
        {categories.map((cat) => {
          // FILTRAGEM INTELIGENTE:
          // Pega os posts desta categoria E remove aqueles que já estão no Set 'renderedPostIds'
          const postsToRender = cat.posts.filter(p => !renderedPostIds.has(p._id));

          // Se depois de filtrar não sobrou nada, não mostre a categoria vazia
          if (postsToRender.length === 0) return null;

          // Se sobrou posts, adicione os IDs deles ao Set para que não apareçam nas próximas categorias
          postsToRender.forEach(p => renderedPostIds.add(p._id));

          return (
            <div key={cat._id} className="animate-in fade-in duration-700">
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                  Últimas de <span className="text-blue-600">{cat.title}</span>
                </h2>
                <div className="flex-1 h-px bg-gray-200 hidden md:block"></div>
                <Link 
                  href={`/categorias/${encodeURIComponent(cat.title)}`} // Ajuste conforme sua rota de categoria
                  className="hidden sm:block text-sm font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider"
                >
                  Ver todos &rarr;
                </Link>
              </div>
              
              {/* O componente foi movido para o topo da página e agora busca seus próprios dados */}
            </div>
          );
        })}
      </section>
    </div>
  );
}