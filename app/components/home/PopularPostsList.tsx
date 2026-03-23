import Link from "next/link";
import Image from "next/image";
import { CategoryWithPosts } from "@/app/lib";

type Post = CategoryWithPosts["posts"][number];

export default function PopularPostsList({ posts }: { posts: Post[] }) {
  return (
    <div className="flex flex-col h-full bg-[#0a0b0d] border border-[#2a2f3a] shadow-lg relative overflow-hidden">
      
      {/* HEADER TÁTICO */}
      <div className="p-5 border-b border-[#2a2f3a] bg-[#111318] flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 bg-primary animate-pulse shadow-[0_0_8px_rgba(var(--primary-rgb),0.8)]"></span>
          <h2 className="font-black uppercase tracking-[0.2em] text-zinc-100 text-sm sm:text-base">
            Top <span className="text-primary">Decodificações</span>
          </h2>
        </div>
        {/* Barras de Sinal */}
        <div className="flex items-end gap-1">
          {[4, 6, 8, 10, 12].map((h, i) => (
            <div 
              key={i} 
              className="w-1 bg-primary" 
              style={{ height: `${h}px`, opacity: 0.3 + i * 0.15 }} 
            />
          ))}
        </div>
      </div>

      {/* LISTA DE POSTS */}
      <div className="flex flex-col flex-1 divide-y divide-[#2a2f3a] relative z-10">
        {posts.map((post, index) => (
          <Link
            key={post._id}
            href={`/artigo/${post.slug}`}
            className="group flex items-stretch gap-4 p-4 hover:bg-[#111318] transition-colors relative overflow-hidden"
          >
            {/* Index Numérico (Estilo Terminal) */}
            <div className="flex items-center justify-center shrink-0 w-8 border-r border-[#2a2f3a]/50 pr-4">
              <span className="font-mono font-black text-xl sm:text-2xl text-zinc-700 group-hover:text-primary transition-colors">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            {/* Thumbnail */}
            {post.imagem && (
              <div className="relative w-20 shrink-0 aspect-video border border-[#2a2f3a] overflow-hidden">
                <Image
                  src={post.imagem}
                  alt={post.title}
                  fill
                  sizes="80px"
                  className="object-cover grayscale-50 group-hover:grayscale-0 transition-all duration-500 sepia-[.2] group-hover:scale-105"
                />
              </div>
            )}

            {/* Textos */}
            <div className="flex flex-col justify-center flex-1 min-w-0">
              {post.pillar && (
                <span className="text-[12px] font-black uppercase tracking-widest text-primary/70 mb-1.5 line-clamp-1 font-mono">
                  [{post.pillar}]
                </span>
              )}
              <h3 className="font-bold text-zinc-300 text-sm leading-snug line-clamp-2 group-hover:text-white transition-colors">
                {post.title}
              </h3>
            </div>
            
            {/* Seta de Ação */}
            <div className="flex items-center shrink-0 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
              <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      {/* CTA INFERIOR */}
      <div className="p-4 border-t border-[#2a2f3a] bg-[#05080b]">
        <Link
          href="/radar"
          className="flex items-center justify-center w-full gap-2 text-[12px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-primary transition-colors py-2"
        >
          Acessar Arquivo Completo <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
      
    </div>
  );
}