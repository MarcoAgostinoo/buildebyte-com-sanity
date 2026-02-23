"use client";

import { useEffect, useState } from "react";

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
}

export default function VideosPage() {
  const [todosVideos, setTodosVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  
  const VIDEOS_POR_PAGINA = 10;

  useEffect(() => {
    async function carregarVideos() {
      setLoading(true);
      try {
        // Para ambiente de produção, adicione sua chave no arquivo .env.local
        // NEXT_PUBLIC_YOUTUBE_API_KEY=sua_chave_aqui
        const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
        
        // ID Oficial do canal Vetor Estratégico extraído do YouTube
        const CHANNEL_ID = "UCuPL6GzSekRpgFU8MXO34Vw"; 

        if (!API_KEY) {
          console.warn("Chave de API do YouTube não encontrada. Carregando modo de visualização (Mock).");
          gerarVideosMock();
          return;
        }

        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=50&type=video`
        );

        if (!res.ok) throw new Error("Falha ao buscar vídeos da API");

        const data = await res.json();
        const formatado: Video[] = data.items.map((item: any) => ({
          id: item.id.videoId,
          title: item.snippet.title.replace(/&quot;/g, '"').replace(/&#39;/g, "'"),
          thumbnail: item.snippet.thumbnails.high.url,
          publishedAt: item.snippet.publishedAt,
        }));

        setTodosVideos(formatado);
      } catch (error) {
        console.error("Erro ao carregar vídeos:", error);
        gerarVideosMock(); // Fallback de segurança para não quebrar a tela
      } finally {
        setLoading(false);
      }
    }

    carregarVideos();
  }, []);

  // Função para gerar dados falsos caso você ainda não tenha gerado sua API Key no Google Cloud
  const gerarVideosMock = () => {
    const mocks = Array.from({ length: 24 }).map((_, i) => ({
      id: `mock-${i}`,
      title: `Análise Estratégica: Movimentações Geopolíticas e Impacto Global #${i + 1}`,
      thumbnail: "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=800&auto=format&fit=crop",
      publishedAt: new Date(Date.now() - i * 86400000 * 3).toISOString(),
    }));
    setTodosVideos(mocks);
  };

  // Lógica de Paginação
  const indexOfLastVideo = currentPage * VIDEOS_POR_PAGINA;
  const indexOfFirstVideo = indexOfLastVideo - VIDEOS_POR_PAGINA;
  const currentVideos = todosVideos.slice(indexOfFirstVideo, indexOfLastVideo);
  const totalPages = Math.ceil(todosVideos.length / VIDEOS_POR_PAGINA);

  const formatarData = (dataIso: string) => {
    return new Date(dataIso).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-6 sm:p-12 md:p-24text-zinc-100 font-sans">
      <div className="w-full max-w-6xl flex flex-col gap-10">
        
        {/* Cabeçalho da Página */}
        <div className="border-b border-zinc-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-red-600 text-sm font-mono font-bold tracking-widest uppercase mb-2">
              Arquivo de Inteligência
            </div>
            <h1 className="text-4xl font-bold text-amber-50 tracking-tight">Relatórios em Vídeo</h1>
          </div>
          <div className="text-zinc-500 font-mono text-sm">
            Total catalogado: {todosVideos.length}
          </div>
        </div>

        {/* Grid de Cards */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-zinc-900/50 rounded border border-zinc-800 aspect-video" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentVideos.map((video) => (
              <a
                key={video.id}
                href={`https://www.youtube.com/watch?v=${video.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col bg-zinc-950 border border-zinc-800 hover:border-red-600 transition-all duration-300 rounded overflow-hidden shadow-lg"
              >
                {/* Thumbnail com efeito hover */}
                <div className="relative aspect-video overflow-hidden bg-zinc-900">
                  {/* Utilizado tag img padrão para evitar configuração de domínios no next.config.js */}
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="object-cover w-full h-full group-hover:scale-105 group-hover:opacity-60 transition-all duration-500"
                  />
                  {/* Ícone de Play centralizado no hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-red-600 text-white rounded-full p-3 shadow-[0_0_15px_rgba(220,38,38,0.6)]">
                      <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Conteúdo do Card */}
                <div className="p-4 flex flex-col flex-grow justify-between gap-4">
                  <h3 className="font-semibold text-zinc-200 line-clamp-2 leading-snug group-hover:text-red-400 transition-colors">
                    {video.title}
                  </h3>
                  <div className="text-xs text-zinc-500 font-mono flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-zinc-700 group-hover:bg-red-600 transition-colors" />
                    {formatarData(video.publishedAt)}
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Paginação (1, 2, 3...) */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8 font-mono">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-zinc-800 bg-zinc-950 text-zinc-400 disabled:opacity-30 hover:border-red-600 hover:text-white transition-colors"
            >
              &lt;
            </button>
            
            {Array.from({ length: totalPages }).map((_, idx) => {
              const numPagina = idx + 1;
              return (
                <button
                  key={numPagina}
                  onClick={() => setCurrentPage(numPagina)}
                  className={`w-10 h-10 flex items-center justify-center border transition-colors ${
                    currentPage === numPagina
                      ? "border-red-600 bg-red-600/10 text-red-500"
                      : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-red-600 hover:text-white"
                  }`}
                >
                  {numPagina}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-zinc-800 bg-zinc-950 text-zinc-400 disabled:opacity-30 hover:border-red-600 hover:text-white transition-colors"
            >
              &gt;
            </button>
          </div>
        )}

      </div>
    </main>
  );
}