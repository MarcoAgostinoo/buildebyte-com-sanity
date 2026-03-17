import { client, previewClient } from "@/app/lib/sanity";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { notFound } from "next/navigation";
import { type Metadata } from "next";
import Script from "next/script";
import AdComponent from "@/app/components/AdComponent";
import SecondAdComponent from "@/app/components/SecondAdComponent";
import ReadNext from "@/app/components/ReadNext";
import Comments from "@/app/components/Comments";
import LeadCapture from "@/app/components/LeadCapture";
import Image from "next/image";
import Link from "next/link";
import imageUrlBuilder from "@sanity/image-url";
import { draftMode } from "next/headers";
import PressaoBrasil from "@/app/components/PressaoBrasilTicker";
import { generateNewsArticleSchema } from "@/app/lib/schema-helpers";

// ---------------------------------------------------------------------------
// INTERFACES
// ---------------------------------------------------------------------------

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

interface Cluster {
  title: string;
  slug: string;
  description?: string;
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

interface Author {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bio?: string | any[];
  image?: SanityImage;
}

interface Post {
  title: string;
  slug: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any[];
  contentHtml?: string;
  imagem?: string;
  imagemAlt?: string;
  imagemLqip?: string;
  author: Author;
  publishedAt: string;
  categories?: Category[];
  cluster?: Cluster;
  pillar?: string;
  seoTitle?: string;
  seoDescription?: string;
  excerpt?: string;
  spotifyEmbed?: string;
  // Análise estratégica — campo central do branding
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  analystView?: any[];
  // Review
  veredito?: Veredito;
  rating?: number;
  affiliateLink?: string;
  affiliateLabel?: string;
  // Editorial
  editorialType?: string;
  faq?: FaqItem[];
}

// ---------------------------------------------------------------------------
// CONSTANTES
// ---------------------------------------------------------------------------

const PILLAR_LABELS: Record<string, string> = {
  defesa_tecnologia: "Defesa & Tecnologia",
  infraestrutura_digital: "Infraestrutura Digital",
  ia_automacao: "IA & Automação",
  economia_poder: "Economia de Poder",
  brasil: "Brasil Estratégico",
  global: "Cenário Global",
};

const EDITORIAL_LABELS: Record<string, string> = {
  analise: "Análise Estratégica",
  relatorio: "Relatório Técnico",
  guia: "Guia Aplicado",
  comparativo: "Comparativo Técnico",
  review: "Review Estruturada",
  opiniao: "Opinião Analítica",
};

// Tipos editoriais que exibem elementos de compra/afiliado
const REVIEW_TYPES = new Set(["review", "comparativo", "relatorio"]);

// ---------------------------------------------------------------------------
// SANITY
// ---------------------------------------------------------------------------
const builder = imageUrlBuilder(client);
function urlFor(source: SanityImage) {
  return builder.image(source);
}

async function getPost(slug: string): Promise<Post | null> {
  const { isEnabled } = await draftMode();
  const currentClient = isEnabled && previewClient ? previewClient : client;

  const query = `*[_type == "post" && slug.current == $slug][0] {
    title,
    "slug": slug.current,
    body[]{
      ...,
      asset->{ ..., metadata },
      _type == "productReference" => @->{
        title,
        "imagem": mainImage.asset->url,
        price,
        originalPrice,
        installments,
        description,
        affiliateLink,
        storeName
      }
    },
    contentHtml,
    spotifyEmbed,
    "imagem": mainImage.asset->url,
    "imagemAlt": mainImage.alt,
    "imagemLqip": mainImage.asset->metadata.lqip,
    "author": author->{
      name,
      bio,
      "image": image{ ..., asset->{ ..., metadata } }
    },
    publishedAt,
    categories[]->{title, "slug": slug.current},
    "cluster": cluster->{ title, "slug": slug.current, description },
    pillar,
    seoTitle,
    seoDescription,
    excerpt,
    analystView,
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
  const categorySlugs = categories?.map((c) => c.slug) ?? [];
  const query = `*[_type == "post" && slug.current != $currentPostSlug && count((categories[]->slug.current)[@ in $categorySlugs]) > 0] | order(publishedAt desc) [0...3] {
    title,
    "slug": slug.current,
    "imagem": mainImage.asset->url,
    excerpt,
    pillar,
    publishedAt
  }`;
  return await client.fetch(query, { currentPostSlug, categorySlugs });
}
// ---------------------------------------------------------------------------
// PORTABLE TEXT
// ---------------------------------------------------------------------------
const ptComponents: PortableTextComponents = {
  types: {
    // =========================================================
    // NOVO BLOCO: PARALAXE RENDERIZADO NO MEIO DO TEXTO
    // =========================================================
    breakoutParallax: ({
      value,
    }: {
      value: { title?: string; linkText?: string; linkUrl?: string };
    }) => {
      return (
        <div
          className="w-[calc(100%+1rem)] sm:w-[calc(100%+2rem)] -ml-2 sm:-ml-4 my-16 py-24 flex flex-col items-center justify-center text-center px-4 relative border-y border-primary/20 shadow-inner"
          style={{
            /* O TRUQUE MÁGICO: Copiamos o fundo exato do global.css para cá */
            backgroundImage:
              "linear-gradient(rgba(0, 0, 0, 0.574), rgba(0, 0, 0, 0.564)), url('/background.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            backgroundRepeat: "no-repeat",
          }}
        >
          <h3 className="text-2xl sm:text-3xl font-black text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] mb-6 max-w-2xl leading-tight">
            {value.title ??
              "Mantenha-se atualizado com os desdobramentos que definem o futuro e a soberania do Brasil."}
          </h3>

          <Link
            href={value.linkUrl ?? "/radar"}
            className="bg-primary hover:bg-blue-500 text-white font-black py-4 px-10 border border-primary/50 shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] transition-all uppercase tracking-[0.2em] text-xs"
          >
            {value.linkText ?? "LER ÚLTIMAS NOTÍCIAS"}
          </Link>
        </div>
      );
    },
    // =========================================================

    // =========================================================
    // NOVO BLOCO: DOSSIÊ DO PRODUTO (NATIVE COMMERCE)
    // =========================================================
    productReference: ({ value }: { value: any }) => {
      if (!value) return null;

      return (
        <div className="my-10 p-1 bg-[#111318] border border-[#2a2f3a] shadow-2xl relative overflow-hidden group">
          {/* A linha de escaneamento visual */}
          <div className="mil-scan-line"></div>
          
          <div className="flex flex-col md:flex-row gap-6 p-5 relative z-10 bg-black/40">
            
            {/* Imagem do Equipamento */}
            {value.imagem && (
              <div className="w-full md:w-2/5 shrink-0 relative aspect-square sm:aspect-auto sm:h-64 border border-[#2a2f3a] overflow-hidden bg-black/80 flex items-center justify-center p-2">
                {/* Overlay tech na imagem */}
                <div className="absolute inset-0 border border-[#c8a84b]/20 pointer-events-none z-10"></div>
                <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-[#c8a84b] z-10"></div>
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[#c8a84b] z-10"></div>
                
                <Image 
                  src={value.imagem} 
                  alt={value.title}
                  fill
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-700 filter brightness-90 group-hover:brightness-110"
                />
              </div>
            )}
            
            {/* Ficha Técnica e Compra */}
            <div className="flex-1 flex flex-col justify-center">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-[#6aff00] animate-pulse"></span>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] animate-pulse text-[#a0fe09]">
                    Equipamento Validado
                  </span>
                </div>
                
                <h3 className="text-xl sm:text-2xl font-black tracking-tight !text-zinc-100 mb-3 leading-tight uppercase">
                  {value.title}
                </h3>
                
                <p className="text-sm !text-zinc-400 mb-5 leading-relaxed border-l-2 border-[#c8a84b]/30 pl-3">
                  {value.description}
                </p>
              </div>
              
              {/* Footer do Dossiê: Preço e Botão */}
              <div className="mt-auto pt-5 border-t border-[#2a2f3a] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                <div>
                  {value.originalPrice && (
                    <span className="text-xs !text-zinc-500 line-through block mb-0.5">
                      De: R$ {value.originalPrice.toFixed(2)}
                    </span>
                  )}
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black !text-[#c8a84b]">
                      R$ {value.price.toFixed(2)}
                    </span>
                    {value.installments && (
                      <span className="text-[10px] uppercase tracking-wider !text-zinc-500">
                        {value.installments}
                      </span>
                    )}
                  </div>
                  {value.storeName && (
                     <span className="text-[10px] uppercase tracking-wider !text-zinc-500 block mt-1">
                       Via {value.storeName}
                     </span>
                  )}
                </div>
                
                <a 
                  href={value.affiliateLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto text-center animate-pulse bg-[#161a20] border border-[#c8a84b]/30 hover:bg-[#c8a84b] !text-[#c8a84b] hover:!text-[#0a0b0d] font-black uppercase tracking-[0.15em] text-xs py-3.5 px-6 transition-all shadow-[0_0_15px_rgba(200,168,75,0.2)] hover:shadow-[0_0_25px_rgba(200,168,75,0.4)]"
                >
                  Adquirir Equipamento
                </a>
              </div>
            </div>
            
          </div>
        </div>
      );
    },
    // =========================================================

    image: ({ value }: { value: SanityImage }) => {
      if (!value?.asset?.metadata?.dimensions) return null;
      const { aspectRatio } = value.asset.metadata.dimensions;
      const w = 1200;
      return (
        <figure className="my-8 sm:my-12 overflow-hidden  shadow-lg">
          <Image
            src={urlFor(value).width(w).fit("max").auto("format").url()}
            alt={value.alt ?? "Imagem do artigo"}
            width={w}
            height={Math.round(w / aspectRatio)}
            placeholder={value.asset.metadata?.lqip ? "blur" : "empty"}
            blurDataURL={value.asset.metadata?.lqip}
            className="w-full h-auto object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 85vw"
          />
          {value.caption && (
            <figcaption className="mt-2 text-center text-xs text-foreground/50 italic px-4 pb-2">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  block: {
    h2: ({ children }) => (
      <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-12 mb-4 text-foreground border-l-4 border-primary pl-4">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl sm:text-2xl font-bold mt-8 mb-3 text-foreground">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-lg font-bold mt-6 mb-2 text-foreground/90">
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l-4 border-primary pl-5 bg-primary/5 py-4 pr-4 ">
        <span className="block text-[10px] font-black text-primary uppercase mb-2 tracking-[0.2em]">
          {"// Dado Técnico"}
        </span>
        <div className="italic text-foreground/80 leading-relaxed">
          {children}
        </div>
      </blockquote>
    ),
    normal: ({ children }) => (
      <p className="mb-5 leading-relaxed text-foreground/80">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-5 space-y-1.5 pl-5 list-none">{children}</ul>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="relative pl-4 text-foreground/80 leading-relaxed before:content-['→'] before:absolute before:left-0 before:text-primary before:font-bold">
        {children}
      </li>
    ),
  },
  marks: {
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline underline-offset-2 hover:opacity-75 transition-opacity"
      >
        {children}
      </a>
    ),
    strong: ({ children }) => (
      <strong className="font-bold text-foreground">{children}</strong>
    ),
    em: ({ children }) => (
      <em className="italic text-foreground/75">{children}</em>
    ),
  },
};

// PortableText mínimo para seções de texto curto (bio, analystView)
const simplePtComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
  },
};

// ---------------------------------------------------------------------------
// UTILITÁRIOS
// ---------------------------------------------------------------------------

function estimateReadTime(body: Post["body"]): number {
  if (!body?.length) return 1;
  const text = body
    .map(
      (b) =>
        b?.children?.map((c: { text?: string }) => c?.text ?? "").join(" ") ??
        "",
    )
    .join(" ");
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

// ---------------------------------------------------------------------------
// COMPONENTES
// ---------------------------------------------------------------------------

function EditorialBadge({ type }: { type: string }) {
  const label = EDITORIAL_LABELS[type] ?? type;
  const colorMap: Record<string, string> = {
    analise: "bg-blue-600",
    relatorio: "bg-slate-600",
    guia: "bg-emerald-600",
    comparativo: "bg-violet-600",
    review: "bg-amber-600",
    opiniao: "bg-orange-600",
  };
  return (
    <span
      className={`${colorMap[type] ?? "bg-primary"} text-white text-[10px] font-black px-2.5  py-0.5  uppercase tracking-widest`}
    >
      {label}
    </span>
  );
}

function PillarBadge({ pillar }: { pillar: string }) {
  const label = PILLAR_LABELS[pillar];
  if (!label) return null;
  return (
    <Link
      href={`/pilares/${pillar.replace(/_/g, "-")}`}
      className="relative z-10 text-[10px] font-bold px-2 py-0.5  uppercase tracking-wider border border-primary/30 text-primary/70 hover:bg-primary/5 transition-colors"
    >
      {label}
    </Link>
  );
}

function RatingBadge({ rating }: { rating: number }) {
  const colorClass =
    rating >= 8
      ? "text-emerald-600 dark:text-emerald-400 border-emerald-400/30 bg-emerald-400/10"
      : rating >= 6
        ? "text-yellow-600 dark:text-yellow-400 border-yellow-400/30 bg-yellow-400/10"
        : "text-red-600 dark:text-red-400 border-red-400/30 bg-red-400/10";
  return (
    <div
      className={`flex items-center px-3 py-1.5  border gap-1.5 ${colorClass}`}
    >
      <span className="text-sm font-black leading-none">{rating}</span>
      <span className="text-xs opacity-60 font-bold">/ 10</span>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function AuthorBio({ bio }: { bio: string | any[] }) {
  if (!bio) return null;
  if (Array.isArray(bio)) {
    return (
      <div className="text-sm text-foreground/60 mt-1 leading-relaxed prose prose-sm max-w-none">
        <PortableText value={bio} components={simplePtComponents} />
      </div>
    );
  }
  return (
    <p className="text-sm text-foreground/60 mt-1 leading-relaxed">{bio}</p>
  );
}

function AuthorCard({ author }: { author: Author }) {
  return (
    <div className="flex items-start gap-4 mt-12 pt-8 border-t border-(--border)">
      {author.image && (
        <div className="shrink-0 w-14 h-14  overflow-hidden border-2 border-(--border) relative">
          <Image
            src={urlFor(author.image).width(112).height(112).fit("crop").url()}
            alt={author.name}
            fill
            sizes="56px"
            className="object-cover"
          />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase tracking-widest text-foreground/40 font-black mb-0.5">
          Análise por
        </p>
        <p className="font-black text-foreground text-base">{author.name}</p>
        {author.bio && <AuthorBio bio={author.bio} />}
      </div>
    </div>
  );
}

/**
 * VISÃO DO ANALISTA
 * Elemento diferenciador central do Vetor Estratégico — visual destacado e
 * separado claramente do corpo do artigo.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function AnalystView({ content }: { content: any[] }) {
  return (
    <aside className="mt-14 relative overflow-hidden  border border-primary/20">
      {/* Gradiente de fundo sutil */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/8 via-transparent to-transparent pointer-events-none" />

      {/* Header */}
      <div className="relative flex items-center gap-3 px-6 pt-6 pb-4 border-b border-primary/15">
        <div className="w-9 h-9  bg-primary/10 flex items-center justify-center shrink-0">
          {/* Ícone de mira/vetor */}
          <svg
            className="w-4 h-4 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <circle cx="12" cy="12" r="3" />
            <path strokeLinecap="round" d="M12 2v4M12 18v4M2 12h4M18 12h4" />
          </svg>
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">
            Vetor Estratégico
          </p>
          <h3 className="text-base font-black text-foreground leading-tight">
            Visão do Analista
          </h3>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="relative px-6 py-5 text-foreground/85 leading-relaxed">
        <PortableText value={content} components={simplePtComponents} />
      </div>

      {/* Rodapé decorativo */}
      <div className="relative px-6 pb-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-primary/10" />
        <span className="text-[10px] font-black text-primary/30 uppercase tracking-widest">
          Análise Estratégica
        </span>
        <div className="h-px flex-1 bg-primary/10" />
      </div>
    </aside>
  );
}

function AffiliateBlock({
  href,
  label,
  position,
}: {
  href: string;
  label?: string;
  position: "top" | "bottom";
}) {
  if (position === "top") {
    return (
      <a
        href={href}
        target="_blank"
        rel="nofollow noopener"
        className="mb-10 flex items-center justify-between bg-primary text-white p-4  hover:brightness-110 transition-all shadow-lg group"
      >
        <div>
          <p className="text-[10px] uppercase tracking-widest opacity-70 font-bold mb-0.5">
            Link verificado
          </p>
          <span className="font-black tracking-wide">
            {label ?? "Ver Preço Atualizado"}
          </span>
        </div>
        <svg
          className="w-5 h-5 group-hover:translate-x-1 transition-transform shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
      </a>
    );
  }

  return (
    <div className="mt-11 bg-primary/5 border border-primary/20 p-6  text-center">
      <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">
        Onde Adquirir
      </p>
      <p className="text-sm text-foreground/60 mb-4 italic">
        Links verificados e atualizados
      </p>
      <a
        href={href}
        target="_blank"
        rel="nofollow noopener"
        className="block w-full bg-primary text-white font-bold py-3  hover:scale-[1.02] transition-transform"
      >
        {label ?? "Ver Ofertas"}
      </a>
    </div>
  );
}

function VereditorBlock({ veredito }: { veredito: Veredito }) {
  if (!veredito.buyIf && !veredito.avoidIf) return null;
  return (
    <div className="mt-12">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-px flex-1 bg-border" />
        <p className="text-xs font-black uppercase tracking-widest text-foreground/35">
          Veredito Final
        </p>
        <div className="h-px flex-1 bg-border" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {veredito.buyIf && (
          <div className="p-5 bg-emerald-500/5  border border-emerald-500/15">
            <h4 className="text-emerald-600 font-black uppercase text-xs mb-3 flex items-center gap-2 tracking-wider">
              ✓ Vale se...
            </h4>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {veredito.buyIf}
            </p>
          </div>
        )}
        {veredito.avoidIf && (
          <div className="p-5 bg-red-500/5  border border-red-500/15">
            <h4 className="text-red-600 font-black uppercase text-xs mb-3 flex items-center gap-2 tracking-wider">
              ✕ Evite se...
            </h4>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {veredito.avoidIf}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function FaqSection({ faq }: { faq: FaqItem[] }) {
  const valid = faq.filter((i) => i.question && i.answer);
  if (!valid.length) return null;
  return (
    <div className="mt-14">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-1 h-6 bg-primary " />
        <h3 className="text-xl font-black text-foreground">
          Perguntas Frequentes
        </h3>
      </div>
      <div className="space-y-2">
        {valid.map((item, idx) => (
          <details
            key={idx}
            className="group border border-(--border)  overflow-hidden bg-(--card-bg)"
          >
            <summary className="list-none p-4 font-bold cursor-pointer flex justify-between items-center gap-4 group-open:bg-primary/8 group-open:text-primary transition-all select-none text-sm">
              <span>{item.question}</span>
              <svg
                className="w-4 h-4 shrink-0 group-open:rotate-180 transition-transform text-primary/40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </summary>
            <div className="px-4 py-4 text-foreground/70 text-sm leading-relaxed border-t border-(--border)">
              {item.answer}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

/** Card de cluster proeminente — série editorial */
function ClusterCard({ cluster }: { cluster: Cluster }) {
  return (
    <div className="mt-12 p-6  border border-primary/20 bg-linear-to-br from-primary/5 to-transparent">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 mb-1">
            Série de Análises
          </p>
          <h4 className="font-black text-foreground text-base leading-tight">
            {cluster.title}
          </h4>
          {cluster.description && (
            <p className="text-sm text-foreground/60 mt-2 leading-relaxed">
              {cluster.description}
            </p>
          )}
        </div>
        <div className="shrink-0 w-10 h-10  bg-primary/10 flex items-center justify-center">
          <svg
            className="w-5 h-5 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
      </div>
      <Link
        href={`/clusters/${cluster.slug}`}
        className="inline-flex items-center gap-1.5 mt-4 text-xs font-black text-primary hover:gap-3 transition-all uppercase tracking-wider group"
      >
        Ver todos os artigos da série
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
      </Link>
    </div>
  );
}

// ---------------------------------------------------------------------------
// PAGE
// ---------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) return {};

  const ogImage = post.imagem || "https://vetorestrategico.com/og-image.png";
  const newsKeywords =
    post.categories?.map((c) => c.title).join(", ") ||
    "tecnologia, defesa, infraestrutura";

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    keywords:
      `${newsKeywords}, análise estratégica, ${post.pillar ? PILLAR_LABELS[post.pillar] : ""}`
        .split(", ")
        .filter(Boolean),

    alternates: {
      canonical: `https://vetorestrategico.com/post/${post.slug}`,
    },

    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      type: "article",
      url: `https://vetorestrategico.com/post/${post.slug}`,
      publishedTime: post.publishedAt,
      modifiedTime: post.publishedAt,
      authors: [post.author?.name || "Vetor Estratégico"],
      tags: post.categories?.map((c) => c.title) || [],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 675,
          alt: post.imagemAlt || post.title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      images: [ogImage],
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const relatedPosts = await getRelatedPosts(post.categories ?? [], slug);
  const isReview = REVIEW_TYPES.has(post.editorialType ?? "");
  const readTime = estimateReadTime(post.body);
  const pillarLabel = post.pillar ? PILLAR_LABELS[post.pillar] : null;

