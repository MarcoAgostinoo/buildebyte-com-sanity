import { client } from "@/app/lib/sanity";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";
import { type SanityImage } from "@/app/lib/types";

const builder = imageUrlBuilder(client);
function urlFor(source: SanityImage) {
  return builder.image(source);
}

export const metadata: Metadata = {
  title: "Autores | Vetor Estratégico",
  description: "Conheça os autores e analistas do Vetor Estratégico.",
};

interface Author {
  _id: string;
  name: string;
  slug: { current: string };
  role: string;
  image?: SanityImage;
  bio?: string;
}

async function getAllAuthors(): Promise<Author[]> {
  const query = `*[_type == "author" && !(_id in path('drafts.**'))] | order(name asc) {
    _id,
    name,
    slug,
    role,
    image,
    bio
  }`;
  return await client.fetch(query, {}, { next: { revalidate: 300 } });
}

export default async function AuthorsListPage() {
  const authors = await getAllAuthors();

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <header className="mb-16 border-b border-zinc-900 pb-8">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 font-mono">
            Autores & Analistas
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl">
            Conheça os especialistas por trás das análises estratégicas do Vetor Estratégico.
          </p>
        </header>

        {/* GRID DE AUTORES */}
        {authors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {authors.map((author) => (
              <Link
                key={author._id}
                href={`/autores/${author.slug.current}`}
                className="group"
              >
                <article className="bg-zinc-900/30 border border-zinc-800 rounded-2xl overflow-hidden hover:border-red-600 hover:bg-zinc-900/50 transition-all duration-300 h-full flex flex-col">
                  
                  {/* IMAGEM */}
                  {author.image && (
                    <div className="relative h-64 overflow-hidden bg-zinc-900">
                      <Image
                        src={urlFor(author.image).width(500).height(500).fit("crop").url()}
                        alt={author.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  {/* CONTEÚDO */}
                  <div className="p-6 flex flex-col flex-1">
                    <h2 className="text-2xl font-black uppercase tracking-tight mb-2 group-hover:text-red-600 transition-colors">
                      {author.name}
                    </h2>
                    <p className="text-red-500 font-bold uppercase tracking-widest text-xs mb-4">
                      {author.role || "Analista"}
                    </p>
                    {author.bio && (
                      <p className="text-zinc-400 text-sm line-clamp-3 flex-1">
                        {author.bio}
                      </p>
                    )}
                    <div className="mt-auto pt-4 text-xs text-zinc-500 group-hover:text-red-600 transition-colors font-bold uppercase tracking-wider">
                      Ver perfil →
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-zinc-500 text-lg">Nenhum autor encontrado.</p>
          </div>
        )}

      </div>
    </main>
  );
}
