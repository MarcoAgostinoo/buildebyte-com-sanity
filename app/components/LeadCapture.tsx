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
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <div className="my-12 border border-zinc-200 overflow-hidden shadow-lg bg-amber-50">
      {/* Cabeçalho Chamativo (Headline Quente) */}
      {/* Nota: O header já usava cores fixas (bg-primary, text-white), então ele já era imune ao tema */}
      <div className="bg-primary p-6 text-center">
        <h3 className="text-2xl font-black text-white uppercase tracking-tight flex items-center justify-center gap-2">
          <FaBolt className="text-yellow-300" />
          Não perca o próximo insight
        </h3>
        <p className="mt-2 font-medium" style={{ color: "#FFFFFF" }}>
  Receba nossa newsletter semanal uma vez por semana, direto no seu
  e-mail. Conteúdo exclusivo, dicas práticas e as últimas novidades do
  mundo da engenharia de software.
</p>
      </div>

      <div className="p-8 grid md:grid-cols-2 gap-8 items-center">
        {/* Coluna 1: Email (Lead) */}
        <div>
          <p className="text-zinc-600 mb-4 text-sm font-medium">
            Junte-se a nossa comunidade de engenheiros e entusiastas.
          </p>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              placeholder="Seu melhor e-mail profissional"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              // Removido dark:border-zinc-700 e dark:bg-zinc-950
              className="w-full px-4 py-3  border border-zinc-300 bg-zinc-50 focus:ring-2 focus:ring-primary outline-none transition-all text-zinc-900"
            />
            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              // Removido dark:bg-white e dark:text-zinc-900. Mantido o estilo original dark (preto com texto branco)
              className="w-full bg-zinc-900 text-white font-bold py-3  hover:opacity-90 transition-opacity disabled:opacity-50 uppercase tracking-wide text-sm"
            >
              {status === "loading"
                ? "Processando..."
                : status === "success"
                  ? "Inscrito com Sucesso!"
                  : "Quero Acesso Exclusivo"}
            </button>
            {status === "error" && (
              <p className="text-red-500 text-xs">
                Erro ao inscrever. Tente novamente.
              </p>
            )}
          </form>
        </div>

        {/* Coluna 2: Grupos (Comunidade) */}
        <div className="border-t md:border-t-0 md:border-l border-zinc-200 pt-6 md:pt-0 md:pl-8">
          {/* Removido dark:text-white */}
          <p className="text-zinc-900 font-bold mb-4 uppercase text-sm">
            Ou entre direto na fonte:
          </p>
          <div className="space-y-3">
            {/* Removido dark:bg-blue-900/20 dark:text-blue-400 etc */}
            <a
              href="#"
              className="flex items-center gap-3 p-3  bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors font-bold text-sm"
            >
              <FaTelegramPlane size={20} /> Canal no Telegram
            </a>
            {/* Removido dark:bg-green-900/20 dark:text-green-400 etc */}
            <a
              href="#"
              className="flex items-center gap-3 p-3  bg-green-50 text-green-600 hover:bg-green-100 transition-colors font-bold text-sm"
            >
              <FaWhatsapp size={20} /> Grupo VIP WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
