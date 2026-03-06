"use client";

import { useState, useLayoutEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState("");

  useLayoutEffect(() => {
    setCurrentDate( // eslint-disable-line react-hooks/set-state-in-effect
      new Date().toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit", // Mudei para número para ficar mais "tático" e curto
        year: "numeric",
      }),
    );
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      {/* TOP BAR - TACTICAL TICKER */}
      {/* Fundo ultra escuro, fonte monoespaçada para dar cara de "terminal" de dados */}
      <div className="w-full bg-[#05080b] text-zinc-500 text-[10px] md:text-xs border-b border-zinc-800/80 font-mono">
        <div className="max-w-7xl mx-auto px-4 h-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-red-700 animate-pulse"></span>
            <span className="uppercase tracking-widest">{currentDate || "SYNCING..."}</span>
          </div>
          <span className="uppercase tracking-[0.2em] hidden md:block text-zinc-400 font-bold">
            Defesa <span className="text-red-700 mx-1">•</span> Inteligência <span className="text-red-700 mx-1">•</span> Poder
          </span>
        </div>
      </div>

      {/* HEADER PRINCIPAL */}
      <header className="sticky top-0 z-50 bg-[#0b0f14] border-b-2 border-zinc-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center justify-between h-20 md:h-24">
            
            {/* BRANDING / LOGO */}
            <Link
              href="/"
              className="flex items-center gap-3 md:gap-4 group"
              onClick={closeMenu}
            >
              <div className="relative">
                {/* Efeito de "mira" ou caixa ao redor do logo */}
                <div className="absolute inset-0 border border-zinc-700/50 group-hover:border-zinc-500 transition-colors duration-300"></div>
                <Image
                  src="/logo.webp"
                  width={200}
                  height={200}
                  alt="Vetor Estratégico"
                  priority
                  className="w-12 h-12 md:w-16 md:h-16 object-contain p-1 relative z-10"
                />
              </div>

              <div className="flex flex-col leading-none justify-center">
                <span className="text-lg md:text-2xl font-black text-white tracking-widest uppercase mb-1">
                  Vetor Estratégico
                </span>
                <span className="hidden sm:block text-[10px] md:text-xs text-zinc-500 tracking-[0.3em] uppercase font-bold">
                  Análise de Impacto Sistêmico
                </span>
              </div>
            </Link>

            {/* BOTÃO MOBILE */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
              className="md:hidden text-zinc-300 hover:text-white cursor-pointer text-2xl focus:outline-none w-10 h-10 flex items-center justify-center border border-zinc-800 bg-zinc-900/50"
            >
              {isMenuOpen ? "✕" : "☰"}
            </button>

            {/* MENU DESKTOP */}
            <div className="hidden md:flex items-center gap-8 text-sm font-bold tracking-[0.15em] uppercase">
              <NavItem href="/" label="Início" />
              <NavItem href="/destaques" label="Destaques" />
              {/* Radar em destaque vermelho */}
              <NavItem href="/radar" label="Radar" isSpecial /> 
              <NavItem href="/categorias" label="Categorias" />
              <NavItem href="/videos" label="Vídeos" />
              <NavItem href="/contato" label="Contato" />
            </div>
          </nav>

          {/* MENU MOBILE */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-zinc-800 bg-[#0b0f14] absolute left-0 w-full shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex flex-col px-4 py-4 uppercase font-bold tracking-widest text-sm">
                <MobileNavItem href="/" label="Início" onClick={closeMenu} />
                <MobileNavItem href="/destaques" label="Destaques" onClick={closeMenu} />
                <MobileNavItem href="/radar" label="Radar" onClick={closeMenu} isSpecial />
                <MobileNavItem href="/categorias" label="Categorias" onClick={closeMenu} />
                <MobileNavItem href="/videos" label="Vídeos" onClick={closeMenu} />
                <MobileNavItem href="/contato" label="Contato" onClick={closeMenu} />
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}

// Componente para Links Desktop
function NavItem({
  href,
  label,
  isSpecial = false,
}: {
  href: string;
  label: string;
  isSpecial?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`
        relative py-2 transition-colors duration-300
        ${isSpecial ? "text-red-500 hover:text-red-400" : "text-zinc-400 hover:text-white"}
        after:content-[''] after:absolute after:left-0 after:-bottom-1
        after:w-0 after:h-[2px] after:transition-all after:duration-300
        hover:after:w-full
        ${isSpecial ? "after:bg-red-500" : "after:bg-white"}
      `}
    >
      {label}
    </Link>
  );
}

// Componente para Links Mobile (Com visual de lista de comando)
function MobileNavItem({
  href,
  label,
  onClick,
  isSpecial = false,
}: {
  href: string;
  label: string;
  onClick: () => void;
  isSpecial?: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
        block w-full py-4 border-b border-zinc-800/50 
        transition-colors duration-200
        ${isSpecial ? "text-red-500" : "text-zinc-400 hover:text-white"}
        hover:bg-zinc-900/40 hover:pl-2
        border-l-2 border-transparent hover:border-l-2 hover:border-red-700
      `}
    >
      {label}
    </Link>
  );
}