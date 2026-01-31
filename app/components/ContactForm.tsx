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
    <div className="w-full max-w-2xl mx-auto p-8 bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl">
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Fale Conosco
      </h2>
      <p className="mb-8 text-gray-600 dark:text-gray-400">
        Tem alguma sugestão de pauta ou quer anunciar no Buildebite? Mande sua mensagem.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nome */}
        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Seu Nome
          </label>
          <input
            type="text"
            name="nome"
            id="nome"
            required
            className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            placeholder="Marco Antonio"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Seu E-mail
          </label>
          <input
            type="email"
            name="email"
            id="email"
            required
            className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            placeholder="voce@exemplo.com"
          />
        </div>

        {/* Mensagem */}
        <div>
          <label htmlFor="mensagem" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Mensagem
          </label>
          <textarea
            name="mensagem"
            id="mensagem"
            required
            rows={5}
            className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
            placeholder="Escreva sua mensagem aqui..."
          ></textarea>
        </div>

        {/* Botão de Enviar */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 px-6 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-lg shadow-lg hover:shadow-blue-500/30 transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Enviando...
            </span>
          ) : (
            "Enviar Mensagem"
          )}
        </button>

        {/* Mensagens de Sucesso/Erro */}
        {status === "success" && (
          <div className="p-4 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-center font-medium animate-in fade-in slide-in-from-bottom-2">
            ✅ Mensagem enviada com sucesso! Entraremos em contato em breve.
          </div>
        )}
        {status === "error" && (
          <div className="p-4 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-center font-medium animate-in fade-in slide-in-from-bottom-2">
            ❌ Ocorreu um erro ao enviar. Tente novamente mais tarde.
          </div>
        )}
      </form>
    </div>
  );
}
