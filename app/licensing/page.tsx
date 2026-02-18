import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Licenciamento & Propriedade Intelectual | Vetor Estratégico",
  description:
    "Política oficial de propriedade intelectual do Vetor Estratégico. Regras de uso, reprodução, scraping, IA e licenciamento comercial.",
  keywords: [
    "propriedade intelectual",
    "licenciamento de conteúdo",
    "direitos autorais Brasil",
    "uso de conteúdo digital",
    "scraping ilegal",
    "treinamento de IA sem autorização"
  ],
  openGraph: {
    title: "Licenciamento Oficial | Vetor Estratégico",
    description:
      "Protocolo formal de uso, reprodução e exploração comercial do conteúdo do Vetor Estratégico.",
    type: "article",
  },
};

export default function LicensingPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <header className="mb-12 border-b border-[var(--border)] pb-8">
          <span className="bg-zinc-900 text-white text-xs font-bold px-2 py-1 rounded-sm uppercase tracking-widest font-mono">
            Documento Jurídico Oficial
          </span>

          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-white uppercase mt-6">
            Licenciamento & <br />
            <span className="text-primary">Propriedade Intelectual</span>
          </h1>

          <p className="mt-4 text-zinc-600 dark:text-zinc-400 font-medium">
            Política formal de uso, reprodução e exploração dos ativos editoriais do Vetor Estratégico.
          </p>
        </header>

        <div className="space-y-14 text-zinc-800 dark:text-zinc-300 leading-relaxed">

          {/* 1 */}
          <section className="relative pl-6">
            <div className="absolute left-0 top-0 h-full w-1 bg-primary"></div>

            <h2 className="text-xl font-bold uppercase mb-4">
              01. Titularidade e Soberania Intelectual
            </h2>

            <p>
              Todo conteúdo original publicado pelo <strong>Vetor Estratégico</strong> —
              incluindo análises técnicas, relatórios, gráficos, estrutura editorial,
              metodologia analítica e a marca registrada
              <em className="text-primary font-semibold"> “Visão do Analista™” </em>
              — é protegido pela legislação brasileira de direitos autorais
              (Lei nº 9.610/98) e tratados internacionais aplicáveis.
            </p>

            <p className="mt-4">
              Não atuamos como agregador de notícias.
              Produzimos análise original baseada em método próprio.
              A arquitetura intelectual do conteúdo é parte essencial do ativo protegido.
            </p>
          </section>

          {/* 2 */}
          <section className="relative pl-6">
            <div className="absolute left-0 top-0 h-full w-1 bg-primary"></div>

            <h2 className="text-xl font-bold uppercase mb-6">
              02. Uso Não Autorizado
            </h2>

            <div className="bg-red-50 dark:bg-red-900/10 p-6 border border-red-200 dark:border-red-900/40 rounded-sm">
              <p className="font-semibold mb-4 text-red-600 dark:text-red-400 uppercase text-sm">
                É expressamente proibido:
              </p>

              <ul className="space-y-3 text-sm">
                <li>• Reproduzir integralmente artigos ou relatórios.</li>
                <li>• Realizar scraping automatizado para mineração de dados.</li>
                <li>• Utilizar conteúdo para treinamento de modelos de IA externos sem licença formal.</li>
                <li>• Modificar ou republicar análises sob outra autoria.</li>
                <li>• Comercializar trechos ou relatórios derivados.</li>
              </ul>
            </div>

            <p className="mt-6 text-sm text-zinc-600 dark:text-zinc-400">
              Monitoramos padrões automatizados de coleta de dados.
              Violações poderão resultar em medidas técnicas e jurídicas cabíveis.
            </p>
          </section>

          {/* 3 */}
          <section className="relative pl-6">
            <div className="absolute left-0 top-0 h-full w-1 bg-emerald-500"></div>

            <h2 className="text-xl font-bold uppercase mb-6">
              03. Uso Permitido & Atribuição
            </h2>

            <p>
              É permitido:
            </p>

            <ul className="mt-4 space-y-3 text-sm">
              <li>• Compartilhar links diretos para artigos.</li>
              <li>• Citar trechos curtos para fins educacionais ou críticos.</li>
              <li>• Referenciar dados com atribuição clara e visível.</li>
            </ul>

            <p className="mt-6">
              Modelo de atribuição recomendado:
            </p>

            <blockquote className="bg-zinc-100 dark:bg-zinc-900 border-l-4 border-primary p-6 rounded-r-md mt-4">
              <p className="italic">
                “Tecnologia não é neutra. Ela desloca poder.”
              </p>
              <cite className="block mt-4 text-sm font-bold not-italic">
                — Vetor Estratégico, 2026
              </cite>
            </blockquote>
          </section>

          {/* 4 */}
          <section className="relative pl-6">
            <div className="absolute left-0 top-0 h-full w-1 bg-indigo-600"></div>

            <h2 className="text-xl font-bold uppercase mb-4">
              04. Política sobre IA Generativa
            </h2>

            <p>
              O Vetor Estratégico utiliza ferramentas de IA como apoio operacional,
              jamais como substituição da análise humana.
            </p>

            <p className="mt-4">
              Cada publicação passa por auditoria editorial,
              verificação de dados e validação metodológica.
              A responsabilidade intelectual é exclusivamente humana.
            </p>

            <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
              A reprodução para treinamento de modelos de linguagem
              requer contrato específico de licenciamento.
            </p>
          </section>

          {/* 5 */}
          <section className="relative pl-6">
            <div className="absolute left-0 top-0 h-full w-1 bg-orange-500"></div>

            <h2 className="text-xl font-bold uppercase mb-4">
              05. Transparência Comercial
            </h2>

            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              O Vetor Estratégico pode participar de programas de afiliados.
              Links promocionais são claramente identificados.
              A remuneração não influencia metodologia, análise ou conclusão editorial.
              Integridade técnica é prioridade absoluta.
            </p>
          </section>

          {/* FOOTER */}
          <footer className="pt-10 border-t border-[var(--border)]">
            <h2 className="text-sm font-black uppercase text-zinc-500 mb-4">
              Licenciamento Comercial
            </h2>

            <p className="text-zinc-600 dark:text-zinc-400">
              Para republicação integral, relatórios corporativos,
              uso acadêmico ampliado ou treinamento de sistemas de IA,
              entre em contato com a equipe editorial.
            </p>

            <a
              href="/contato"
              className="inline-block mt-6 bg-primary text-white px-6 py-3 text-sm font-bold uppercase tracking-wider hover:opacity-90 transition"
            >
              Solicitar Licença Formal
            </a>
          </footer>

        </div>
      </div>
    </div>
  );
}
