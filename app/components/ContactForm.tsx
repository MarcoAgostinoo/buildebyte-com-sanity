"use client";

import { useState, useMemo } from "react";

// --- Subcomponente de Efeitos Especiais Cinematográficos ---
function CinematicExplosionFX() {
  // Fagulhas mais densas e com useMemo para não recalcular durante o resfriamento
  const sparks = useMemo(() => {
    return Array.from({ length: 45 }).map((_, i) => {
      const angle = Math.random() * 360;
      const distance = 100 + Math.random() * 250; 
      const tx = Math.cos((angle * Math.PI) / 180) * distance;
      const ty = Math.sin((angle * Math.PI) / 180) * distance;
      const size = 2 + Math.random() * 5;
      return { id: i, tx, ty, size, delay: Math.random() * 0.15 };
    });
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none overflow-visible isolate">
      
      {/* FILTRO SVG INVISÍVEL para a textura realista do fogo */}
      <svg style={{ display: 'none' }}>
        <defs>
          <filter id="fire-filter">
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="4" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="35" />
          </filter>
        </defs>
      </svg>
      
      {/* Camada 1: Clarão Cegante (Ignition Flash) */}
      <div className="absolute z-40 w-[250%] h-[300%] bg-white rounded-full mix-blend-overlay animate-cinematic-flash blur-lg"></div>

      {/* Camada 2: Onda de Choque Sônica (Esférica) */}
      <div className="absolute z-30 w-16 h-16 border-[15px] rounded-full animate-cinematic-shockwave box-content shadow-[0_0_40px_rgba(255,200,100,0.8)]"></div>

      {/* Camada 3: Anel de Energia (Plano horizontal 3D) */}
      <div className="absolute z-30 w-16 h-16 rounded-full border-[4px] border-orange-300/80 animate-cinematic-ring mix-blend-screen" style={{ animationDelay: '0.05s' }}></div>

      {/* Camada 4: O Núcleo de Plasma (Fireball) com Textura de Turbulência */}
      <div className="absolute z-20 w-32 h-32 rounded-full animate-cinematic-fireball turbulence-fire mix-blend-hard-light"></div>

      {/* Camada 5: Nuvem de Calor / Fumaça Secundária */}
      <div className="absolute z-10 w-48 h-48 bg-orange-600/50 rounded-full blur-3xl animate-cinematic-fireball" style={{ animationDelay: '0.1s', animationDuration: '1.5s' }}></div>
      
      {/* Camada 6: Detritos Incandescentes (Sparks) */}
      {sparks.map((spark) => (
        <div
          key={spark.id}
          className={`absolute rounded-full mix-blend-screen ${Math.random() > 0.5 ? 'bg-yellow-100 shadow-[0_0_12px_4px_#fbbf24]' : 'bg-orange-100 shadow-[0_0_12px_4px_#ea580c]'}`}
          style={{
            width: `${spark.size}px`,
            height: `${spark.size}px`,
            // @ts-expect-error - Variáveis CSS customizadas
            "--tx": `${spark.tx}px`,
            "--ty": `${spark.ty}px`,
            animation: `cinematic-spark 0.8s cubic-bezier(0.1, 0.8, 0.2, 1) forwards ${spark.delay}s`
          }}
        ></div>
      ))}
    </div>
  );
}


// --- Componente Principal do Formulário ---
export default function ContactForm() {
  // Adicionado o estado 'imploding' para a sobrecarga do botão
  const [status, setStatus] = useState<"idle" | "loading" | "imploding" | "exploding" | "success" | "error">("idle");

  const isBusy = ["loading", "imploding", "exploding", "success"].includes(status);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const formData = new FormData(e.currentTarget);
    const data = {
      nome: formData.get("nome"),
      email: formData.get("email"),
      mensagem: formData.get("mensagem"),
    };

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // 1. Inicia a sobrecarga (o botão treme e encolhe)
        setStatus("imploding"); 
        
        // 2. Após 500ms, o botão colapsa e detona
        setTimeout(() => {
          setStatus("exploding");
          
          // 3. Após 1.2s de explosão, a mensagem emerge enquanto a fumaça limpa
          setTimeout(() => {
            setStatus("success");
            (e.target as HTMLFormElement).reset();
          }, 1200);

        }, 500);
        
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-transparent relative">
      
      {/* Tremor de câmera aplicado durante a explosão central */}
      <div className={`bg-(--card-bg) border border-(--border) relative overflow-hidden transition-all duration-300 ${status === "exploding" ? 'animate-camera-shake border-red-500/50 shadow-[0_0_50px_rgba(239,68,68,0.3)]' : ''}`}>
        
        <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>

        <div className="bg-primary/5 px-4 sm:px-6 py-4 border-b border-(--border) flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 bg-red-500"></span>
            </span>
            <span className="text-xs font-mono text-foreground uppercase tracking-[0.2em] font-bold">
              // CANAL DE UPLINK TÁTICO //
            </span>
          </div>
          <div className="text-[9px] font-mono text-primary/70 uppercase tracking-widest hidden sm:block">
            Acesso Autorizado Nível 3
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2 relative group">
                <label htmlFor="nome" className="block text-[10px] font-black uppercase tracking-[0.15em] text-foreground/60 border-l-2 border-primary pl-2">
                  Identificação do Operador
                </label>
                <input
                  type="text"
                  name="nome"
                  id="nome"
                  required
                  className="w-full px-4 py-3 bg-background/50 border border-(--border) text-foreground focus:ring-0 focus:border-primary transition-colors outline-none font-mono text-sm placeholder:text-foreground/20 disabled:opacity-50"
                  placeholder="Ex: Agente Silva"
                  disabled={isBusy}
                />
              </div>

              <div className="space-y-2 relative">
                <label htmlFor="email" className="block text-[10px] font-black uppercase tracking-[0.15em] text-foreground/60 border-l-2 border-primary pl-2">
                  Vetor de Resposta (E-mail)
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  className="w-full px-4 py-3 bg-background/50 border border-(--border) text-foreground focus:ring-0 focus:border-primary transition-colors outline-none font-mono text-sm placeholder:text-foreground/20 disabled:opacity-50"
                  placeholder="comms@vetorestrategico.com"
                  disabled={isBusy}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-end border-l-2 border-primary pl-2 mb-2">
                <label htmlFor="mensagem" className="block text-[10px] font-black uppercase tracking-[0.15em] text-foreground/60">
                  Relatório de Situação (SITREP)
                </label>
                <span className="text-[9px] font-mono text-red-500/80 uppercase tracking-widest hidden sm:block font-bold">
                  Omitir Dados Críticos
                </span>
              </div>
              <textarea
                name="mensagem"
                id="mensagem"
                required
                rows={5}
                className="w-full px-4 py-3 bg-background/50 border border-(--border) text-foreground focus:ring-0 focus:border-primary transition-colors outline-none resize-none font-mono text-sm placeholder:text-foreground/20 leading-relaxed disabled:opacity-50"
                placeholder="> INSERIR DADOS DA OPERAÇÃO AQUI..."
                disabled={isBusy}
              ></textarea>
            </div>

            {status === "error" && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 font-mono text-xs sm:text-sm flex items-center gap-3">
                <span>●</span>
                <span>{`> FALHA NA TRANSMISSÃO: INTERFERÊNCIA DETECTADA. TENTE NOVAMENTE.`}</span>
              </div>
            )}

            <div className="pt-2 relative h-14 overflow-visible isolate z-50">
              
              {/* Note que a explosão fica renderizada no "success" para não sumir do nada enquanto esfria */}
              {(status === "exploding" || status === "success") && <CinematicExplosionFX />}

              {/* Botão de Sucesso (Clicável para resetar o form se quiser mandar outro) */}
              {status === "success" && (
                 <div 
                   onClick={() => setStatus("idle")}
                   className="absolute inset-0 w-full h-full bg-emerald-900/90 border-2 border-emerald-500 text-emerald-300 font-black uppercase tracking-[0.15em] text-sm flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(16,185,129,0.5)] animate-in fade-in zoom-in-50 duration-700 z-50 backdrop-blur-md cursor-pointer hover:bg-emerald-800 transition-colors"
                 >
                    <svg className="w-6 h-6 text-emerald-400 filter drop-shadow-[0_0_5px_rgba(52,211,153,0.8)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    MENSAGEM ENVIADA COM SUCESSO
                 </div>
              )}

              {/* Botão de Envio / Loading / Implodindo */}
              {status !== "success" && status !== "exploding" && (
                <button
                  type="submit"
                  disabled={isBusy}
                  className={`absolute inset-0 w-full h-full text-white font-black uppercase tracking-[0.2em] text-sm transition-all duration-150 flex items-center justify-center group z-0
                    ${status === "imploding" ? "animate-button-implode bg-red-600 pointer-events-none" : "bg-primary hover:bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.15)] hover:shadow-[0_0_25px_rgba(37,99,235,0.3)]"} 
                    ${status === "loading" ? "opacity-80 cursor-not-allowed" : ""}
                  `}
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {status === "loading" && (
                      <>
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        CRIPTOGRAFANDO DADOS...
                      </>
                    )}
                    {status === "idle" && (
                      <>
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                        </svg>
                        TRANSMITIR RELATÓRIO SEGURO
                      </>
                    )}
                    {status === "imploding" && (
                      <span className="text-red-100 animate-pulse flex items-center gap-2">
                        <svg className="w-5 h-5 animate-spin text-red-300" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        SOBRECARGA DO NÚCLEO...
                      </span>
                    )}
                  </span>
                </button>
              )}
            </div>

          </form>
        </div>
        
        <div className="bg-primary/5 px-4 sm:px-6 py-3 border-t border-(--border) text-[10px] font-mono text-foreground/40 flex justify-between uppercase tracking-widest">
          <span>STATUS: CRIPTOGRAFADO (AES-256)</span>
          <span className="hidden sm:block">LATÊNCIA: 14ms</span>
        </div>
      </div>
    </div>
  );
}