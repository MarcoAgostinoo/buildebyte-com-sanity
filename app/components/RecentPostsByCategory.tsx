import Link from 'next/link';
import Image from 'next/image';
import { client } from '@/app/lib/sanity';

interface PostWithCategory {
  _id: string;
  title: string;
  slug: string;
  imagem: string;
  publishedAt: string;
  excerpt: string;
  categoryTitle: string;
}

// A nova função de busca de dados
async function getLatestPostFromCategories(): Promise<PostWithCategory[]> {
  const query = `
    *[_type == "category" && _id != "0ccd6fba-e143-46b4-919f-dbe37ff25327" && !(_id in path('drafts.**')) && count(*[_type == "post" && references(^._id)]) > 0] | order(title asc) [0...8] {
      // Pega o post mais recente de cada uma das 8 categorias
      "latestPost": *[_type == "post" && references(^._id)] | order(publishedAt desc) [0] {
        _id,
        title,
        "slug": slug.current,
        "imagem": mainImage.asset->url,
        publishedAt,
        excerpt,
        "categoryTitle": ^.title // Adiciona o título da categoria ao post
      }
    }.latestPost
  `;
  
  const posts = await client.fetch(query);
  // Filtra qualquer resultado nulo que possa ter vindo da query
  return posts.filter(Boolean);
}

export default async function RecentPostsByCategory() {
  const posts = await getLatestPostFromCategories();

  if (!posts || posts.length === 0) {
    return null; // Não renderiza nada se não encontrar posts
  }

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-primary sm:text-4xl">
            Últimas de Nossas Categorias
          </h2>
          <p className="mt-4 text-lg text-foreground/80">
            Uma seleção dos artigos mais recentes de diversas áreas para você se manter atualizado.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {posts.map((post) => (
            <article 
              key={post._id} 
              className="group relative flex flex-col bg-[var(--card-bg)] rounded-2xl shadow-sm border border-[var(--border)] overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="relative">
                {post.imagem && (
                  <Link href={`/post/${post.slug}`} className="block">
                    <Image 
                      src={post.imagem} 
                      alt={post.title} 
                      width={400}
                      height={225}
                      className="aspect-video object-cover w-full transition-transform duration-500 group-hover:scale-105" 
                    />
                  </Link>
                )}
                 {/* Tag da Categoria */}
                <Link href={`/categorias/${encodeURIComponent(post.categoryTitle)}`}>
                    <span className="absolute top-4 left-4 inline-block bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider transition-transform duration-300 group-hover:bg-primary-dark">
                        {post.categoryTitle}
                    </span>
                </Link>
              </div>
              
              <div className="p-5 flex flex-col grow">
                <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2 leading-tight grow">
                  <Link href={`/post/${post.slug}`} className="hover:text-primary transition-colors">
                    {post.title}
                  </Link>
                </h3>
                
                <p className="text-foreground/70 text-sm mb-4 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>

                <div className="pt-4 border-t border-[var(--border)] mt-auto">
                  <time className="text-xs uppercase tracking-wider text-foreground/50">
                    {new Date(post.publishedAt).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </time>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}