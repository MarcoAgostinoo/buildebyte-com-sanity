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
        month: "2-digit",
        year: "numeric",
      }),
    );
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      {/* TOP BAR - TACTICAL TICKER (Mantido conforme seu original) */}
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

      {/* HEADER PRINCIPAL - Estilo do site de referência */}
      {/* Alterado para fundo branco e borda suave */}
      <header className="sticky top-0 z-50 bg-white border-b-2 border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center justify-between h-20 md:h-24">
            
            {/* BRANDING / LOGO */}
            <Link
              href="/"
              className="flex items-center gap-3 md:gap-4 group"
              onClick={closeMenu}
            >
              <div className="relative">
                <Image
                  src="/logo.webp"
                  width={200}
                  height={200}
                  alt="Vetor Estratégico"
                  priority
                  sizes="(max-width: 768px) 48px, 64px"
                  className="w-12 h-12 md:w-16 md:h-16 object-contain relative z-10"
                />
              </div>

              <div className="flex flex-col leading-none justify-center">
                {/* Alterado para texto preto */}
                <span className="text-lg md:text-2xl font-black text-black tracking-widest uppercase mb-1">
                  Vetor Estratégico
                </span>
                <span className="hidden sm:block text-[10px] md:text-xs text-gray-500 tracking-[0.3em] uppercase font-bold">
                  Análise de Impacto Sistêmico
                </span>
              </div>
            </Link>

            {/* BOTÃO MOBILE */}
            {/* Adaptado para o tema claro */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
              className="md:hidden text-black hover:text-gray-600 cursor-pointer text-2xl focus:outline-none w-10 h-10 flex items-center justify-center border border-gray-200 bg-gray-50 rounded"
            >
              {isMenuOpen ? "✕" : "☰"}
            </button>

            {/* MENU DESKTOP */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-bold uppercase">
              <NavItem href="/" label="Início" isActive /> {/* isActive simula o "HOME" sublinhado da imagem */}
              <NavItem href="/destaques" label="Destaques" />
              <NavItem href="/radar" label="Radar" isSpecial /> 
              <NavItem href="/eixos" label="Eixos" />
              <NavItem href="/videos" label="Vídeos" />
              <NavItem href="/concursos" label="Concursos" />
              <NavItem href="/contato" label="Contato" />
              
              {/* Ícone de busca idêntico à referência */}
              <button aria-label="Buscar" className="ml-2 text-black hover:text-gray-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
            </div>
          </nav>

          {/* MENU MOBILE */}
          {/* Adaptado para o tema claro */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 bg-white absolute left-0 w-full shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex flex-col px-4 py-4 uppercase font-bold text-sm">
                <MobileNavItem href="/" label="Início" onClick={closeMenu} />
                <MobileNavItem href="/destaques" label="Destaques" onClick={closeMenu} />
                <MobileNavItem href="/radar" label="Radar" onClick={closeMenu} isSpecial />
                <MobileNavItem href="/eixos" label="Eixos" onClick={closeMenu} />
                <MobileNavItem href="/videos" label="Vídeos" onClick={closeMenu} />
                <MobileNavItem href="/concursos" label="Concursos" onClick={closeMenu} />
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
  isActive = false, // Adicionado para replicar o sublinhado fixo que tem na imagem
}: {
  href: string;
  label: string;
  isSpecial?: boolean;
  isActive?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`
        relative py-2 transition-colors duration-300
        ${isSpecial ? "text-red-700 hover:text-red-500" : "text-black hover:text-gray-600"}
        after:content-[''] after:absolute after:left-0 after:-bottom-1
        after:h-[3px] after:transition-all after:duration-300
        ${isActive ? "after:w-full" : "after:w-0 hover:after:w-full"}
        ${isSpecial ? "after:bg-red-700" : "after:bg-black"}
      `}
    >
      {label}
    </Link>
  );
}

// Componente para Links Mobile
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
        block w-full py-4 border-b border-gray-100
        transition-colors duration-200
        ${isSpecial ? "text-red-700" : "text-black hover:text-gray-600"}
        hover:bg-gray-50 hover:pl-2
        border-l-2 border-transparent hover:border-l-2 hover:border-black
        ${isSpecial && "hover:border-red-700"}
      `}
    >
      {label}
    </Link>
  );
}