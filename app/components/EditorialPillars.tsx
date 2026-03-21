import Link from "next/link";
import Image from "next/image";
import { client } from "@/app/lib/sanity";

// ---------------------------------------------------------------------------
// EDITORIAL PILLARS
// Três blocos editoriais de alto impacto visual com imagem de fundo,
// contagem de artigos em tempo real e hover cinematográfico.
// ---------------------------------------------------------------------------

async function getPillarCount(pillar: string): Promise<number> {
  return await client.fetch(
    `count(*[_type == "post" && pillar == $pillar && !(_id in path('drafts.**'))])`,
    { pillar },
    { next: { revalidate: 300 } }
  );
}

const PILLARS = [
  {
    slug:        "geopolitica-defesa",
    pillar:      "geopolitica_defesa",
    title:       "Geopolítica",
    titleLine2:  "& Defesa",
    tagline:     "O xadrez global",
    description: "Tensões de bastidores, diplomacia de poder, corrida por hegemonia e o impacto real na economia e na soberania.",
    image:       "/geopolitica.webp",
    accent:      "#1f3a5f",
    accentLight: "#3d5a8c",
    index:       "01",
  },
  {
    slug:        "arsenal-tecnologia",
    pillar:      "arsenal_tecnologia",
    title:       "Arsenal",
    titleLine2:  "& Tecnologia",
    tagline:     "Engenharia de guerra",
    description: "Raio-x visceral de caças, blindados, drones, IA militar e os chips que decidem quem domina o espaço aéreo.",
    image:       "/arsenal.webp",
    accent:      "#c8a84b",
    accentLight: "#e4c97e",
    index:       "02",
  },
  {
    slug:        "teatro-operacoes",
    pillar:      "teatro_operacoes",
    title:       "Teatro de",
    titleLine2:  "Operações",
    tagline:     "Campo de batalha",
    description: "Logística implacável, táticas de cerco e paralelos entre conflitos históricos e os teatros modernos.",
    image:       "/teatro.webp",
    accent:      "#c0392b",
    accentLight: "#e74c3c",
    index:       "03",
  },
];

export default async function EditorialPillars() {
  const counts = await Promise.all(
    PILLARS.map((p) => getPillarCount(p.pillar))
  );

  return (
    <section className="my-16">
      {/* Section header */}
      <div className="flex items-end justify-between mb-6">
        <div className="flex items-end gap-4">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.35em] text-zinc-600 mb-1">
              Arquitetura Editorial
            </p>
            <h2
              className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-600 uppercase leading-none"
              style={{ fontFamily: "var(--font-bebas-neue, sans-serif)" }}
            >
              Eixos Estratégicos
            </h2>
          </div>
        </div>
        <Link
          href="/eixos"
          className="hidden sm:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-zinc-300 transition-colors group"
        >
          Ver todos
          <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-zinc-800">
        {PILLARS.map((pillar, i) => (
          <Link
            key={pillar.slug}
            href={`/eixos/${pillar.slug}`}
            className="group relative flex flex-col overflow-hidden min-h-96 border-b md:border-b-0 md:border-r border-zinc-800 last:border-0"
          >
            {/* Background image */}
            <div className="absolute inset-0 z-0">
              <Image
                src={pillar.image}
                alt={pillar.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                priority={i === 0}
                className="object-cover opacity-50 grayscale group-hover:opacity-75 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
              />
              {/* Gradient */}
              <div className="absolute inset-0 bg-linear-to-t from-[#0a0b0d] via-[#0a0b0d]/60 to-[#0a0b0d]/10" />
              {/* Colored vignette on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700"
                style={{
                  background: `radial-gradient(ellipse at 50% 100%, ${pillar.accent}, transparent 70%)`,
                }}
              />
            </div>

            {/* Index number — top right */}
            <div className="relative z-10 flex justify-end p-5">
              <span
                className="text-6xl font-black tabular-nums leading-none"
                style={{
                  color: pillar.accent,
                  opacity: 0.15,
                  fontFamily: "var(--font-bebas-neue, sans-serif)",
                  transition: "opacity 0.5s",
                }}
              >
                {pillar.index}
              </span>
            </div>

            {/* Content — pinned to bottom */}
            <div className="relative z-10 mt-auto p-6 sm:p-7">
              {/* Tagline */}
              <p
                className="text-[10px] font-black uppercase tracking-[0.25em] mb-3 transition-colors"
                style={{ color: pillar.accentLight }}
              >
                {pillar.tagline}
              </p>

              {/* Title */}
              <h3
                className="text-3xl sm:text-4xl font-black text-zinc-100 uppercase leading-tight mb-3 group-hover:text-white transition-colors drop-shadow-lg"
                style={{ fontFamily: "var(--font-bebas-neue, sans-serif)", letterSpacing: "-0.01em" }}
              >
                {pillar.title}
                <br />
                <span style={{ color: pillar.accentLight }}>{pillar.titleLine2}</span>
              </h3>

              {/* Description */}
              <p className="text-sm text-zinc-400 group-hover:text-zinc-300 leading-relaxed transition-colors mb-5 line-clamp-2">
                {pillar.description}
              </p>

              {/* Footer: count + CTA */}
              <div
                className="flex items-center justify-between pt-4 border-t"
                style={{ borderColor: `${pillar.accent}30` }}
              >
                <div className="flex flex-col">
                  <span
                    className="text-2xl font-black tabular-nums leading-none"
                    style={{
                      color: pillar.accentLight,
                      fontFamily: "var(--font-bebas-neue, sans-serif)",
                    }}
                  >
                    {counts[i]}
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">
                    Publicações
                  </span>
                </div>

                <div
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all group-hover:gap-3"
                  style={{ color: pillar.accentLight }}
                >
                  Acessar Dossiês
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Tactical corner marks */}
            <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t-2 border-l-2 border-zinc-700 group-hover:border-zinc-400 transition-colors z-20 pointer-events-none" />
            <div className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b-2 border-r-2 border-zinc-700 group-hover:border-zinc-400 transition-colors z-20 pointer-events-none" />

            {/* Top accent line on hover */}
            <div
              className="absolute top-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-20"
              style={{ backgroundColor: pillar.accent }}
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
