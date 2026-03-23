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
};

type MobileNavItemProps = {
  href: string;
  label: string;
  onClick: () => void;
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
      <div className="w-full bg-[#05080b] text-zinc-500 text-[10px] md:text-xs border-b border-zinc-800/80 font-mono">
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
            <div className="hidden md:flex items-center gap-6 text-sm font-bold uppercase relative">
              <NavItem href="/" label="Início" />
              <NavItem href="/destaques" label="Destaques" />
              <NavItem href="/radar" label="Radar" isSpecial />

              {/* DROPDOWN */}
              <div
                className="relative"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <button className="text-black hover:text-gray-600 py-2">
                  Frentes Estratégicas ▾
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 shadow-xl">
                    {pillars.map((pillar) => (
                      <DropdownItem
                        key={pillar.slug}
                        href={`/frentes/${pillar.slug}`}
                        label={pillar.title}
                      />
                    ))}
                  </div>
                )}
              </div>

              <NavItem href="/videos" label="Vídeos" />
              <NavItem href="/concursos" label="Concursos" />
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
            <div className="md:hidden bg-white border-t shadow-lg">
              <MobileNavItem href="/" label="Início" onClick={closeMenu} />
              <MobileNavItem href="/destaques" label="Destaques" onClick={closeMenu} />
              <MobileNavItem href="/radar" label="Radar" onClick={closeMenu} />

              {/* DROPDOWN MOBILE */}
              <div className="border-b">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full text-left py-4 font-bold"
                >
                  Frentes Estratégicas
                </button>

                {isDropdownOpen && (
                  <div className="pl-4">
                    {pillars.map((pillar) => (
                      <MobileNavItem
                        key={pillar.slug}
                        href={`/frentes/${pillar.slug}`}
                        label={pillar.title}
                        onClick={closeMenu}
                      />
                    ))}
                  </div>
                )}
              </div>

              <MobileNavItem href="/videos" label="Vídeos" onClick={closeMenu} />
              <MobileNavItem href="/concursos" label="Concursos" onClick={closeMenu} />
              <MobileNavItem href="/contato" label="Contato" onClick={closeMenu} />
            </div>
          )}
        </div>
      </header>
    </>
  );
}

// COMPONENTES

function NavItem({ href, label, isSpecial = false }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`${isSpecial ? "text-red-700" : "text-black"} hover:text-gray-600`}
    >
      {label}
    </Link>
  );
}

function DropdownItem({ href, label }: DropdownItemProps) {
  return (
    <Link
      href={href}
      className="block px-4 py-3 text-sm text-black hover:bg-gray-100 transition-colors"
    >
      {label}
    </Link>
  );
}

function MobileNavItem({ href, label, onClick }: MobileNavItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block py-4 border-b border-gray-100"
    >
      {label}
    </Link>
  );
}