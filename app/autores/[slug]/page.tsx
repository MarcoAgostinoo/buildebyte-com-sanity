import { client } from "@/app/lib/sanity";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { notFound } from "next/navigation";
import { type Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import imageUrlBuilder from "@sanity/image-url";
import { FaLinkedin, FaShieldAlt, FaTerminal } from "react-icons/fa";
import { type SanityImage, type PortableTextBlock } from "@/app/lib/types";

// ---------------------------------------------------------------------------
// CONFIGURAÇÃO DE IMAGEM (IGUAL AO SEU PROJETO)
// ---------------------------------------------------------------------------
const builder = imageUrlBuilder(client);
function urlFor(source: SanityImage) {
  return builder.image(source);
}

// ---------------------------------------------------------------------------
// INTERFACES
// ---------------------------------------------------------------------------
interface AuthorData {
  name: string;
  role: string;
  bio?: PortableTextBlock[];
  linkedin: string;
  image?: SanityImage;
  slug: string;
}

// ---------------------------------------------------------------------------
// COMPONENTES DE TEXTO (IGUAL AO SEU PROJETO)
// ---------------------------------------------------------------------------
const authorPtComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-4 last:mb-0 leading-relaxed text-zinc-300">{children}</p>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
  },
};

// ---------------------------------------------------------------------------
// DATA FETCHING
// ---------------------------------------------------------------------------
async function getAuthor(slug: string): Promise<AuthorData | null> {
  const query = `*[_type == "author" && slug.current == $slug][0] {
    name,
    role,
    bio,
    linkedin,
    "image": image { ..., asset-> { ..., metadata } },
    "slug": slug.current
  }`;
  return client.fetch(query, { slug });
}

// ---------------------------------------------------------------------------
// METADATA
// ---------------------------------------------------------------------------
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthor(slug);
  if (!author) return {};

  const authorImg = author.image ? urlFor(author.image).width(1200).url() : "";

  return {
    title: `${author.name} | ${author.role} | Vetor Estratégico`,
    description: author.name + " - Editor e Analista no portal Vetor Estratégico.",
    openGraph: {
      images: authorImg ? [{ url: authorImg }] : [],
    },
  };
}

// ---------------------------------------------------------------------------
// COMPONENTE PRINCIPAL
// ---------------------------------------------------------------------------
export default async function AuthorProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const author = await getAuthor(slug);

  if (!author) notFound();

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* --- HEADER DO AUTOR --- */}
        <section className="flex flex-col md:flex-row items-center gap-10 mb-16">
          <div className="relative w-48 h-48 md:w-60 md:h-60">
            {/* Radar Animation */}
            <div className="absolute inset-0 rounded-full border-2 border-red-600/20 animate-pulse"></div>
            
            {author.image && (
              <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-zinc-800 shadow-2xl">
                <Image
                  src={urlFor(author.image).width(400).height(400).fit("crop").url()}
                  alt={author.name}
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            )}
          </div>

          <div className="text-center md:text-left flex-1">
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-2 font-(family-name:--font-bebas-neue)">
              {author.name.split(' ').slice(0, -1).join(' ')} <span className="text-red-100">{author.name.split(' ').pop()}</span>
            </h1>
            <p className="text-red-500 font-bold uppercase tracking-[0.2em] text-xs mb-6">
              {author.role || "Analista de Inteligência"}
            </p>
            
            {author.linkedin && (
              <Link 
                href={author.linkedin} 
                target="_blank" 
                className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-red-600 text-white px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all border border-zinc-800 hover:border-red-500 shadow-lg"
              >
                <FaLinkedin size={16} /> Verificar Autoridade no LinkedIn
              </Link>
            )}
          </div>
        </section>

        {/* --- BIO E ÁREAS DE ATUAÇÃO --- */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-zinc-900 pt-12">
          
          {/* Lado Esquerdo: Bio detalhada */}
          <div className="md:col-span-2">
            <h2 className="text-zinc-500 font-black uppercase text-[10px] tracking-[0.4em] mb-8 flex items-center gap-2">
              <FaShieldAlt className="text-red-600" /> Perfil Técnico Editorial
            </h2>
            <div className="text-zinc-300 leading-relaxed text-lg font-medium">
              {author.bio ? (
                typeof author.bio === 'string' ? (
                  <p>{author.bio}</p>
                ) : (
                  <PortableText value={author.bio} components={authorPtComponents} />
                )
              ) : (
                <p>Analista técnico dedicado à cobertura de infraestrutura e defesa.</p>
              )}
            </div>
          </div>

          {/* Lado Direito: Caixa de Expertise Tática */}
          <div className="bg-zinc-900/30 p-8 rounded-3xl border border-zinc-900 h-fit sticky top-24">
            <FaTerminal className="text-red-600 mb-6" size={24} />
            <h3 className="text-white font-black uppercase text-[11px] tracking-widest mb-6 border-b border-zinc-800 pb-4">
              Foco de Análise
            </h3>
            <div className="flex flex-wrap gap-2">
              {["Infraestrutura", "Sistemas de Defesa", "Geopolítica", "SPOF", "ADS", "Resiliência"].map(tag => (
                <span key={tag} className="text-[9px] font-black bg-zinc-800 text-zinc-500 px-3 py-1.5 rounded uppercase tracking-tighter border border-zinc-700/50">
                  {tag}
                </span>
              ))}
            </div>
          </div>

        </section>

      </div>
    </main>
  );
}