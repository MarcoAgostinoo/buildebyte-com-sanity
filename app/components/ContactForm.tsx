"use client";

import { useState } from "react";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");

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
        setStatus("success");
        (e.target as HTMLFormElement).reset(); // Limpa o formulário
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-(--card-bg) dark:bg-zinc-100/80  border border-(--border) shadow-2xl overflow-hidden backdrop-blur-sm">
      
      {/* Barra de Título estilo "Janela de Sistema" */}
      <div className="bg-amber-50 dark:bg-zinc-800/50 px-4 py-3 border-b border-(--border) flex items-center justify-between">
        <div className="flex gap-2">
          <div className="w-3 h-3  bg-red-500/80"></div>
          <div className="w-3 h-3  bg-yellow-500/80"></div>
          <div className="w-3 h-3  bg-green-500/80"></div>
        </div>
        <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
          contact_daemon.exe
        </div>
        <div className="w-8"></div> {/* Espaçador para centralizar o texto */}
      </div>

      <div className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Nome */}
            <div className="space-y-2">
              <label htmlFor="nome" className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                User.ID (Nome)
              </label>
              <input
                type="text"
                name="nome"
                id="nome"
                required
                className="w-full px-4 py-3  bg-zinc-50 dark:bg-black border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none font-mono text-sm placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                placeholder="Marco Antonio"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Return_Path (E-mail)
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                className="w-full px-4 py-3  bg-zinc-50 dark:bg-black border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none font-mono text-sm placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                placeholder="admin@Vetor Estratégico.com"
              />
            </div>
          </div>

          {/* Mensagem */}
          <div className="space-y-2">
            <label htmlFor="mensagem" className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Payload (Mensagem)
            </label>
            <textarea
              name="mensagem"
              id="mensagem"
              required
              rows={6}
              className="w-full px-4 py-3  bg-zinc-50 dark:bg-black border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none resize-none font-mono text-sm placeholder:text-zinc-400 dark:placeholder:text-zinc-600 leading-relaxed"
              placeholder="// Digite sua mensagem aqui..."
            ></textarea>
          </div>

          {/* Status Messages (Estilo Terminal) */}
          {status === "success" && (
            <div className="p-4  bg-green-900/20 border border-green-900/30 text-green-700 dark:text-green-400 font-mono text-sm flex items-center gap-3">
              <span className="animate-pulse">●</span>
              <span>{`> SUCCESS: PACKET SENT TO SERVER.`}</span>
            </div>
          )}
          
          {status === "error" && (
            <div className="p-4  bg-red-900/20 border border-red-900/30 text-red-700 dark:text-red-400 font-mono text-sm flex items-center gap-3">
              <span>●</span>
              <span>{`> ERROR: CONNECTION REFUSED. RETRY LATER.`}</span>
            </div>
          )}

          {/* Botão de Enviar */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6  bg-zinc-900 dark:bg-white text-white dark:text-black font-bold uppercase tracking-widest text-sm hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-transparent hover:border-primary shadow-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2 font-mono">
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                UPLOADING...
              </span>
            ) : (
              "EXECUTE SEND_DATA()"
            )}
          </button>

        </form>
      </div>
      
      {/* Barra de Status Inferior */}
      <div className="bg-amber-50 dark:bg-zinc-800/50 px-4 py-2 border-t border-(--border) text-[10px] font-mono text-zinc-400 flex justify-between uppercase">
        <span>TLS 1.3 ENCRYPTED</span>
        <span>PORT: 443</span>
      </div>
    </div>
  );
}