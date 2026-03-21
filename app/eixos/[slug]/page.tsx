import { notFound } from "next/navigation";
import { type Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import EixoPostsList from "./Eixopostlist";
import { fetchEixoPosts, countEixoPosts } from "./Actions";

// ---------------------------------------------------------------------------
// EIXO METADATA — single source of truth for hero content
// ---------------------------------------------------------------------------
const EIXOS_META: Record<
  string,
  {
    title: string;
    pillar: string;         // matches Sanity `pillar` field value
    image: string;
    description: string;
    longDescription: string;
    icon: React.ReactNode;
  }
> = {
  "geopolitica-defesa": {
    title: "Geopolítica & Defesa",
    pillar: "geopolitica_defesa",
    image: "/geopolitica.webp",
    description: "O xadrez global. Tensões de bastidores, diplomacia de poder, corrida por hegemonia e o impacto na economia mundial.",
    longDescription: "Análises profundas sobre o tabuleiro geopolítico: movimentos de potências, acordos de bastidores, disputas por hegemonia tecnológica e os impactos reais no Brasil e no mundo.",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  "arsenal-tecnologia": {
    title: "Arsenal & Tecnologia",
    pillar: "arsenal_tecnologia",
    image: "/arsenal.webp",
    description: "Raio-x visceral da engenharia militar. Caças, blindados, inteligência artificial e o hardware que desequilibra o poder.",
    longDescription: "Dissecando a máquina de guerra moderna: especificações técnicas de caças de 5ª e 6ª geração, blindados, drones autônomos, IA militar e os chips que decidem quem domina o espaço aéreo.",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
  },
  "teatro-operacoes": {
    title: "Teatro de Operações",
    pillar: "teatro_operacoes",
    image: "/teatro.webp",
    description: "Logística implacável e cerco de combate. A realidade crua do campo de batalha e como a tática é aplicada na prática.",
    longDescription: "Da logística de bombardeiros da Segunda Guerra aos enxames de drones modernos: análises táticas de conflitos passados e presentes, doutrinas de combate e a brutalidade real do teatro de operações.",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
  },
};

// The other two sibling eixos (for the "Explore também" section)
function getSiblings(currentSlug: string) {
  return Object.entries(EIXOS_META)
    .filter(([slug]) => slug !== currentSlug)
    .map(([slug, meta]) => ({ slug, ...meta }));
}

// ---------------------------------------------------------------------------
// METADATA
// ---------------------------------------------------------------------------
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const eixo = EIXOS_META[slug];
  if (!eixo) return {};

  return {
    title: `${eixo.title} | Vetor Estratégico`,
    description: eixo.longDescription,
    openGraph: {
      title: `${eixo.title} | Vetor Estratégico`,
      description: eixo.longDescription,
      images: [`https://vetorestrategico.com${eixo.image}`],
    },
  };
}

export function generateStaticParams() {
  return Object.keys(EIXOS_META).map((slug) => ({ slug }));
}

// ---------------------------------------------------------------------------
// PAGE
// ---------------------------------------------------------------------------
export default async function EixoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const eixo = EIXOS_META[slug];
  if (!eixo) notFound();

  const siblings = getSiblings(slug);

  // Fetch initial 10 posts + total count in parallel
  const [initialPosts, totalCount] = await Promise.all([
    fetchEixoPosts(eixo.pillar, 0, 10),
    countEixoPosts(eixo.pillar),
  ]);

  return (
    <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">

      {/* ================================================================
          HERO — full-bleed image with overlay, identical treatment to
          the eixo cards on /eixos but taller and with more content
      ================================================================ */}
      <section className="relative w-full min-h-80 sm:min-h-96 flex flex-col justify-end overflow-hidden mb-12 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">

        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={eixo.image}
            alt={`Imagem do eixo ${eixo.title}`}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-70 grayscale"
          />
          {/* Multi-stop gradient: image visible at top, solid at bottom */}
          <div className="absolute inset-0 bg-linear-to-t from-[#0a0b0d] via-[#0a0b0d]/55 to-transparent" />
          {/* Subtle side vignette */}
          <div className="absolute inset-0 bg-linear-to-r from-[#0a0b0d]/60 via-transparent to-[#0a0b0d]/60" />
        </div>

        {/* Breadcrumb */}
        <div className="relative z-10 pt-16 pb-1">
          <nav className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.25em] text-zinc-500 mb-6">
            <Link href="/" className="hover:text-primary transition-colors">Início</Link>
            <span>/</span>
            <Link href="/eixos" className="hover:text-primary transition-colors">Eixos</Link>
            <span>/</span>
            <span className="text-primary/70">{eixo.title}</span>
          </nav>

          {/* Icon + label */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 flex items-center justify-center bg-black/60 backdrop-blur-sm border border-[#2a2f3a] text-primary shadow-inner">
              {eixo.icon}
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary/60">
              Eixo Estratégico
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-zinc-100 uppercase leading-none mb-4 drop-shadow-lg">
            {eixo.title}
          </h1>

          {/* Description */}
          <p className="max-w-2xl text-base sm:text-lg text-zinc-300 leading-relaxed mb-6 drop-shadow-md">
            {eixo.longDescription}
          </p>

          {/* Stats bar */}
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2 pb-8 border-b border-zinc-800/60">
            <div className="flex flex-col">
              <span className="text-2xl font-black tabular-nums text-zinc-100 leading-none">
                {totalCount}
              </span>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 mt-0.5">
                Publicações
              </span>
            </div>
            <div className="w-px h-8 bg-zinc-700" />
            <div className="flex flex-col">
              <span className="text-2xl font-black tabular-nums text-zinc-100 leading-none">
                3
              </span>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 mt-0.5">
                Eixos Ativos
              </span>
            </div>
            <div className="w-px h-8 bg-zinc-700" />
            <Link
              href="/radar"
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/70 transition-colors"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              Radar em tempo real
            </Link>
          </div>
        </div>

        {/* Tactical corner marks */}
        <div className="absolute top-3 left-3 sm:left-5 w-3 h-3 border-t-2 border-l-2 border-zinc-600/50 z-20 pointer-events-none" />
        <div className="absolute top-3 right-3 sm:right-5 w-3 h-3 border-t-2 border-r-2 border-zinc-600/50 z-20 pointer-events-none" />
      </section>

      {/* ================================================================
          POSTS LIST — client component handles load more
      ================================================================ */}
      <section className="mb-16">
        <EixoPostsList
          initialPosts={initialPosts}
          pillar={eixo.pillar}
          totalCount={totalCount}
        />
      </section>

      {/* ================================================================
          EXPLORE OUTROS EIXOS
      ================================================================ */}
      <section>
        <div className="mb-6 border-l-4 border-zinc-700 pl-4">
          <p className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-500 mb-0.5">
            Navegação Tática
          </p>
          <h2 className="text-xl font-black tracking-tight text-(--foreground) uppercase">
            Explorar Outros Eixos
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {siblings.map((s) => (
            <Link
              key={s.slug}
              href={`/eixos/${s.slug}`}
              className="group relative flex flex-col overflow-hidden min-h-40 border border-[#2a2f3a] hover:border-primary/40 transition-all"
            >
              <div className="absolute inset-0 z-0">
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover opacity-30 grayscale group-hover:opacity-50 group-hover:grayscale-0 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#0a0b0d] via-[#0a0b0d]/70 to-transparent" />
              </div>

              <div className="relative z-10 flex flex-col justify-end h-full p-5">
                <h3 className="text-base font-black text-zinc-100 uppercase tracking-wide mb-1 group-hover:text-primary transition-colors drop-shadow-md">
                  {s.title}
                </h3>
                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed drop-shadow-md">
                  {s.description}
                </p>
                <div className="flex items-center gap-1.5 mt-4 text-[9px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-primary transition-colors">
                  Acessar dossiês
                  <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>

              <div className="absolute top-1.5 left-1.5 w-2 h-2 border-t border-l border-zinc-600/40 group-hover:border-primary/60 transition-colors z-20 pointer-events-none" />
              <div className="absolute bottom-1.5 right-1.5 w-2 h-2 border-b border-r border-zinc-600/40 group-hover:border-primary/60 transition-colors z-20 pointer-events-none" />
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}