  const newsKeywords =
    post.categories?.map((c) => c.title).join(", ") ||
    "tecnologia, defesa, infraestrutura";

  const articleJsonLd = generateNewsArticleSchema({
    title: post.title,
    description: post.seoDescription || post.excerpt || post.title,
    image: post.imagem || "https://vetorestrategico.com/og-image.png",
    url: `https://vetorestrategico.com/post/${post.slug}`,
    publishedAt: post.publishedAt,
    keywords: newsKeywords,
    authorName: post.author?.name,
    articleSection: post.pillar ? PILLAR_LABELS[post.pillar] : undefined,
    slug: post.slug,
  });

  return (
    <>
      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <div className="max-w-10xl mx-auto px-1 py-1 sm:px-6 lg:px-2">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* ================================================================ */}
          {/* MAIN                                                             */}
          {/* ================================================================ */}
          <main className="w-full lg:w-2/3">
            <div className="mb-6">
              <PressaoBrasil />
            </div>
            {/* PRIMEIRO CARD: Cabeçalho e Corpo do Texto */}
            <article className="bg-(--card-bg)  p-2 sm:p-4 shadow-sm">
              {/* BADGES */}
              <div className="mb-5 flex flex-wrap items-center gap-2">
                {post.editorialType && (
                  <EditorialBadge type={post.editorialType} />
                )}

