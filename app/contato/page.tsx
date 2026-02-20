import { Metadata } from "next";
import ContactForm from "@/app/components/ContactForm";

export const metadata: Metadata = {
  title: "Contato Institucional | Vetor Estratégico",
  description:
    "Canal direto com a redação do Vetor Estratégico para pautas, análises, colaborações e assuntos institucionais.",
};

export default function ContatoPage() {
  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      
      {/* Cabeçalho da Página */}
      <div className="max-w-2xl p-4 w-full mb-10 text-center sm:text-left bg-amber-50">
        
        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1  bg-primary/10 text-primary border border-primary/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full  bg-primary opacity-75"></span>
            <span className="relative inline-flex  h-2 w-2 bg-primary"></span>
          </span>
          <span className="text-xs font-bold tracking-wider uppercase">
            Canal Institucional
          </span>
        </div>

        <h1 className="text-4xl font-black text-foreground uppercase tracking-tight">
          Canal <span className="text-primary">Estratégico</span>
        </h1>

        <p className="mt-3 text-foreground/60 leading-relaxed">
          Sugestões de pauta, correções editoriais, colaborações analíticas ou 
          propostas institucionais. O Vetor Estratégico mantém um canal direto 
          para contribuições qualificadas.
        </p>
      </div>

      <ContactForm />

      {/* Rodapé institucional */}
      <div className="mt-14 text-center bg-amber-50 p-1">
        <p className="text-xs text-white font-mono text-foreground/40 uppercase tracking-widest">
          PARA COMUNICAÇÕES SENSÍVEIS OU MATERIAL CONFIDENCIAL:
        </p>
        <p className="text-sm font-semibold text-foreground mt-2">
          vetorestrategico@outlook.com
        </p>
      </div>
    </div>
  );
}
