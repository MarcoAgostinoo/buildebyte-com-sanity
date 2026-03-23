import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manifesto Institucional | Vetor Estratégico",
  description: "A doutrina por trás da análise. Por que a neutralidade técnica e a soberania digital são os pilares do Vetor Estratégico.",
};

export default function ManifestoPage() {
  return (
    <div className="min-h-screen bg-[#05080b] py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* ── ESTÉTICA DE FUNDO ── */}
      <div className="absolute inset-0 bg-[radial-gradient(var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-50 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-[#2a2f3a] to-transparent" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* ── CABEÇALHO DO DOCUMENTO ── */}
        <div className="border border-[#2a2f3a] bg-[#0a0b0d] p-8 mb-16 shadow-2xl relative">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 border-b border-[#2a2f3a] pb-6">
            <div className="space-y-1">
              <span className="text-[12px] font-mono text-zinc-500 uppercase tracking-[0.4em]">Origem: Comando Editorial</span>
              <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Manifesto Institucional</h1>
            </div>
            <div className="text-right font-mono text-[12px] text-primary/60 space-y-1 uppercase tracking-widest">
              <p>Ref: VETOR-DOC-2026</p>
              <p>Status: Transmissão Ativa</p>
            </div>
          </div>

          {/* ── O CONTEÚDO DO MANIFESTO ── */}
          <div className="prose prose-invert max-w-none space-y-10">
            
            <section className="space-y-4">
              <h2 className="text-primary font-black text-xl uppercase tracking-widest flex items-center gap-3">
                <span className="w-8 h-px bg-primary/30" />
                I. O Fim da Neutralidade Geográfica
              </h2>
              <p className="text-zinc-300 text-lg leading-relaxed font-medium">
                Em um mundo hiperconectado, a tecnologia não é mais neutra. Cada linha de código, cada semicondutor e cada cabo submarino carrega uma bandeira. A neutralidade é um mito mantido por quem já detém o poder. O Vetor Estratégico nasce para observar o tabuleiro sob a ótica da <span className="text-white border-b border-primary/40">soberania nacional</span>.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-primary font-black text-xl uppercase tracking-widest flex items-center gap-3">
                <span className="w-8 h-px bg-primary/30" />
                II. A Ditadura do Ruído
              </h2>
              <p className="text-zinc-300 text-lg leading-relaxed">
                A manchete de 24 horas foi desenhada para gerar reação, não reflexão. Enquanto o mundo se perde no barulho do evento imediato, nós focamos na <strong className="text-white">magnitude do vetor</strong>. O que importa não é apenas o que aconteceu, mas a força e a direção do impacto que isso terá na infraestrutura e na defesa do Brasil nos próximos anos.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-primary font-black text-xl uppercase tracking-widest flex items-center gap-3">
                <span className="w-8 h-px bg-primary/30" />
                III. Técnica sobre Ideologia
              </h2>
              <p className="text-zinc-300 text-lg leading-relaxed italic border-l-2 border-[#2a2f3a] pl-6 py-2">
                &ldquo;Análise não é torcida. Inteligência não é propaganda.&rdquo;
              </p>
              <p className="text-zinc-400">
                Nossa doutrina exige a frieza dos dados. Avaliamos a capacidade real de um sistema de armas, a viabilidade econômica de uma sanção e a resiliência de uma rede elétrica com base em leis físicas e logísticas, não em desejos políticos. 
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-primary font-black text-xl uppercase tracking-widest flex items-center gap-3">
                <span className="w-8 h-px bg-primary/30" />
                IV. O Vetor Brasil
              </h2>
              <p className="text-zinc-300 text-lg leading-relaxed">
                O Brasil possui uma Base Industrial de Defesa e uma massa crítica tecnológica que são subestimadas. O Vetor Estratégico existe para mapear essas capacidades, expor vulnerabilidades e apontar direções. Nossa missão é prover clareza para a tomada de decisão em um cenário de <strong className="text-white">competição sistêmica global</strong>.
              </p>
            </section>

          </div>

          {/* ── ASSINATURA TÁTICA ── */}
          <div className="mt-20 pt-10 border-t border-[#2a2f3a] flex flex-col items-center">
            <div className="mb-6 opacity-20 grayscale">
               <img src="/logo.webp" alt="Vetor Logo" className="w-16 h-16" />
            </div>
            <p className="text-[12px] font-mono text-zinc-600 uppercase tracking-[0.5em] mb-4">
              Tecnologia &bull; Poder &bull; Direção
            </p>
            <div className="h-10 w-px bg-gradient-to-b from-[#2a2f3a] to-transparent" />
          </div>

          {/* MARCADORES DE CANTO */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-zinc-700" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-zinc-700" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-zinc-700" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-zinc-700" />
        </div>

        {/* ── FOOTER DA PÁGINA ── */}
        <div className="text-center">
          <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest">
            Fim da Transmissão // Sem mais dados.
          </p>
        </div>

      </div>
    </div>
  );
}