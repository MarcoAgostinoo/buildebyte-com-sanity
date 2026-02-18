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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <header className="mb-12 border-b border-[var(--border)] pb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-green-600/10 text-green-600 dark:text-green-400 border border-green-600/20 text-xs font-bold px-2 py-1 rounded-sm uppercase tracking-widest">
              Política Ativa
            </span>
            <span className="text-zinc-400 text-xs font-mono">
              Última Atualização: 31/01/2026
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">
            Privacidade & <br />
            <span className="text-primary">Proteção de Dados</span>
          </h1>

          <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
            O Vetor Estratégico adota o princípio da <strong>minimização de dados</strong>.
            Coletamos apenas o estritamente necessário para operação do portal.
            Privacidade não é recurso opcional. É arquitetura.
          </p>
        </header>

        <div className="space-y-14 text-zinc-800 dark:text-zinc-300 leading-relaxed">

          {/* 1 */}
          <section>
            <h2 className="text-xl font-bold uppercase mb-6">
              01. Tratamento de Dados Pessoais
            </h2>

            <div className="grid md:grid-cols-2 gap-6">

              {/* Coletamos */}
              <div className="bg-[var(--card-bg)] p-6 rounded-sm border-l-4 border-green-600">
                <h3 className="font-bold text-lg mb-4">
                  Dados Coletados
                </h3>

                <ul className="space-y-3 text-sm">
                  <li>
                    <strong>Fornecimento voluntário:</strong> Nome e e-mail enviados via formulário de contato.
                  </li>
                  <li>
                    <strong>Dados técnicos:</strong> Logs anônimos para diagnóstico de falhas e segurança do servidor.
                  </li>
                </ul>
              </div>

              {/* Não coletamos */}
              <div className="bg-[var(--card-bg)] p-6 rounded-sm border-l-4 border-red-600">
                <h3 className="font-bold text-lg mb-4">
                  Dados Não Coletados
                </h3>

                <ul className="space-y-3 text-sm">
                  <li>Não comercializamos dados com terceiros.</li>
                  <li>Não utilizamos fingerprinting invasivo.</li>
                  <li>Não mantemos perfil comportamental do usuário.</li>
                  <li>Não armazenamos IP vinculado a dados pessoais sem obrigação legal.</li>
                </ul>
              </div>

            </div>
          </section>

          {/* 2 */}
          <section className="border-t border-[var(--border)] pt-8">
            <h2 className="text-xl font-bold uppercase mb-4">
              02. Cookies & Telemetria
            </h2>

            <p className="mb-4">
              Utilizamos exclusivamente cookies essenciais de sessão,
              necessários para funcionamento técnico do portal.
            </p>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 border border-blue-200 dark:border-blue-800 rounded-sm text-sm">
              Não utilizamos redes de recomendação invasivas,
              nem scripts de rastreamento comportamental de terceiros
              para monetização baseada em perfil.
            </div>
          </section>

          {/* 3 */}
          <section className="border-t border-[var(--border)] pt-8">
            <h2 className="text-xl font-bold uppercase mb-6">
              03. Infraestrutura de Segurança
            </h2>

            <p className="mb-6">
              Nossa arquitetura segue princípios de segurança por padrão
              (<em>Security by Design</em>) e proteção por configuração
              (<em>Security by Default</em>).
            </p>

            <ul className="grid sm:grid-cols-3 gap-4 text-sm font-mono text-center">
              <li className="p-4 border border-[var(--border)] rounded bg-zinc-100 dark:bg-zinc-900">
                TLS 1.3<br/>Obrigatório
              </li>
              <li className="p-4 border border-[var(--border)] rounded bg-zinc-100 dark:bg-zinc-900">
                Banco de Dados<br/>Criptografado
              </li>
              <li className="p-4 border border-[var(--border)] rounded bg-zinc-100 dark:bg-zinc-900">
                Controle de Acesso<br/>Restritivo
              </li>
            </ul>
          </section>

          {/* 4 */}
          <section className="border-t border-[var(--border)] pt-8">
            <h2 className="text-xl font-bold uppercase mb-4">
              04. Direitos do Titular (LGPD)
            </h2>

            <p>
              Nos termos da Lei nº 13.709/2018 (LGPD), o titular dos dados pode:
            </p>

            <ul className="mt-4 space-y-2 text-sm">
              <li>• Confirmar a existência de tratamento.</li>
              <li>• Solicitar acesso aos dados armazenados.</li>
              <li>• Solicitar correção ou atualização.</li>
              <li>• Solicitar anonimização ou exclusão.</li>
              <li>• Revogar consentimento previamente concedido.</li>
            </ul>

            <p className="mt-6 text-sm text-zinc-600 dark:text-zinc-400">
              As solicitações serão respondidas dentro dos prazos legais aplicáveis.
            </p>
          </section>

          {/* 5 */}
          <section className="border-t border-[var(--border)] pt-8">
            <h2 className="text-xl font-bold uppercase mb-4">
              05. Base Legal do Tratamento
            </h2>

            <p className="text-sm">
              O tratamento de dados ocorre com base em:
              consentimento do titular (Art. 7º, I, LGPD) ou
              legítimo interesse para manutenção técnica e segurança da plataforma (Art. 7º, IX).
            </p>
          </section>

          {/* FOOTER CTA */}
          <div className="mt-12 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 p-8 rounded-sm text-center">
            <h3 className="text-2xl font-bold mb-3">
              Solicitação de Privacidade
            </h3>

            <p className="mb-6 opacity-90">
              Para exercer seus direitos ou esclarecer dúvidas técnicas,
              entre em contato com nossa equipe.
            </p>

            <Link
              href="/contato"
              className="inline-block bg-primary hover:opacity-90 text-white font-bold py-3 px-8 uppercase tracking-wide text-sm transition"
            >
              Abrir Requisição Formal
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
