import { Metadata } from "next";
import ContactForm from "@/app/components/ContactForm";
import InteractiveTank from "@/app/components/InteractiveTank"; // Importamos o tanque

export const metadata: Metadata = {
  title: "Contato Institucional | Vetor Estratégico",
  description:
    "Canal direto com a redação do Vetor Estratégico para pautas, análises, colaborações e assuntos institucionais.",
};

export default function ContatoPage() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 flex flex-col items-center">
      {/* Cabeçalho da Página */}
      <div className="w-full mb-10 text-center sm:text-left bg-(--card-bg) border border-(--border) p-8 sm:p-12 shadow-sm relative -mt-10 pt-16">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
        
        <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 bg-primary/10 text-primary border border-primary/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full bg-primary opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 bg-primary"></span>
          </span>
          <span className="text-[10px] font-black tracking-[0.2em] uppercase">
            Canal Institucional
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-foreground uppercase tracking-tighter mb-4">
          Contato <span className="text-primary">Estratégico</span>
        </h1>

        <div className="w-12 h-1 bg-primary mb-6 mx-auto sm:mx-0" />

        <p className="text-lg text-foreground/70 leading-relaxed max-w-2xl">
          Sugestões de pauta, correções editoriais, colaborações analíticas ou 
          propostas institucionais. O Vetor Estratégico mantém um canal direto 
          para contribuições qualificadas.
        </p>
      </div>
      {/* A Animação do Tanque */}
      <div className="mb-4 z-10">
        <InteractiveTank />
      </div>

      {/* Container do Formulário */}
      <div className="w-full bg-(--card-bg) border border-(--border) p-6 sm:p-10 shadow-sm">
        <ContactForm />
      </div>

      {/* Rodapé institucional / Comunicação Sensível */}
      <div className="mt-12 w-full max-w-2xl text-center bg-primary/5 border border-primary/20 p-6 sm:p-8">
        <p className="text-[10px] font-mono text-primary/80 uppercase tracking-[0.2em] mb-3 flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Protocolo de Segurança
        </p>
        <p className="text-xs text-foreground/50 uppercase tracking-widest mb-4">
          Para comunicações sensíveis ou envio de material confidencial:
        </p>
        <a 
          href="mailto:vetorestrategico@outlook.com" 
          className="text-lg sm:text-xl font-black text-foreground hover:text-primary transition-colors tracking-wide"
        >
          vetorestrategico@outlook.com
        </a>
      </div>
    </div>
  );
}