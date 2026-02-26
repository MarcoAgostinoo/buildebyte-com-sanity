"use client"; // Necessário pois agora usamos hooks de estado e ciclo de vida do React

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const[currentDate, setCurrentDate] = useState("");

  // Resolve o problema de Hydration Mismatch do Next.js
  useEffect(() => {
    setCurrentDate(
      new Date().toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    );
  },[]);

  // Função para fechar o menu mobile ao clicar em um link
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      {/* TOP BAR */}
      <div className="w-full bg-black text-zinc-400 text-xs border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 h-8 flex items-center justify-between">
          {/* Mostra a data apenas quando renderizado no cliente (evita flash vazio) */}
          <span className="capitalize">{currentDate || "Carregando..."}</span>
          <span className="uppercase tracking-widest hidden md:block">
            Inteligência • Defesa • Tecnologia
          </span>
        </div>
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-[#0b0f14] border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center justify-between h-16">
            
            {/* LOGO */}
            <Link href="/" className="flex items-center gap-3" onClick={closeMenu}>
              <Image
                src="/logo.webp"
                width={80}
                height={80}
                alt="Vetor Estratégico"
                priority
              />
              <div className="flex flex-col leading-tight">
                <span className="text-lg font-bold text-white tracking-wide">
                  VETOR ESTRATÉGICO
                </span>
                <span className="text-xs text-zinc-400 tracking-widest uppercase">
                  Análise de Impacto Sistêmico
                </span>
              </div>
            </Link>

            {/* BOTÃO MOBILE (Substituído o <label> por um <button> acessível) */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
              className="md:hidden text-white cursor-pointer text-2xl focus:outline-none"
            >
              {isMenuOpen ? "✕" : "☰"}
            </button>

            {/* MENU DESKTOP */}
            <div className="hidden md:flex items-center gap-10 text-base font-extrabold tracking-widest uppercase[font-family:var(--font-oswald)]">
              <NavItem href="/" label="INÍCIO" />
              <NavItem href="/destaques" label="DESTAQUES" />
              <NavItem href="/noticias" label="NOTÍCIAS" />
              <NavItem href="/tecnologia" label="TECNOLOGIA" />
              <NavItem href="/videos" label="VÍDEOS" />
              <NavItem href="/contato" label="CONTATO" />
            </div>
          </nav>

          {/* MENU MOBILE (Agora renderizado condicionalmente com React) */}
          {isMenuOpen && (
            <div className="md:hidden pb-6 pt-4 border-t border-zinc-800 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex flex-col gap-6 text-base font-extrabold tracking-widest uppercase[font-family:var(--font-oswald)]">
                <NavItem href="/" label="INÍCIO" onClick={closeMenu} />
                <NavItem href="/destaques" label="DESTAQUES" onClick={closeMenu} />
                <NavItem href="/noticias" label="NOTÍCIAS" onClick={closeMenu} />
                <NavItem href="/tecnologia" label="TECNOLOGIA" onClick={closeMenu} />
                <NavItem href="/videos" label="VÍDEOS" onClick={closeMenu} />
                <NavItem href="/contato" label="CONTATO" onClick={closeMenu} />
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}

// Atualizado para receber onClick (útil para fechar o menu mobile)
function NavItem({ href, label, onClick }: { href: string; label: string; onClick?: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="
        text-white
        relative
        transition-colors
        duration-200
        hover:text-blue-500
        after:content-['']
        after:absolute
        after:left-0
        after:-bottom-1
        after:w-0
        after:h-[4px]
        after:bg-red-600
        after:transition-all
        hover:after:w-full
      "
    >
      {label}
    </Link>
  );
}