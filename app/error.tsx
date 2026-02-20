"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold mb-4">Erro ao carregar conteúdo</h2>
      <button onClick={reset} className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700">Tentar novamente</button>
    </div>
  );
}