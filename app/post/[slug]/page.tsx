import { client, previewClient } from "@/app/lib/sanity";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { notFound } from "next/navigation";
import AdComponent from "@/app/components/AdComponent";
import SecondAdComponent from "@/app/components/SecondAdComponent";
import ReadNext from "@/app/components/ReadNext";
import Comments from "@/app/components/Comments";
import LeadCapture from "@/app/components/LeadCapture";
import Image from "next/image";
import Link from "next/link";
import imageUrlBuilder from "@sanity/image-url";
import { draftMode } from "next/headers";

// --- NOVAS INTERFACES ---
interface FaqItem {
  question: string;
  answer: string;
}

interface Veredito {
  buyIf?: string;
  avoidIf?: string;
}

interface Category {
  title: string;
  slug: string;
}

interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _id?: string;
    url?: string;
    metadata?: {
      dimensions: { width: number; height: number; aspectRatio: number };
      lqip?: string;
    };
  };
  alt?: string;
  caption?: string;
}

interface Post {
  title: string;
  slug: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any[];
  contentHtml?: string;
  imagem: string;
  author: string;
  publishedAt: string;
  categories: Category[];
  seoTitle?: string;
  seoDescription?: string;
  excerpt: string;
  spotifyEmbed?: string;
  // Novos campos
  veredito?: Veredito;
  rating?: number;
  faq?: FaqItem[];
  affiliateLink?: string;
  affiliateLabel?: string;
  editorialType?: string;
}

const builder = imageUrlBuilder(client);
function urlFor(source: SanityImage) {
  return builder.image(source);
}

