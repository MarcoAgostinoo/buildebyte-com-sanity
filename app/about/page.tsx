import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre o Build&Byte | Estratégia, Tecnologia e Decisão Inteligente",
  description:
    "O Build&Byte traduz tecnologia em vantagem prática. Análises técnicas, decisões inteligentes e auditoria do mundo digital.",
  keywords: [
    "tecnologia prática",
    "engenharia de software aplicada",
    "segurança digital",
    "casa inteligente",
    "IA aplicada",
    "análise técnica",
  ],
  openGraph: {
    title: "Sobre o Build&Byte",
    description:
      "Menos hype. Mais utilidade. Auditoria técnica do mundo moderno.",
    type: "website",
  },
};

const pillars = [
  {
    group: "BYTE",
    title: "IA Aplicada",
    desc: "Automação real, produtividade e uso estratégico de IA — sem hype."
  },
  {
    group: "BYTE",
    title: "Segurança Digital Prática",
    desc: "Proteção de dados, privacidade e análise de riscos no Brasil."
  },
  {
    group: "BYTE",
    title: "Comparativos de Software",
    desc: "Ferramentas testadas na prática para decidir melhor."
  },
  {
    group: "BUILD",
    title: "Home Office & Setup",
    desc: "Ergonomia, performance e compras inteligentes."
  },
  {
    group: "BUILD",
    title: "Casa Inteligente",
    desc: "Automação residencial sem dor de cabeça e sem dependência cega de cloud."
  },
  {
    group: "BUILD",
    title: "Hardware & Performance",
    desc: "GPUs, notebooks e equipamentos analisados além do marketing."
  },
  {
    group: "STRATEGIC",
    title: "Geopolítica Tech",
    desc: "Semicondutores, soberania digital e impacto no Brasil."
  },
  {
    group: "STRATEGIC",
    title: "Finanças & Tecnologia",
    desc: "Drex, sistemas financeiros e o código por trás do dinheiro."
  },
  {
    group: "STRATEGIC",
    title: "Biohacking & Performance Humana",
    desc: "Métricas, dados e tecnologia aplicada à longevidade."
  },
  {
    group: "STRATEGIC",
    title: "IA Generativa & Automação",
    desc: "LLMs locais, agentes autônomos e implicações técnicas reais."
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">

        {/* HEADER ESTRATÉGICO */}
        <header className="mb-16 border-b border-[var(--border)] pb-8">
          <span className="text-secondary font-bold tracking-widest text-xs uppercase mb-2 block font-mono">
            Build&Byte.System
          </span>

          <h1 className="text-4xl md:text-6xl font-black text-zinc-900 dark:text-white tracking-tight">
            Tecnologia não é notícia. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-400">
              É ferramenta estratégica.
            </span>
          </h1>

          <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed">
            O <strong>Build&Byte</strong> nasceu com uma missão simples:
            traduzir complexidade tecnológica em decisões inteligentes.
            Aqui, você não encontra hype — encontra análise técnica aplicada
            ao mundo real.
          </p>
        </header>

        {/* DIFERENCIAL */}
        <section className="mb-20 grid md:grid-cols-12 gap-12 items-start">

          <div className="md:col-span-7 space-y-6 text-zinc-800 dark:text-zinc-300 leading-relaxed text-lg">
            <p>
              A maioria dos portais informa. Nós auditamos.
            </p>

            <p>
              Cada artigo parte de uma pergunta prática:
            </p>

            <ul className="list-disc pl-6 space-y-2">
              <li>Isso economiza tempo?</li>
              <li>Isso aumenta produtividade?</li>
              <li>Isso evita prejuízo?</li>
              <li>Isso melhora qualidade de vida?</li>
            </ul>

            <p>
              Se não houver impacto real, não publicamos.
            </p>
          </div>

          {/* VISÃO DO ANALISTA */}
          <div className="md:col-span-5 relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-amber-600 rounded-lg blur opacity-25"></div>
            <div className="relative bg-zinc-900 p-6 rounded-lg border border-zinc-800 shadow-2xl">
              <h3 className="text-white font-bold text-lg mb-4">
                Visão do Analista™
              </h3>

              <p className="text-zinc-400 text-sm leading-relaxed">
                Não analisamos apenas features.
                Analisamos arquitetura, protocolo, dependência de cloud,
                modelo de negócios e risco de lock-in.
              </p>

              <p className="text-zinc-400 text-sm mt-4 leading-relaxed">
                Toda tecnologia tem trade-offs. Nós mostramos quais são —
                antes que você pague por eles.
              </p>
            </div>
          </div>
        </section>

        {/* PILARES */}
        <section>
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-8">
            Os 10 Pilares do Sistema
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pillars.map((pillar, index) => (
              <div
                key={index}
                className="p-6 bg-[var(--card-bg)] border border-[var(--border)] rounded-md hover:border-orange-500 transition-all duration-300"
              >
                <span className="text-xs font-mono text-orange-500">
                  {pillar.group}
                </span>
                <h3 className="text-lg font-bold mt-2 mb-2">
                  {pillar.title}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA ESTRATÉGICO */}
        <section className="mt-20 text-center border-t border-[var(--border)] pt-12">
          <h2 className="text-2xl font-bold mb-4">
            Menos hype. Mais utilidade.
          </h2>

          <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Se você trabalha com tecnologia, quer montar um setup melhor,
            automatizar tarefas ou evitar decisões ruins,
            o Build&Byte existe para isso.
          </p>

          <p className="mt-6 font-medium">
            Curadoria semanal: <strong>menos ruído, mais vantagem estratégica.</strong>
          </p>
        </section>

      </div>
    </div>
  );
}
