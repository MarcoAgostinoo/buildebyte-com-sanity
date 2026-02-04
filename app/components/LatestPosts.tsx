import { client } from "@/app/lib/sanity";
import Image from "next/image";
import Link from "next/link";

interface Post {
  title: string;
  slug: string;
  imagem: string;
  alt: string;
  publishedAt: string;
  category: string;
}

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("pt-BR", options);
};

async function getData() {
  const query = `*[_type == "post" && (!defined(featured) || featured == false)] | order(_createdAt desc) [0...8] {
    title,
    "slug": slug.current,
    "imagem": mainImage.asset->url,
    "alt": mainImage.alt,
    publishedAt,
    "category": categories[0]->title
  }`;

  const data = await client.fetch(query);
  return data;
}

export default async function LatestPosts() {
  const data: Post[] = await getData();

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        {/* Cabeçalho da Seção com mais destaque */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Últimas Publicações
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Explore nossos artigos mais recentes sobre tecnologia, desenvolvimento e inovação.
          </p>
        </div>

        {/* Grid Melhorado */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {data.map((post, idx) => (
            <Link 
              key={idx} 
              href={`/post/${post.slug}`} 
              className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Container da Imagem com Zoom Effect */}
              <div className="relative h-52 w-full overflow-hidden">
                {post.imagem ? (
                  <Image
                    src={post.imagem}
                    alt={post.alt || 'Imagem do Post'}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">
                    Sem imagem
                  </div>
                )}
                
                {/* Badge de Categoria Flutuante */}
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm text-indigo-600 text-xs font-bold px-3 py-1 rounded-full shadow-sm uppercase tracking-wide">
                    {post.category || "Geral"}
                  </span>
                </div>
              </div>

              {/* Corpo do Card */}
              <div className="flex flex-col flex-1 p-6">
                <div className="text-xs font-medium text-slate-400 mb-3 flex items-center gap-2">
                  <time dateTime={post.publishedAt}>
                    {formatDate(post.publishedAt)}
                  </time>
                </div>

                <h3 className="text-lg font-bold text-slate-800 mb-3 leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors">
                  {post.title}
                </h3>

                {/* Rodapé do Card (Seta animada) */}
                <div className="mt-auto pt-4 flex items-center text-indigo-600 text-sm font-semibold group/link">
                  Ler artigo
                  <svg 
                    className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}