const ptComponents: PortableTextComponents = {
  types: {
    image: ({ value }: { value: SanityImage }) => {
      if (!value?.asset?.metadata?.dimensions) return null;
      const { aspectRatio } = value.asset.metadata.dimensions;
      const imageWidth = 1200;
      const imageHeight = imageWidth / aspectRatio;
      return (
        <figure className="my-8 sm:my-12 overflow-hidden rounded-2xl shadow-lg bg-gray-100 dark:bg-gray-800">
          <Image
            src={urlFor(value)
              .width(imageWidth)
              .fit("max")
              .auto("format")
              .url()}
            alt={value.alt || "Imagem do artigo"}
            width={imageWidth}
            height={imageHeight}
            className="w-full h-auto object-cover"
          />
          {value.caption && (
            <figcaption className="mt-3 text-center text-xs text-foreground/60 italic">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  block: {
    h2: ({ children }) => (
      <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-10 mb-4 text-foreground">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl sm:text-2xl font-bold mt-8 mb-3 text-foreground">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l-4 border-primary pl-4 bg-primary/5 py-4 pr-4 rounded-r-lg">
        <span className="block text-xs font-bold text-primary uppercase mb-2 tracking-widest">
          {`// Insight Técnico`}
        </span>
        <div className="italic text-foreground/80">{children}</div>
      </blockquote>
    ),
    normal: ({ children }) => (
      <p className="mb-5 leading-relaxed text-foreground/80">{children}</p>
    ),
  },
};

// --- QUERY ATUALIZADA ---
async function getPost(slug: string): Promise<Post | null> {
  const { isEnabled } = await draftMode();
  const currentClient = isEnabled ? previewClient : client;

  const query = `*[_type == "post" && slug.current == $slug][0] {
    title,
    "slug": slug.current,
    body[]{ ..., asset->{ ..., metadata } },
    contentHtml,
    spotifyEmbed,
    "imagem": mainImage.asset->url,
    "author": author->name,
    publishedAt,
    categories[]->{title, "slug": slug.current},
    seoTitle,
    seoDescription,
    excerpt,
    veredito,
    rating,
    faq,
    affiliateLink,
    affiliateLabel,
    editorialType
  }`;

  return await currentClient.fetch(query, { slug });
}

async function getRelatedPosts(
  categories: Category[],
  currentPostSlug: string,
) {
  const categorySlugs = categories?.map((cat) => cat.slug) || [];
  const query = `*[_type == "post" && slug.current != $currentPostSlug && count((categories[]->slug.current)[@ in $categorySlugs]) > 0] | order(publishedAt desc) [0...2] {
    title, "slug": slug.current, "imagem": mainImage.asset->url
  }`;
  return await client.fetch(query, { currentPostSlug, categorySlugs });
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  const relatedPosts = await getRelatedPosts(post.categories, slug);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-10">
        <main className="w-full lg:w-2/3">
          <article className="bg-(--card-bg) rounded-2xl p-6 sm:p-8 border border-(--border) shadow-sm">
            {/* Header / Meta */}
            <div className="mb-6 flex items-center gap-2">
              <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                {post.editorialType || "Análise"}
              </span>
              {post.categories?.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/categorias/${cat.slug}`}
                  className="text-xs font-bold text-primary/60 hover:text-primary uppercase tracking-widest"
                >
                  {cat.title}
                </Link>
              ))}
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 text-sm text-foreground/60 mb-8 pb-8 border-b border-(--border)">
              <div className="flex flex-col">
                <span className="font-bold text-foreground">{post.author}</span>
                <time>
                  {new Date(post.publishedAt).toLocaleDateString("pt-BR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
              </div>
              {post.rating && (
                <div className="ml-auto flex items-center bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/20">
                  <span className="text-yellow-600 dark:text-yellow-400 font-black text-lg">
                    {post.rating}
                  </span>
                  <span className="text-yellow-600/60 text-xs ml-1 font-bold">
                    / 10
                  </span>
                </div>
              )}
            </div>

            {/* Imagem Principal */}
            {post.imagem && (
              <div className="mb-10 relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={post.imagem}
                  alt={post.title}
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            )}

            {/* Botão de Afiliado - Chamada Rápida */}
            {post.affiliateLink && (
              <a
                href={post.affiliateLink}
                target="_blank"
                rel="nofollow"
                className="mb-10 flex items-center justify-between bg-primary text-white p-4 rounded-xl hover:brightness-110 transition shadow-lg group"
              >
                <span className="font-bold uppercase tracking-wider">
                  {post.affiliateLabel || "Ver Preço Atualizado"}
                </span>
                <svg
                  className="w-6 h-6 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </a>
            )}

            {/* Spotify */}
            {post.spotifyEmbed && (
              <div
                className="mb-10 rounded-xl overflow-hidden"
                dangerouslySetInnerHTML={{ __html: post.spotifyEmbed }}
              />
            )}

            {/* Conteúdo do Corpo */}
            <div className="prose prose-lg max-w-none prose-headings:font-black prose-a:text-primary">
              {post.contentHtml ? (
                <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
              ) : (
                <PortableText
                  value={post.body || []}
                  components={ptComponents}
                />
              )}
            </div>

            {post.affiliateLink && (
              <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl text-center">
                <h4 className="font-black text-primary uppercase text-xs mb-2 tracking-widest">
                  Onde Comprar
                </h4>
                <p className="text-sm text-foreground/70 mb-4 italic">
                  Links verificados e seguros
                </p>
                <a
                  href={post.affiliateLink}
                  target="_blank"
                  className="block w-full bg-primary text-white font-bold py-3 rounded-lg hover:scale-[1.02] transition-transform"
                >
                  {post.affiliateLabel || "Ver Ofertas"}
                </a>
              </div>
            )}

            {/* SEÇÃO: VEREDITO */}
            {post.veredito && (post.veredito.buyIf || post.veredito.avoidIf) && (
              <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-2xl border border-(--border)">
                {post.veredito.buyIf && (
                  <div className="p-4 bg-green-500/5 rounded-xl border border-green-500/10">
                    <h4 className="text-green-600 font-black uppercase text-sm mb-3 flex items-center gap-2">
                      <span className="text-xl">✅</span> Compre se...
                    </h4>
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      {post.veredito.buyIf}
                    </p>
                  </div>
                )}
                {post.veredito.avoidIf && (
                  <div className="p-4 bg-red-500/5 rounded-xl border border-red-500/10">
                    <h4 className="text-red-600 font-black uppercase text-sm mb-3 flex items-center gap-2">
                      <span className="text-xl">❌</span> Evite se...
                    </h4>
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      {post.veredito.avoidIf}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* SEÇÃO: FAQ */}
            {post.faq && post.faq.length > 0 && (
              <div className="mt-12 space-y-4">
                <h3 className="text-2xl font-black mb-6">
                  Perguntas Frequentes
                </h3>
                {post.faq.map((item, idx) => {
                  if (!item.question || !item.answer) return null;
                  return (
                    <details
                      key={idx}
                      className="group border border-(--border) rounded-xl overflow-hidden bg-(--card-bg)"
                    >
                      <summary className="list-none p-4 font-bold cursor-pointer flex justify-between items-center group-open:bg-primary group-open:text-amber-700 transition-all">
                        {item.question}
                        <span className="group-open:rotate-180 transition-transform text-xl">
                          ↓
                        </span>
                      </summary>
                      <div className="p-4 text-foreground/80 text-sm leading-relaxed border-t border-(--border)">
                        {item.answer}
                      </div>
                    </details>
                  );
                })}
              </div>
            )}

            <div className="mt-10">
              <LeadCapture />
            </div>
          </article>

          <div className="mt-12">
            <Comments />
          </div>
        </main>

        <aside className="w-full lg:w-1/3 lg:sticky lg:top-22 self-start space-y-2">
          <div className="bg-(--card-bg) rounded-xl border border-(--border) p-0 shadow-sm">
            <AdComponent />
          </div>
          <div className="bg-(--card-bg) rounded-xl border border-(--border) p-4 shadow-sm hidden lg:block">
            <SecondAdComponent />
          </div>
        </aside>
      </div>

      <div className="mt-16">
        <ReadNext posts={relatedPosts} />
      </div>
    </div>
  );
}
