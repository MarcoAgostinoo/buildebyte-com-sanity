import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacidade & Dados | Build&Byte",
  description: "Protocolo de tratamento de dados, telemetria mínima e proteção da sua soberania digital.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Cabeçalho do Protocolo */}
        <header className="mb-12 border-b border-[var(--border)] pb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-green-600/10 text-green-600 dark:text-green-400 border border-green-600/20 text-xs font-bold px-2 py-1 rounded-sm uppercase tracking-widest">
              Status: Ativo
            </span>
            <span className="text-zinc-400 text-xs font-mono">
              LAST_UPDATE: 2026-01-31
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">
            Política de <br />
            <span className="text-primary">Privacidade & Dados</span>
          </h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
            No Build&Byte, tratamos dados como lixo tóxico: quanto menos tivermos, melhor. Nossa arquitetura é desenhada para respeitar sua <span className="text-zinc-900 dark:text-white font-bold underline decoration-secondary">soberania digital</span>.
          </p>
        </header>

        <div className="space-y-12 text-zinc-800 dark:text-zinc-300 leading-relaxed">
          
          {/* Seção 1: O que coletamos (Grid) */}
          <section>
            <h2 className="flex items-center gap-3 text-xl font-bold text-zinc-900 dark:text-white uppercase tracking-tight mb-6">
              <span className="text-primary/50">01.</span> Coleta de Dados (Telemetry)
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Card O Que Coletamos */}
              <div className="bg-[var(--card-bg)] p-6 rounded-sm border-l-4 border-green-500 shadow-sm">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <span className="text-green-600 dark:text-green-400">✓</span> O que coletamos
                </h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex gap-2">
                    <span className="font-mono text-xs bg-zinc-200 dark:bg-zinc-800 px-1 rounded">VOLUNTÁRIO</span>
                    <span>Dados que você envia ativamente no formulário de contato (Nome, E-mail).</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-mono text-xs bg-zinc-200 dark:bg-zinc-800 px-1 rounded">SISTEMA</span>
                    <span>Logs de erro anônimos para manutenção da estabilidade do servidor.</span>
                  </li>
                </ul>
              </div>

              {/* Card O Que NÃO Coletamos */}
              <div className="bg-[var(--card-bg)] p-6 rounded-sm border-l-4 border-red-500 shadow-sm">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <span className="text-red-600 dark:text-red-400">✕</span> O que NÃO coletamos
                </h3>
                <ul className="space-y-3 text-sm">
                  <li>Nós <strong className="text-red-500">não vendemos</strong> seus dados para corretores (Data Brokers).</li>
                  <li>Não usamos Fingerprinting agressivo para rastrear você pela web.</li>
                  <li>Não armazenamos IP associado a dados pessoais sem necessidade legal.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Seção 2: Cookies */}
          <section className="border-t border-[var(--border)] pt-8">
            <h2 className="flex items-center gap-3 text-xl font-bold text-zinc-900 dark:text-white uppercase tracking-tight mb-4">
              <span className="text-primary/50">02.</span> Política de Cookies
            </h2>
            <p className="mb-4">
              Utilizamos apenas cookies <strong>estritamente necessários</strong> para a integridade da sessão (Session Cookies).
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 border border-blue-100 dark:border-blue-800 rounded-sm">
              <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                <strong>Nota Técnica:</strong> Diferente de portais de mídia tradicionais, não injetamos scripts de terceiros (como Taboola ou Outbrain) que monitoram seu comportamento de leitura para vender anúncios direcionados.
              </p>
            </div>
          </section>

          {/* Seção 3: Segurança */}
          <section className="border-t border-[var(--border)] pt-8">
            <h2 className="flex items-center gap-3 text-xl font-bold text-zinc-900 dark:text-white uppercase tracking-tight mb-4">
              <span className="text-primary/50">03.</span> Infraestrutura de Segurança
            </h2>
            <p className="mb-4">
              Alinhados aos nossos pilares de <em>Sobrevivencialismo Digital</em>, aplicamos as seguintes camadas de proteção:
            </p>
            <ul className="grid sm:grid-cols-3 gap-4 text-sm font-mono text-zinc-600 dark:text-zinc-400 text-center">
              <li className="p-3 border border-[var(--border)] rounded bg-zinc-100 dark:bg-zinc-900">
                HTTPS / TLS 1.3 <br/> ENFORCED
              </li>
              <li className="p-3 border border-[var(--border)] rounded bg-zinc-100 dark:bg-zinc-900">
                DATABASE <br/> ENCRYPTED
              </li>
              <li className="p-3 border border-[var(--border)] rounded bg-zinc-100 dark:bg-zinc-900">
                ACCESS CONTROL <br/> STRICT
              </li>
            </ul>
          </section>

          {/* Seção 4: Seus Direitos */}
          <section className="border-t border-[var(--border)] pt-8">
            <h2 className="flex items-center gap-3 text-xl font-bold text-zinc-900 dark:text-white uppercase tracking-tight mb-4">
              <span className="text-primary/50">04.</span> Seus Direitos (LGPD)
            </h2>
            <p>
              Você é o dono dos seus dados. A qualquer momento, você pode solicitar o "Dump" (exportação) ou o "Wipe" (exclusão total) de qualquer informação pessoal que tenhamos armazenado via formulário de contato.
            </p>
          </section>

          {/* Footer de Contato */}
          <div className="mt-12 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 p-8 rounded-sm text-center">
            <h3 className="text-2xl font-bold mb-2">Dúvidas sobre o Protocolo?</h3>
            <p className="mb-6 opacity-90">
              Nossa equipe de segurança está pronta para responder qualquer questão técnica ou jurídica.
            </p>
            <Link 
              href="/contato" 
              className="inline-block bg-primary hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-sm transition-colors uppercase tracking-wide text-sm"
            >
              Iniciar Requisição de Privacidade
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}