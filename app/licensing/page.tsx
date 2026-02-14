import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Licenciamento | Build&Byte",
  description: "Dossiê sobre direitos autorais e as regras de engajamento com o conteúdo técnico do portal Build&Byte.",
};

export default function LicensingPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Cabeçalho de Estilo Dossiê */}
        <header className="mb-12 border-b border-[var(--border)] pb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-secondary text-white text-xs font-bold px-2 py-1 rounded-sm uppercase tracking-widest">
              Documento Oficial
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-white uppercase">
            Licenciamento & <br />
            <span className="text-primary">Propriedade Intelectual</span>
          </h1>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400 font-medium">
            Protocolo de uso e reprodução de dados, análises e ativos digitais do portal Build&Byte.
          </p>
        </header>

        <div className="space-y-12 text-zinc-800 dark:text-zinc-300 leading-relaxed">
          
          {/* Seção 1 */}
          <section className="relative pl-6">
            <div className="absolute left-0 top-0 h-full w-1 bg-primary"></div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white uppercase tracking-tight mb-4">
              01. Soberania do Conteúdo
            </h2>
            <p>
              Todo o ecossistema original do portal <strong className="text-zinc-900 dark:text-white">Build&Byte</strong> — incluindo textos, investigações técnicas, gráficos e o selo <em className="text-primary font-semibold">"Visão do Analista"</em> — é protegido por leis internacionais de propriedade intelectual. Não somos apenas um agregador; somos os arquitetos de cada linha de análise publicada aqui.
            </p>
          </section>

          {/* Seção 2 */}
          <section className="relative pl-6">
            <div className="absolute left-0 top-0 h-full w-1 bg-primary"></div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white uppercase tracking-tight mb-4">
              02. Regras de Engajamento
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-[var(--card-bg)]/50 p-6 border border-[var(--border)] rounded-sm shadow-sm">
                <h3 className="text-secondary font-bold uppercase text-sm mb-3 tracking-wider">Proibido</h3>
                <p className="text-sm">
                  Reproduzir, minerar dados (scraping), modificar ou comercializar qualquer fragmento deste dossiê sem autorização expressa. O uso de nosso conteúdo para treinamento de LLMs externos sem licenciamento é estritamente monitorado.
                </p>
              </div>
              <div className="bg-[var(--card-bg)]/50 p-6 border border-[var(--border)] rounded-sm shadow-sm">
                <h3 className="text-primary font-bold uppercase text-sm mb-3 tracking-wider">Permitido</h3>
                <p className="text-sm">
                  Compartilhar links diretos em redes sociais ou newsletters, desde que o <span className="font-bold underline decoration-primary">crédito ao Build&Byte</span> como fonte original seja mantido de forma clara, proeminente e inalterada.
                </p>
              </div>
            </div>
          </section>

          {/* Seção 3: Citação com o estilo do seu portal */}
          <section className="relative pl-6">
            <div className="absolute left-0 top-0 h-full w-1 bg-primary"></div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white uppercase tracking-tight mb-4">
              03. Atribuição de Fonte
            </h2>
            <p className="mb-6">
              Citações parciais são permitidas para fins críticos ou educacionais, seguindo o padrão de <em>Fair Use</em>. A atribuição deve seguir o modelo abaixo:
            </p>
            <blockquote className="bg-zinc-100 dark:bg-zinc-900 border-l-4 border-secondary p-6 rounded-r-md shadow-inner">
              <p className="italic font-medium text-zinc-700 dark:text-zinc-400">
                "O código não mente, mas o marketing da tecnologia muitas vezes alucina."
              </p>
              <cite className="block mt-4 text-sm font-bold uppercase not-italic text-zinc-900 dark:text-white">
                — Build&Byte (Dossiê Vibe Coding, 2026)
              </cite>
            </blockquote>
          </section>

          {/* Seção 4: O "Diferencial" IA */}
          <section className="relative pl-6">
            <div className="absolute left-0 top-0 h-full w-1 bg-primary"></div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white uppercase tracking-tight mb-4">
              04. Manifesto sobre IA Generativa
            </h2>
            <p className="bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 p-6 rounded-sm font-medium">
              Diferente de fazendas de conteúdo, o Build&Byte utiliza IA como ferramenta de suporte, não como autor. Cada artigo passa por uma auditoria humana rigorosa para garantir que a <span className="text-secondary uppercase font-black italic">intuição técnica</span> e a <span className="text-primary uppercase font-black italic">veracidade dos fatos</span> permaneçam inegociáveis.
            </p>
          </section>

          {/* Seção 5 */}
          <footer className="pt-8 border-t border-[var(--border)] text-center md:text-left">
            <h2 className="text-sm font-black uppercase text-zinc-500 mb-2">Contato para Licenciamento</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Precisa de uma licença comercial ou republicação completa? 
              <a href="/contato" className="ml-2 text-primary font-bold hover:underline">
                Abra um chamado com nossa equipe editorial.
              </a>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}