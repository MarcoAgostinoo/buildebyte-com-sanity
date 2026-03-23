"use client";

import { useState } from "react";
import { FaTelegramPlane, FaWhatsapp, FaBolt } from "react-icons/fa";

export default function LeadCapture() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="my-16 relative bg-[#0a0b0d] border border-[#2a2f3a] overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.8)]">
      
      {/* ── MÁSCARA TÁTICA E GRADIENTE ── */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />
      
      {/* ── LINHA DE SCAN NO TOPO ── */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-primary to-transparent opacity-70" />

      {/* ── CABEÇALHO TÁTICO ── */}
      <div className="bg-[#111318] border-b border-[#2a2f3a] p-6 sm:p-8 relative z-10">
        <div className="flex items-center justify-center gap-3 mb-3">
          <span className="w-2 h-2 bg-red-600 animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.8)]"></span>
          <span className="text-[12px] font-mono font-black tracking-[0.3em] text-red-500 uppercase">
            Acesso Restrito
          </span>
        </div>
        
        <h3 className="text-2xl sm:text-3xl font-black text-zinc-100 uppercase tracking-tight text-center flex items-center justify-center gap-2">
          <FaBolt className="text-primary hidden sm:block" />
          Rede de Inteligência do Vetor
        </h3>
        
        <p className="mt-3 text-sm text-zinc-400 max-w-2xl mx-auto text-center leading-relaxed font-medium">
          Receba relatórios operacionais sobre defesa, tecnologia e infraestrutura crítica diretamente no seu terminal. Análise técnica, sem viés, com foco na soberania nacional.
        </p>
      </div>

      <div className="p-6 sm:p-8 grid md:grid-cols-2 gap-8 md:gap-12 items-center relative z-10">
        
        {/* ── COLUNA 1: CAPTURA DE E-MAIL ── */}
        <div>
          <p className="text-[12px] uppercase tracking-widest text-zinc-500 font-bold mb-4 font-mono border-l-2 border-primary pl-3">
            Insira suas credenciais de contato:
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="email"
                placeholder="Seu e-mail operacional principal..."
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-4 border border-[#2a2f3a] bg-[#05080b] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-zinc-200 placeholder-zinc-700 text-sm font-medium"
              />
              {/* Marcador visual no input */}
              <div className="absolute top-1/2 right-4 -translate-y-1/2 w-1.5 h-1.5 bg-zinc-700 rounded-full" />
            </div>

            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="w-full bg-primary hover:bg-blue-600 text-white font-black py-4 transition-all disabled:opacity-50 uppercase tracking-[0.2em] text-[12px] flex items-center justify-center gap-2 relative overflow-hidden group"
            >
              <div className="absolute inset-0 w-full h-full bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
              <span className="relative z-10">
                {status === "loading"
                  ? "Sincronizando..."
                  : status === "success"
                    ? "Credencial Aprovada!"
                    : "Solicitar Acesso aos Relatórios"}
              </span>
            </button>
            
            {status === "error" && (
              <p className="text-red-500 text-[12px] font-bold uppercase tracking-wider text-center mt-2 font-mono">
                [!] Falha na transmissão. Tente novamente.
              </p>
            )}
          </form>
        </div>

        {/* ── COLUNA 2: COMUNIDADE (CANAIS DIRETOS) ── */}
        <div className="border-t md:border-t-0 md:border-l border-[#2a2f3a] pt-8 md:pt-0 md:pl-8 lg:pl-12">
          <p className="text-[12px] uppercase tracking-widest text-zinc-500 font-bold mb-5 font-mono border-l-2 border-zinc-700 pl-3">
            Conexão em Tempo Real:
          </p>
          
          <div className="space-y-3">
            <a
              href="#"
              className="group flex items-center gap-4 p-4 bg-[#111318] border border-[#2a2f3a] hover:border-[#0088cc] transition-all"
            >
              <div className="bg-[#0088cc]/10 p-2 text-[#0088cc] group-hover:bg-[#0088cc] group-hover:text-white transition-colors">
                <FaTelegramPlane size={20} />
              </div>
              <span className="text-sm font-bold text-zinc-300 uppercase tracking-wider group-hover:text-white transition-colors">
                Canal no Telegram
              </span>
            </a>
            
            <a
              href="#"
              className="group flex items-center gap-4 p-4 bg-[#111318] border border-[#2a2f3a] hover:border-[#25D366] transition-all"
            >
              <div className="bg-[#25D366]/10 p-2 text-[#25D366] group-hover:bg-[#25D366] group-hover:text-white transition-colors">
                <FaWhatsapp size={20} />
              </div>
              <span className="text-sm font-bold text-zinc-300 uppercase tracking-wider group-hover:text-white transition-colors">
                Transmissão via WhatsApp
              </span>
            </a>
          </div>
        </div>

      </div>

      {/* ── MARCADORES DE BORDA TÁTICOS ── */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary/50 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary/50 pointer-events-none" />
    </div>
  );
}