import { Metadata } from "next";
import ContactForm from "@/app/components/ContactForm";

export const metadata: Metadata = {
  title: "Contato & Suporte | Build-e-Byte",
  description: "Canal direto com a redação e suporte técnico do Build-e-Byte.",
};

export default function ContatoPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      
      {/* Cabeçalho da Página */}
      <div className="max-w-2xl w-full mb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span className="text-xs font-mono font-bold tracking-wider uppercase">
            Canal Aberto
          </span>
        </div>
        <h1 className="text-4xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">
          Iniciar <span className="text-primary">Protocolo</span>
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Sugestão de pauta, erro técnico ou parceria comercial? O log está aberto.
        </p>
      </div>

      <ContactForm />
      
      {/* Rodapé de contato secundário */}
      <div className="mt-12 text-center">
        <p className="text-xs font-mono text-zinc-500">
          PREFERE CRIPTOGRAFIA? ENVIE PGP KEY PARA <span className="text-zinc-900 dark:text-zinc-300">security@Vetor Estratégico.com</span>
        </p>
      </div>
    </div>
  );
}