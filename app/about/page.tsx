import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre o Vetor Estratégico | Tecnologia, Poder e Direção",
  description:
    "O Vetor Estratégico é um portal brasileiro de análise sobre tecnologia, defesa, infraestrutura e poder global. Contexto, dados e impacto real para o Brasil.",
  keywords: [
    "geopolítica tecnológica",
    "defesa e tecnologia militar",
    "infraestrutura crítica",
    "soberania digital",
    "economia estratégica",
    "Brasil estratégico",
    "análise de poder global"
  ],
  openGraph: {
    title: "Sobre o Vetor Estratégico",
    description:
      "Não analisamos o evento. Analisamos o vetor. Tecnologia, poder e impacto no Brasil.",
    type: "website",
  },
};

const pillars = [
  {
    group: "DEFESA & TECNOLOGIA",
    title: "Capacidade Militar Real",
    desc: "Drones, guerra eletrônica, sistemas de mísseis, IA aplicada e orçamentos — analisados além da propaganda."
  },
  {
    group: "INFRAESTRUTURA & SOBERANIA",
    title: "Infraestrutura Invisível",
    desc: "Semicondutores, energia, cabos submarinos e telecomunicações como instrumentos de poder."
  },
  {
    group: "ECONOMIA DE PODER",
    title: "Cadeias Globais & Sanções",
    desc: "BRICS, sanções, logística e política industrial sob a ótica estratégica."
  },
  {
    group: "BRASIL ESTRATÉGICO",
    title: "Base Industrial de Defesa",
    desc: "Capacidade nacional, orçamento militar e posicionamento geopolítico do Brasil."
  },
  {
    group: "BRASIL ESTRATÉGICO",
    title: "Dependência Tecnológica",
    desc: "Riscos estruturais, vulnerabilidades digitais e exposição externa."
  },
  {
    group: "ANÁLISE APLICADA",
    title: "Impacto nos Próximos 2–3 Anos",
    desc: "Cada artigo projeta cenários futuros e riscos calculados."
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <header className="mb-16 border-b border-(--border) pb-8">
          <span className="text-secondary font-bold tracking-widest text-xs uppercase mb-2 block font-mono">
            VetorEstratégico.System
          </span>

          <h1 className="text-4xl md:text-6xl font-black text-zinc-900 tracking-tight">
            Não analisamos o evento. <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-700 via-indigo-600 to-red-600">
              Analisamos o vetor.
            </span>
          </h1>

          <p className="mt-6 text-lg text-zinc-600 max-w-3xl leading-relaxed">
            O <strong>Vetor Estratégico</strong> é um portal brasileiro de análise
            sobre tecnologia, defesa, infraestrutura e poder global.
            Nosso foco não é a manchete.
            É a direção, a magnitude e o impacto sistêmico —
            especialmente para o Brasil.
          </p>
        </header>

        {/* MISSÃO */}
        <section className="mb-20 grid md:grid-cols-12 gap-12 items-start">

          <div className="md:col-span-7 space-y-6 text-zinc-800 leading-relaxed text-lg">
            <p>
              Tecnologia deixou de ser ferramenta. Tornou-se instrumento de poder.
            </p>

            <p>
              Chips definem cadeias produtivas.
              Cabos submarinos sustentam economias.
              Energia determina soberania.
            </p>

            <p>
              Publicamos análises estruturadas em quatro camadas:
            </p>

            <ul className="list-disc pl-6 space-y-2">
              <li>Fato</li>
              <li>Contexto histórico</li>
              <li>Impacto sistêmico</li>
              <li>Projeção futura (2–3 anos)</li>
            </ul>

            <p>
              Sem sensacionalismo. Sem militância. Sem ruído.
            </p>
          </div>

          {/* VISÃO DO ANALISTA */}
          <div className="md:col-span-5 relative group">
            <div className="absolute -inset-1 bg-linear-to-r from-blue-700 to-red-600  blur opacity-25"></div>
            <div className="relative bg-zinc-900 p-6 border border-zinc-800 shadow-2xl">
              <h3 className="text-white font-bold text-lg mb-4">
                Visão do Analista™
              </h3>

              <p className="text-zinc-400 text-sm leading-relaxed">
                Um evento isolado é ruído.
                Uma sequência revela estratégia.
              </p>

              <p className="text-zinc-400 text-sm mt-4 leading-relaxed">
                Avaliamos capacidade real, dependências críticas,
                incentivos econômicos e riscos estruturais —
                antes que eles se tornem crise.
              </p>
            </div>
          </div>
        </section>

        {/* PILARES */}
        <section>
          <h2 className="text-3xl font-bold text-zinc-900 mb-8">
            Pilares do Vetor Estratégico
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pillars.map((pillar, index) => (
              <div
                key={index}
                className="p-6 bg-(--card-bg) border border-(--border) hover:border-blue-600 transition-all duration-300"
              >
                <span className="text-xs font-mono text-red-500">
                  {pillar.group}
                </span>
                <h3 className="text-lg font-bold mt-2 mb-2">
                  {pillar.title}
                </h3>
                <p className="text-sm text-zinc-600">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* DIFERENCIAL */}
        <section className="mt-20 text-center border-t border-(--border) pt-12">
          <h2 className="text-2xl font-bold mb-4">
            Tecnologia. Poder. Direção.
          </h2>

          <p className="text-zinc-600 max-w-2xl mx-auto">
            Enquanto muitos discutem o que aconteceu,
            analisamos o que pode acontecer.
            Nosso compromisso é clareza estratégica para quem
            precisa entender o jogo — e não apenas acompanhar a manchete.
          </p>

          <p className="mt-6 font-medium">
            Publicamos contexto. Não ruído.
          </p>
        </section>

      </div>
    </div>
  );
}