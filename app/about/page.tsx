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
    group: "VULNERABILIDADE",
    title: "Dependência Tecnológica",
    desc: "Riscos estruturais, vulnerabilidades digitais e exposição externa em cenários de crise."
  },
  {
    group: "ANÁLISE APLICADA",
    title: "Impacto nos Próximos 2–3 Anos",
    desc: "Cada artigo projeta cenários futuros e riscos calculados para tomada de decisão."
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#05080b] relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8">
      
      {/* ── BACKGROUND TÁTICO ── */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-primary/5 via-[#05080b] to-[#05080b] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />

      <div className="max-w-5xl mx-auto relative z-10">

        {/* ── HEADER (MANIFESTO) ── */}
        <header className="mb-16 border-b border-[#2a2f3a] pb-12">
          <div className="flex items-center justify-between mb-8">
            <span className="text-primary font-black tracking-[0.3em] text-[12px] uppercase font-mono flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary animate-pulse"></span>
              VetorEstratégico.System
            </span>
            <span className="border border-zinc-700 bg-zinc-900/50 text-zinc-500 text-[12px] font-black uppercase tracking-widest px-2 py-0.5">
              Classificação: Público
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-zinc-100 tracking-tight leading-[1.1] uppercase mb-6">
            Não analisamos o evento. <br />
            Analisamos o <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-blue-500 to-red-600">Vetor.</span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 max-w-3xl leading-relaxed font-medium border-l-2 border-[#2a2f3a] pl-5">
            O <strong className="text-zinc-100">Vetor Estratégico</strong> é um portal brasileiro de análise técnica 
            sobre tecnologia, defesa, infraestrutura e poder global. 
            Nosso foco não é a manchete. É a direção, a magnitude e o impacto sistêmico — 
            especialmente para a soberania do Brasil.
          </p>
        </header>

        {/* ── MISSÃO E VISÃO DO ANALISTA ── */}
        <section className="mb-24 grid md:grid-cols-12 gap-12 lg:gap-16 items-start">

          <div className="md:col-span-7 space-y-6 text-zinc-300 leading-relaxed text-base md:text-lg">
            <p>
              A tecnologia deixou de ser uma ferramenta de conveniência. 
              <strong className="text-white"> Tornou-se o principal instrumento de poder do século XXI.</strong>
            </p>

            <p className="text-zinc-400">
              Chips definem cadeias produtivas. Cabos submarinos sustentam economias. 
              Infraestrutura energética determina quem dita as regras. O poder de fogo cinético 
              agora depende de processamento de dados em tempo real.
            </p>

            <p className="font-bold text-zinc-200 mt-8 mb-4">
              Decodificamos a realidade em quatro camadas operacionais:
            </p>

            <ul className="space-y-3 font-mono text-sm tracking-wide text-zinc-400">
              <li className="flex items-center gap-3">
                <span className="text-primary">01.</span> Fato e materialidade
              </li>
              <li className="flex items-center gap-3">
                <span className="text-primary">02.</span> Contexto histórico de poder
              </li>
              <li className="flex items-center gap-3">
                <span className="text-primary">03.</span> Impacto na cadeia sistêmica
              </li>
              <li className="flex items-center gap-3">
                <span className="text-primary">04.</span> Projeção de risco (2 a 3 anos)
              </li>
            </ul>

            <p className="mt-8 text-primary font-black uppercase tracking-widest text-sm">
              Sem sensacionalismo. Sem militância. Sem ruído.
            </p>
          </div>

          {/* Bloco Tático: Visão do Analista */}
          <div className="md:col-span-5 relative group">
            <div className="absolute -inset-0.5 bg-linear-to-br from-primary/30 to-red-600/30 blur-lg opacity-50 group-hover:opacity-100 transition duration-1000"></div>
            
            <div className="relative bg-[#0a0b0d] p-8 border border-[#2a2f3a] shadow-2xl h-full flex flex-col justify-center">
              
              <div className="flex items-center gap-3 mb-6 border-b border-[#2a2f3a] pb-4">
                <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <h3 className="text-zinc-100 font-black uppercase tracking-widest text-sm">
                  Visão do Analista™
                </h3>
              </div>

              {/* CORREÇÃO JSX: Aspas escapadas */}
              <blockquote className="text-xl font-bold text-white mb-6 leading-snug">
                &ldquo;Um evento isolado é apenas ruído. <br/>
                <span className="text-zinc-500">Uma sequência revela a estratégia.&rdquo;</span>
              </blockquote>

              <p className="text-zinc-400 text-sm leading-relaxed">
                Avaliamos capacidade militar real, dependências críticas nas cadeias de suprimento, 
                incentivos econômicos ocultos e riscos estruturais &mdash; 
                <strong> mapeando a ameaça antes que ela se torne uma crise manchete.</strong>
              </p>

              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-red-500/50" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-red-500/50" />
            </div>
          </div>
        </section>

        {/* ── GRID DE PILARES ── */}
        <section className="mb-24">
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-2xl font-black text-zinc-100 uppercase tracking-tight">
              Matriz Operacional
            </h2>
            <div className="flex-1 h-px bg-[#2a2f3a]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pillars.map((pillar, index) => (
              <div
                key={index}
                className="group flex flex-col p-6 bg-[#111318] border border-[#2a2f3a] hover:border-primary/60 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />

                <span className="text-[12px] font-black font-mono uppercase tracking-[0.2em] text-zinc-500 mb-3">
                  {pillar.group}
                </span>
                
                <h3 className="text-lg font-black text-zinc-100 uppercase leading-snug mb-3 group-hover:text-primary transition-colors">
                  {pillar.title}
                </h3>
                
                <p className="text-sm text-zinc-400 leading-relaxed flex-1">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── ASSINATURA FINAL ── */}
        <section className="text-center border-t border-[#2a2f3a] pt-16 pb-8 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary" />
          
          <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-6">
            Tecnologia. <span className="text-zinc-600">Poder.</span> Direção.
          </h2>

          <p className="text-zinc-400 max-w-2xl mx-auto leading-relaxed text-lg">
            Enquanto a maioria discute o que já aconteceu, nossa função é mapear o que está prestes a acontecer. 
            Nosso compromisso é entregar <strong className="text-zinc-200">clareza estratégica</strong> para quem 
            precisa entender o tabuleiro, e não apenas ser movido por ele.
          </p>

          <div className="mt-10 inline-flex items-center justify-center gap-3 border border-[#2a2f3a] bg-[#111318] px-6 py-3">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
            <span className="text-xs font-black uppercase tracking-[0.3em] text-zinc-300 font-mono">
              Publicamos contexto. Não ruído.
            </span>
          </div>
        </section>

      </div>
    </div>
  );
}