import Link from "next/link";
import Image from "next/image";
import { client } from "@/app/lib/sanity";

// ---------------------------------------------------------------------------
// FRENTES ESTRATÉGICAS
// Arquitetura editorial com identidade militar + clareza UX
// ---------------------------------------------------------------------------

async function getPillarCount(pillar: string): Promise<number> {
  return await client.fetch(
    `count(*[_type == "post" && pillar->slug.current == $pillar && !(_id in path('drafts.**'))])`,
    { pillar },
    { next: { revalidate: 300 } }
  );
}

const PILLARS = [
  {
    slug:        "geopolitica-e-defesa",
    pillar:      "geopolitica-e-defesa",
    title:       "Geopolítica",
    titleLine2:  "& Defesa",
    tagline:     "O xadrez global",
    description: "Tensões de bastidores, diplomacia de poder, corrida por hegemonia e o impacto real na economia e na soberania.",
    image:       "/geopolitica.webp",
    accent:      "#1f3a5f",
    accentLight: "#3d5a8c",
    index:       "01",
    href:        "/pilares/geopolitica-e-defesa",
  },
  {
    slug:        "arsenal-e-tecnologia",
    pillar:      "arsenal-e-tecnologia",
    title:       "Arsenal",
    titleLine2:  "& Tecnologia",
    tagline:     "Engenharia de guerra",
    description: "Raio-x visceral de caças, blindados, drones, IA militar e os chips que decidem quem domina o espaço aéreo.",
    image:       "/arsenal.webp",
    accent:      "#c8a84b",
    accentLight: "#e4c97e",
    index:       "02",
    href:        "/pilares/arsenal-e-tecnologia",
  },
  {
    slug:        "teatro-de-operacoes",
    pillar:      "teatro-de-operacoes",
    title:       "Teatro de",
    titleLine2:  "Operações",
    tagline:     "Campo de batalha",
    description: "Logística implacável, táticas de cerco e paralelos entre conflitos históricos e os teatros modernos.",
    image:       "/teatro.webp",
    accent:      "#c0392b",
    accentLight: "#e74c3c",
    index:       "03",
    href:        "/pilares/teatro-de-operacoes",
  },
  {
    slug:        "manual-de-sobrevivencia",
    pillar:      "manual-de-sobrevivencia",
    title:       "Manual de",
    titleLine2:  "Sobrevivência",
    tagline:     "Resiliência extrema",
    description: "Protocolos críticos, sobrevivência urbana e rural, e adaptação em cenários de colapso.",
    image:       "/sobrevivencia.webp",
    accent:      "#27ae60",
    accentLight: "#2ecc71",
    index:       "04",
    href:        "/pilares/manual-de-sobrevivencia",
  },
  {
    slug:        "carreiras-estrategicas",
    pillar:      "carreiras-estrategicas",
    title:       "Carreiras",
    titleLine2:  "Estratégicas",
    tagline:     "Ascensão profissional",
    description: "Concursos, formação tática, planejamento de carreira e caminhos para atuar no núcleo do poder.",
    image:       "/carreiras.webp",
    accent:      "#8e44ad",
    accentLight: "#9b59b6",
    index:       "05",
    href:        "/pilares/carreiras-estrategicas",
  },
];

export default async function EditorialPillars() {
  const counts = await Promise.all(
    PILLARS.map((p) => getPillarCount(p.pillar))
  );

  return (
    <section className="my-16">
      {/* HEADER */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-[12px] font-black uppercase tracking-[0.35em] text-zinc-600 mb-1">
            Arquitetura Editorial
          </p>

          <h2
            className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-700 uppercase leading-none"
            style={{ fontFamily: "var(--font-bebas-neue, sans-serif)" }}
          >
            Frentes Estratégicas
          </h2>
        </div>

        <Link
          href="/pilares"
          className="hidden sm:flex items-center gap-2 text-[12px] font-black uppercase tracking-widest text-zinc-600 hover:text-zinc-900 transition-colors group"
        >
          Ver todas
          <svg
            className="w-3 h-3 group-hover:translate-x-0.5 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-0 border border-zinc-800">
        {PILLARS.map((pillar, i) => (
          <Link
            key={pillar.slug}
            href={pillar.href}
            className="group relative flex flex-col overflow-hidden min-h-96 border-b md:border-b-0 md:border-r border-zinc-800 last:border-0"
          >
            {/* BG */}
            <div className="absolute inset-0 z-0">
              <Image
                src={pillar.image}
                alt={pillar.title}
                fill
                sizes="(max-width: 768px) 100vw, 20vw"
                priority={i === 0}
                className="object-cover opacity-50 grayscale group-hover:opacity-75 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#0a0b0d] via-[#0a0b0d]/60 to-[#0a0b0d]/10" />
            </div>

            {/* INDEX */}
            <div className="relative z-10 flex justify-end p-5">
              <span
                className="text-6xl font-black opacity-20"
                style={{ color: pillar.accent }}
              >
                {pillar.index}
              </span>
            </div>

            {/* CONTENT */}
            <div className="relative z-10 mt-auto p-6">
              <p
                className="text-[12px] font-black uppercase tracking-[0.25em] mb-2"
                style={{ color: pillar.accentLight }}
              >
                {pillar.tagline}
              </p>

              <h3 className="text-2xl font-black text-white uppercase mb-2">
                {pillar.title} <br />
                <span style={{ color: pillar.accentLight }}>
                  {pillar.titleLine2}
                </span>
              </h3>

              <p className="text-sm text-zinc-400 mb-4 line-clamp-2">
                {pillar.description}
              </p>

              <div className="flex justify-between items-center text-xs">
                <span style={{ color: pillar.accentLight }}>
                  {counts[i]} artigos
                </span>

                <span className="uppercase tracking-widest text-zinc-400 group-hover:text-white">
                  Explorar →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}