                {post.pillar && <PillarBadge pillar={post.pillar} />}

                {/* Link rápido para o cluster no topo */}
                {post.cluster && post.cluster.slug && (
                  <Link
                    href={`/clusters/${post.cluster.slug}`}
                    className="ml-auto text-[10px] font-bold px-2.5 py-0.5  uppercase tracking-wider bg-primary/8 text-primary/70 hover:bg-primary/15 border border-primary/20 transition-all"
                  >
                    Série: {post.cluster.title}
                  </Link>
                )}

                {post.categories?.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/categorias/${cat.slug}`}
                    className="text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider border border-primary/20 text-primary/60 hover:bg-primary/5 transition-colors"
                  >
                    {cat.title}
                  </Link>
                ))}
              </div>

              {/* TÍTULO */}
              <h1 className="text-3xl sm:text-[2.6rem] font-black tracking-tight mb-4 leading-[1.1] text-foreground">
                {post.title}
              </h1>

              {/* EXCERPT / SUBTÍTULO CONTEXTUAL */}
              {post.excerpt && (
                <p className="text-lg sm:text-xl text-foreground/55 mb-7 leading-relaxed font-medium">
                  {post.excerpt}
                </p>
              )}

              {/* META: autor + data + tempo de leitura + rating (só reviews) */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-foreground/55 mb-8 pb-8 border-b border-(--border)">
                {/* Autor */}
                <div className="flex items-center gap-2.5">
                  {post.author?.image && (
                    <div className="w-8 h-8  overflow-hidden border border-(--border) relative shrink-0">
                      <Image
                        src={urlFor(post.author.image)
                          .width(64)
                          .height(64)
                          .fit("crop")
                          .url()}
                        alt={post.author.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <span className="font-bold text-foreground/80">
                    {post.author?.name ?? "Redação Vetor"}
                  </span>
                </div>

                <span className="hidden sm:block text-foreground/15">|</span>

                {/* Data */}
                <time className="tabular-nums">
                  {new Date(post.publishedAt).toLocaleDateString("pt-BR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </time>

                <span className="hidden sm:block text-foreground/15">|</span>

                {/* Tempo de leitura estimado */}
                <span className="flex items-center gap-1.5">
                  <svg
                    className="w-3.5 h-3.5 text-foreground/30"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  {readTime} min de leitura
                </span>

                {/* Rating — só reviews */}
                {isReview && post.rating != null && (
                  <div className="ml-auto">
                    <RatingBadge rating={post.rating} />
                  </div>
                )}
              </div>

              {/* IMAGEM PRINCIPAL */}
              {post.imagem && (
                <div className="mb-10 relative aspect-video  overflow-hidden shadow-xl">
                  <Image
                    src={post.imagem}
                    alt={post.imagemAlt || post.title}
                    fill
                    priority
                    placeholder={post.imagemLqip ? "blur" : "empty"}
                    blurDataURL={post.imagemLqip}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                    className="object-cover"
                  />
                </div>
              )}

              {/* AFILIADO TOPO — só reviews/comparativos */}
              {isReview && post.affiliateLink && (
                <AffiliateBlock
                  href={post.affiliateLink}
                  label={post.affiliateLabel}
                  position="top"
                />
              )}

              {/* SPOTIFY */}
              {post.spotifyEmbed && (
                <div
                  className="mb-10 overflow-hidden"
                  dangerouslySetInnerHTML={{
                    __html: post.spotifyEmbed.replace(
                      "allowfullscreen",
                      'allow="fullscreen; encrypted-media"',
                    ),
                  }}
                />
              )}

              {/* CORPO DO ARTIGO */}
              <div className="prose prose-lg max-w-none prose-headings:font-black prose-a:text-primary">
                {post.contentHtml ? (
                  <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
                ) : (
                  <PortableText
                    value={post.body ?? []}
                    components={ptComponents}
                  />
                )}
              </div>
            </article>{" "}
            {/* FECHA O PRIMEIRO CARD */}
            {/* ================================================================ */}
            {/* SESSÃO PARALAX FIXA NO RODAPÉ DO ARTIGO                          */}
            {/* ================================================================ */}
            <div className="w-full py-24 my-6 flex flex-col items-center justify-center text-center px-4 relative bg-transparent">
              <h3 className="text-2xl sm:text-3xl font-black text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] mb-6 max-w-2xl leading-tight">
                Mantenha-se atualizado com os desdobramentos que definem o
                futuro e a soberania do Brasil.
              </h3>

              <Link
                href="/radar"
                className="bg-primary hover:bg-blue-500 text-white font-black py-4 px-10 border border-primary/50 shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] transition-all uppercase tracking-[0.2em] text-xs"
              >
                LER ÚLTIMAS NOTÍCIAS
              </Link>
            </div>
            {/* ================================================================ */}
            {/* SEGUNDO CARD: Conteúdo Extra (Analyst View, Autor, etc) */}
            {/* ================================================================ */}
            <article className="bg-(--card-bg) p-2 sm:p-2 border border-(--border) shadow-sm">
              {/* VISÃO DO ANALISTA — elemento central do branding */}
              {post.analystView && post.analystView.length > 0 && (
                <AnalystView content={post.analystView} />
              )}

              {/* VEREDITO — só reviews/comparativos */}
              {isReview && post.veredito && (
                <VereditorBlock veredito={post.veredito} />
              )}

              {/* AFILIADO RODAPÉ — só reviews/comparativos */}
              {isReview && post.affiliateLink && (
                <AffiliateBlock
                  href={post.affiliateLink}
                  label={post.affiliateLabel}
                  position="bottom"
                />
              )}

              {/* FAQ */}
              {post.faq && post.faq.length > 0 && <FaqSection faq={post.faq} />}

              {/* CLUSTER — card proeminente */}
              {post.cluster && <ClusterCard cluster={post.cluster} />}

              {/* AUTOR */}
              {post.author && <AuthorCard author={post.author} />}

              {/* LEAD CAPTURE */}
              <div className="mt-10">
                <LeadCapture />
              </div>
            </article>{" "}
            {/* FECHA O SEGUNDO CARD */}
            {/* COMENTÁRIOS */}
            <div className="mt-10">
              <Comments />
            </div>
          </main>

          {/* ================================================================ */}
          {/* SIDEBAR                                                           */}
          {/* ================================================================ */}
          <aside className="w-full lg:w-1/3 lg:sticky lg:top-22 self-start space-y-4">
            {/* Pilar editorial na sidebar */}
            {pillarLabel && post.pillar && (
              <Link
                href={`/pilares/${post.pillar}`}
                className="block bg-(--card-bg)  border border-(--border) p-4 shadow-sm hover:border-primary/30 transition-colors group"
              >
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/35 mb-1 group-hover:text-primary/60 transition-colors">
                  Pilar Editorial
                </p>
                <p className="font-bold text-foreground/80 text-sm group-hover:text-primary transition-colors">
                  {pillarLabel}
                </p>
                <p className="text-[10px] text-foreground/40 mt-1">
                  Tecnologia. Poder. Direção.
                </p>
              </Link>
            )}

            <div className="bg-(--card-bg)  border border-(--border) overflow-hidden shadow-sm">
              <AdComponent />
            </div>

            <div className="bg-(--card-bg)  border border-(--border) p-4 shadow-sm hidden lg:block">
              <SecondAdComponent />
            </div>
          </aside>
        </div>

        {/* LEIA TAMBÉM */}
        <div className="mt-16">
          <ReadNext posts={relatedPosts} />
        </div>
      </div>
    </>
  );
}
