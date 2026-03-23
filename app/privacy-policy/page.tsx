import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacidade & Proteção de Dados | Vetor Estratégico",
  description:
    "Política oficial de proteção de dados do Vetor Estratégico. Tratamento mínimo de informações, conformidade com LGPD e arquitetura de soberania digital.",
  keywords: [
    "LGPD",
    "proteção de dados Brasil",
    "política de privacidade",
    "soberania digital",
    "segurança da informação",
    "tratamento de dados pessoais"
  ],
  openGraph: {
    title: "Política de Privacidade | Vetor Estratégico",
    description:
      "Tratamento mínimo de dados, segurança por arquitetura e conformidade com a LGPD.",
    type: "article",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#05080b] py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* ── BACKGROUND TÁTICO ── */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />

      <div className="max-w-4xl mx-auto relative z-10">

        {/* ── HEADER (PROTOCOLO) ── */}
        <header className="mb-16 border-b border-[#2a2f3a] pb-10">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-3 py-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-500 text-[12px] font-black uppercase tracking-widest">
                Protocolo Ativo
              </span>
            </div>
            <span className="text-zinc-500 text-[12px] font-mono uppercase tracking-widest">
              Ref: VETOR-PRIV-2026 &bull; Última Atualização: 31/01/2026
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-zinc-100 uppercase tracking-tighter leading-none mb-6">
            Privacidade & <br />
            <span className="text-primary">Proteção de Dados</span>
          </h1>

          <p className="text-lg text-zinc-400 leading-relaxed border-l-2 border-primary/40 pl-5">
            O Vetor Estratégico adota o princípio da <strong className="text-zinc-200 uppercase">minimização de dados</strong>. 
            Coletamos apenas o estritamente necessário para a operação do terminal. 
            Privacidade não é recurso opcional. É arquitetura de soberania.
          </p>
        </header>

        <div className="space-y-20">

          {/* 01. TRATAMENTO */}
          <section>
            <h2 className="text-zinc-100 font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
              <span className="text-primary font-mono text-sm">01.</span>
              Tratamento de Dados Pessoais
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Coletamos */}
              <div className="bg-[#0a0b0d] p-6 border border-[#2a2f3a] relative group">
                <div className="absolute top-0 left-0 w-1 h-full bg-green-600/50" />
                <h3 className="font-black text-zinc-200 uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500" /> Dados Coletados
                </h3>
                <ul className="space-y-4 text-sm text-zinc-400">
                  <li>
                    <strong className="text-zinc-300">Fornecimento Voluntário:</strong> Identificação e contato via formulários de inteligência (e-mail).
                  </li>
                  <li>
                    <strong className="text-zinc-300">Dados Técnicos:</strong> Logs anônimos de servidor para diagnóstico e mitigação de ameaças.
                  </li>
                </ul>
              </div>

              {/* Não coletamos */}
              <div className="bg-[#0a0b0d] p-6 border border-[#2a2f3a] relative group">
                <div className="absolute top-0 left-0 w-1 h-full bg-red-600/50" />
                <h3 className="font-black text-zinc-200 uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500" /> Vetados (Não Coletados)
                </h3>
                <ul className="space-y-2 text-sm text-zinc-400">
                  <li>&bull; Comercialização com terceiros.</li>
                  <li>&bull; Fingerprinting invasivo.</li>
                  <li>&bull; Perfilamento comportamental.</li>
                  <li>&bull; Rastreamento cross-site.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 02. COOKIES */}
          <section className="border-t border-[#2a2f3a] pt-12">
            <h2 className="text-zinc-100 font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
              <span className="text-primary font-mono text-sm">02.</span>
              Cookies & Telemetria
            </h2>
            <div className="max-w-3xl space-y-4 text-zinc-400">
              <p>
                Utilizamos exclusivamente cookies essenciais de sessão, necessários para a autenticação e estabilidade técnica do portal.
              </p>
              <div className="bg-[#111318] p-5 border-l-2 border-primary/30 text-[12px] font-mono leading-relaxed uppercase tracking-wider">
                [Aviso] Não operamos redes de recomendação externas ou scripts de rastreamento de terceiros para fins de monetização baseada em histórico de navegação.
              </div>
            </div>
          </section>

          {/* 03. INFRAESTRUTURA */}
          <section className="border-t border-[#2a2f3a] pt-12">
            <h2 className="text-zinc-100 font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
              <span className="text-primary font-mono text-sm">03.</span>
              Infraestrutura de Segurança
            </h2>
            <p className="text-zinc-400 mb-8 max-w-2xl">
              Nossa arquitetura segue princípios de segurança por design (&ldquo;Security by Design&rdquo;). O fluxo de dados é protegido em todas as camadas operacionais.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { title: "TLS 1.3", status: "Obrigatório" },
                { title: "DATABASE", status: "Criptografado" },
                { title: "ACESSOS", status: "Restritivos" },
              ].map((item, idx) => (
                <div key={idx} className="bg-[#0a0b0d] border border-[#2a2f3a] p-5 text-center group hover:border-primary/50 transition-colors">
                  <span className="block text-[12px] font-mono text-zinc-600 mb-1">Status: Ativo</span>
                  <span className="block font-black text-zinc-200 text-xs tracking-[0.2em] mb-2">{item.title}</span>
                  <span className="inline-block bg-primary/10 text-primary text-[12px] font-black px-2 py-0.5 border border-primary/20">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* 04. DIREITOS */}
          <section className="border-t border-[#2a2f3a] pt-12">
            <h2 className="text-zinc-100 font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
              <span className="text-primary font-mono text-sm">04.</span>
              Direitos do Titular (LGPD)
            </h2>
            <p className="text-zinc-400 mb-6">
              Sob a Lei nº 13.709/2018, você detém o controle sobre seus dados. Garantimos o exercício imediato de:
            </p>
            <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3 text-xs font-bold uppercase tracking-widest text-zinc-500">
              <li className="flex items-center gap-2"><span className="text-primary">▹</span> Confirmação de Tratamento</li>
              <li className="flex items-center gap-2"><span className="text-primary">▹</span> Acesso aos Dados</li>
              <li className="flex items-center gap-2"><span className="text-primary">▹</span> Correção e Atualização</li>
              <li className="flex items-center gap-2"><span className="text-primary">▹</span> Anonimização ou Exclusão</li>
            </ul>
          </section>

          {/* FOOTER CTA */}
          <div className="relative mt-24 bg-[#111318] border border-[#2a2f3a] p-8 sm:p-12 text-center overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-primary/50 to-transparent" />
            
            <h3 className="text-2xl font-black text-zinc-100 uppercase tracking-tighter mb-4">
              Solicitação de Privacidade
            </h3>
            <p className="text-zinc-400 mb-8 max-w-md mx-auto text-sm leading-relaxed">
              Para exercer seus direitos legais ou esclarecer dúvidas sobre nossa arquitetura de proteção, inicie um chamado formal.
            </p>

            <Link
              href="/contato"
              className="inline-flex items-center gap-3 bg-primary hover:bg-blue-600 text-white font-black py-4 px-10 uppercase tracking-[0.2em] text-[12px] transition-all group"
            >
              Abrir Requisição Formal
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            
            {/* Marcadores de Borda */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-zinc-600" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-zinc-600" />
          </div>

        </div>

        {/* FIM DA TRANSMISSÃO */}
        <div className="mt-20 text-center">
          <p className="text-[12px] font-mono text-zinc-600 uppercase tracking-[0.5em]">
            Fim do Documento // VETOR SECURED SYSTEM
          </p>
        </div>

      </div>
    </div>
  );
}