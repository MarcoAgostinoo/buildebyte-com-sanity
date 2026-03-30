"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";


// ✅ DATA DIRETA (sem state / sem effect)
const currentDate = new Date().toLocaleDateString("pt-BR", {
  weekday: "long",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

// ✅ TIPOS
type NavItemProps = {
  href: string;
  label: string;
  isSpecial?: boolean;
};

type DropdownItemProps = {
  href: string;
  label: string;
  isHighlight?: boolean;
};

type MobileNavItemProps = {
  href: string;
  label: string;
  onClick: () => void;
  isHighlight?: boolean;
};

import { Pillar } from "@/app/layout";

export default function Header({ pillars }: { pillars: Pillar[] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  };

  return (
    <>
      {/* TOP BAR */}
      <div className="w-full bg-[#05080b] text-zinc-500 text-[12px] md:text-xs border-b border-zinc-800/80 font-mono">
        <div className="max-w-7xl mx-auto px-4 h-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-red-700 animate-pulse"></span>
            <span className="uppercase tracking-widest">{currentDate}</span>
          </div>
          <span className="uppercase tracking-[0.2em] hidden md:block text-zinc-400 font-bold">
            Defesa <span className="text-red-700 mx-1">•</span> Inteligência{" "}
            <span className="text-red-700 mx-1">•</span> Poder
          </span>
        </div>
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white border-b-2 border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center justify-between h-20 md:h-24">
            
            {/* LOGO */}
            <Link
              href="/"
              className="flex items-center gap-3"
              onClick={closeMenu}
            >
              <Image
                src="/logo.webp"
                width={64}
                height={64}
                alt="Vetor Estratégico"
                className="w-12 h-12 md:w-16 md:h-16"
              />
              <div>
                <span className="text-lg md:text-2xl font-black text-black tracking-widest uppercase block">
                  Vetor Estratégico
                </span>
                <span className="hidden sm:block text-xs text-gray-500 tracking-[0.3em] uppercase font-bold">
                  Análise de Impacto Sistêmico
                </span>
              </div>
            </Link>

            {/* BOTÃO MOBILE */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-black text-2xl w-10 h-10 border border-gray-200 rounded flex items-center justify-center"
            >
              {isMenuOpen ? "✕" : "☰"}
            </button>

            {/* MENU DESKTOP */}
            <div className="hidden md:flex items-center gap-6 text-sm font-bold uppercase relative h-full">
              <NavItem href="/" label="Início" />
              <NavItem href="/radar" label="Radar" isSpecial />

              {/* DROPDOWN COM PONTE INVISÍVEL */}
              <div
                className="relative h-full flex items-center group"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <button className="text-black hover:text-gray-600 h-full flex items-center gap-1 transition-colors">
                  Frentes Estratégicas 
                  <svg className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* O TRUQUE DA PONTE: 
                  - "pt-4" cria a ponte invisível cobrindo o vão. 
                  - top-full garante que ele desça exatamente após o header.
                */}
                <div 
                  className={`absolute top-full right-0 pt-2 w-72 transition-all duration-200 ease-in-out origin-top ${
                    isDropdownOpen ? 'opacity-100 scale-y-100 visible' : 'opacity-0 scale-y-95 invisible'
                  }`}
                >
                  <div className="bg-white border border-gray-200 shadow-2xl rounded-sm overflow-hidden flex flex-col">
                    {/* Lista dinâmica de Pilares */}
                    {pillars.map((pillar) => (
                      <DropdownItem
                        key={pillar.slug || pillar.basePath}
                        href={`/pilares/${pillar.slug}`}
                        label={pillar.title}
                      />
                    ))}
                    
                    {/* Opção para Ver Todas (A página incrível) */}
                    <DropdownItem
                        key="ver-todas"
                        href="/pilares"
                        label="Ver Todas as Frentes &rarr;"
                        isHighlight
                      />
                  </div>
                </div>
              </div>

              <NavItem href="/videos" label="Vídeos" />
              <NavItem href="/contato" label="Contato" />

              {/* BUSCA */}
              <button
                aria-label="Buscar"
                className="ml-2 text-black hover:text-gray-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>
            </div>
          </nav>

          {/* MOBILE MENU */}
          {isMenuOpen && (
            <div className="md:hidden bg-white border-t shadow-lg py-2">
              <MobileNavItem href="/" label="Início" onClick={closeMenu} />
              <MobileNavItem href="/radar" label="Radar" onClick={closeMenu} />

              {/* DROPDOWN MOBILE */}
              <div className="border-b border-gray-100">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full text-left py-4 px-4 font-bold flex justify-between items-center bg-gray-50/50"
                >
                  Frentes Estratégicas
                  <svg className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="pl-4 bg-gray-50/30 pb-2">
                    {pillars.map((pillar) => (
                      <MobileNavItem
                        key={pillar.slug || pillar.basePath}
                        href={`/pilares/${pillar.slug}`}
                        label={pillar.title}
                        onClick={closeMenu}
                      />
                    ))}
                    <MobileNavItem
                        key="ver-todas-mobile"
                        href="/pilares"
                        label="Ver Todas as Frentes &rarr;"
                        onClick={closeMenu}
                        isHighlight
                      />
                  </div>
                )}
              </div>

              <MobileNavItem href="/videos" label="Vídeos" onClick={closeMenu} />
              <MobileNavItem href="/contato" label="Contato" onClick={closeMenu} />
            </div>
          )}
        </div>
      </header>
    </>
  );
}

// ---------------------------------------------------------------------------
// COMPONENTES AUXILIARES
// ---------------------------------------------------------------------------

function NavItem({ href, label, isSpecial = false }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`${isSpecial ? "text-red-700" : "text-black"} hover:text-gray-600 transition-colors h-full flex items-center`}
    >
      {label}
    </Link>
  );
}

function DropdownItem({ href, label, isHighlight = false }: DropdownItemProps) {
  return (
    <Link
      href={href}
      className={`block px-5 py-3.5 text-[12px] font-black tracking-widest uppercase transition-colors ${
        isHighlight 
        ? "bg-zinc-50 border-t border-gray-200 text-primary hover:bg-primary/5" 
        : "text-zinc-600 hover:bg-zinc-100 hover:text-black"
      }`}
    >
      {label}
    </Link>
  );
}

function MobileNavItem({ href, label, onClick, isHighlight = false }: MobileNavItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`block py-4 px-4 border-b border-gray-100 uppercase font-bold text-sm tracking-wide ${
        isHighlight ? "text-primary bg-primary/5" : "text-gray-800"
      }`}
    >
      {label}
    </Link>
  );
}