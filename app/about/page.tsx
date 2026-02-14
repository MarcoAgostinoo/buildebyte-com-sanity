import { Metadata } from "next";

export const metadata: Metadata = {
  title: "A Missão | Build&Byte",
  description: "Não cobrimos apenas a tecnologia. Nós auditamos o código-fonte do mundo moderno.",
};

const pillars = [
  {
    title: "Biohacking & Quantified Self",
    desc: "Métricas de longevidade, nutrição de precisão e a privacidade biométrica sob a ótica da engenharia humana."
  },
  {
    title: "Engenharia do Dinheiro",
    desc: "Drex, trading algorítmico e a geopolítica dos semicondutores. Onde o código encontra o capital."
  },
  {
    title: "Casa Inteligente (IoT)",
    desc: "Soberania local com Home Assistant, eficiência energética e a blindagem de redes domésticas."
  },
  {
    title: "Sobrevivencialismo Digital",
    desc: "Redes mesh, servidores de contingência e criptografia. Preparação técnica para cenários de incerteza."
  },
  {
    title: "Geopolítica Tech",
    desc: "Ciberguerra, soberania de dados e a infraestrutura crítica que sustenta (ou derruba) nações."
  },
  {
    title: "Desenvolvimento & No-Code",
    desc: "Do 'Hello World' à arquitetura escalável. Fullstack, automação e o impacto real da IA no código."
  },
  {
    title: "Games & Hardware",
    desc: "Otimização de engines, arquitetura de GPUs e a busca obsessiva pela menor latência."
  },
  {
    title: "Produtividade (Hardware)",
    desc: "Workstations de alta performance e setups otimizados para quem constrói o futuro."
  },
  {
    title: "Mobilidade & Dispositivos",
    desc: "Auditoria de sistemas operacionais móveis, reparabilidade e privacidade no bolso."
  },
  {
    title: "IA Generativa & Automação",
    desc: "LLMs locais, agentes autônomos e a ética dos algoritmos que decidem por nós."
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header - Estilo Manifesto */}
        <header className="mb-16 border-b border-[var(--border)] pb-8">
          <span className="text-secondary font-bold tracking-widest text-xs uppercase mb-2 block">
            System.Root.Mission
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase">
            Decodificando a <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-600">
              Arquitetura do Mundo
            </span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed font-medium">
            O <strong className="text-zinc-900 dark:text-white">Build&Byte</strong> nasceu para traduzir a complexidade tecnológica, financeira e geopolítica através da lente de um Analista de Sistemas. Não reportamos o "o quê", explicamos o "como".
          </p>
        </header>

        {/* O Diferencial */}
        <section className="mb-20 grid md:grid-cols-12 gap-12 items-start">
          <div className="md:col-span-7 space-y-6 text-zinc-800 dark:text-zinc-300 leading-relaxed text-lg">
            <p>
              Não somos apenas mais um portal de tecnologia. Somos um guia estratégico para entender as engrenagens que movem o mundo digital. 
            </p>
            <p>
              Em um mundo inundado de ruído, nosso diferencial é a <strong className="text-primary underline decoration-2 underline-offset-4">autoridade técnica</strong>. Cada artigo é construído sobre uma base sólida de engenharia de software e segurança da informação.
            </p>
          </div>
          
          {/* Box Visão do Analista */}
          <div className="md:col-span-5 relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-zinc-900 dark:bg-black p-6 rounded-lg border border-zinc-800 shadow-2xl">
              <div className="flex items-center gap-2 mb-4 border-b border-zinc-800 pb-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-auto text-xs font-mono text-zinc-500">feature_flag.js</span>
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Visão do Analista &trade;</h3>
              <p className="text-zinc-400 text-sm font-mono leading-relaxed">
                {`// O nosso "Pulo do Gato"`} <br/>
                {`const diferencial = (`} <br/>
                {`  noticia + contexto_tecnico`} <br/>
                {`);`} <br/>
                <br/>
                <span className="text-zinc-300 font-sans">
                  Em cada artigo, conectamos o fato à engenharia. É o detalhe técnico que transforma informação em vantagem estratégica.
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* Grid de Pilares */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white uppercase tracking-tight">
              Os 10 Pilares do Sistema
            </h2>
            <div className="h-px flex-1 bg-[var(--border)]"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {pillars.map((pillar, index) => (
              <div 
                key={index}
                className="group p-6 bg-[var(--card-bg)] border border-[var(--border)] hover:border-primary/50 transition-all duration-300 rounded-sm hover:shadow-lg dark:hover:shadow-blue-900/10"
              >
                <div className="flex items-start gap-4">
                  <span className="text-4xl font-black text-zinc-200 dark:text-zinc-800 group-hover:text-primary/20 transition-colors">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                      {pillar.title}
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer da Página */}
        <footer className="mt-20 pt-10 border-t border-[var(--border)] text-center">
          <p className="text-zinc-500 font-medium">
            Bem-vindo ao <span className="text-zinc-900 dark:text-white font-bold">Build&Byte</span>. 
            <br className="hidden md:inline" /> 
            Aqui, a tecnologia é desmistificada, auditada e compreendida em sua essência.
          </p>
        </footer>

      </div>
    </div>
  );
}