"use client";

import Image from "next/image";
import Link from "next/link";
// Se você quiser usar a sua classe mil_section_title aqui, pode importar o CSS module
// import styles from '../MilitaryTheme.module.css';

export default function StrategicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#05080b] border-t-2 border-[#2a2f3a] text-zinc-400 relative overflow-hidden mt-20">
      
      {/* ── LINHA DE DECORAÇÃO TÁTICA TOPO ── */}
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-[#c8a84b]/50 to-transparent" />
      <div className="absolute top-0 left-4 w-12 h-0.75 bg-[#c8a84b]" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* ── BLOCO PRINCIPAL (Grid) ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8">

          {/* 1. IDENTIDADE (Esquerda - 4 colunas) */}
          <div className="md:col-span-5 lg:col-span-4 flex flex-col space-y-6">
            <Link href="/" className="flex items-center gap-4 group">
              <Image
                src="/logofooter.webp"
                alt="Vetor Estratégico Logo"
                width={48}
                height={48}
                className="h-12 w-auto filter grayscale group-hover:grayscale-0 transition-all duration-500"
              />
              <div className="flex flex-col">
                <span className="whitespace-nowrap text-xl sm:text-2xl font-black text-zinc-100 uppercase tracking-widest leading-none group-hover:text-[#c8a84b] transition-colors">
                  Vetor Estratégico
                </span>
                <span className="text-[12px] uppercase tracking-[0.3em] font-bold text-primary/80 mt-1">
                  Análise de Impacto Sistêmico
                </span>
              </div>
            </Link>

            <p className="text-sm text-zinc-500 leading-relaxed border-l-2 border-[#2a2f3a] pl-4">
              Análise aplicada sobre tecnologia, defesa, infraestrutura e poder global — 
              com foco no impacto sistêmico para o Brasil.
            </p>

            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#c8a84b] animate-pulse"></span>
              <p className="text-[12px] font-mono text-zinc-400 tracking-[0.2em] uppercase">
                Tecnologia <span className="text-[#2a2f3a] mx-1">/</span> Poder <span className="text-[#2a2f3a] mx-1">/</span> Direção
              </p>
            </div>
          </div>

          {/* 2. PILARES EDITORIAIS (Meio - 4 colunas) */}
          <div className="md:col-span-3 lg:col-span-4">
            <h3 className="text-xs uppercase tracking-[0.2em] font-black text-zinc-300 mb-6 flex items-center gap-2">
              <span className="w-1 h-3 bg-primary"></span>
              Frentes Operacionais
            </h3>

            <ul className="space-y-3 text-sm font-bold tracking-wide">
              <li>
                <Link href="/frentes/geopolitica-e-defesa" className="text-zinc-500 hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="text-[#2a2f3a] group-hover:text-primary transition-colors">▹</span> Geopolítica & Defesa
                </Link>
              </li>
              <li>
                <Link href="/frentes/arsenal-e-tecnologia" className="text-zinc-500 hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="text-[#2a2f3a] group-hover:text-primary transition-colors">▹</span> Arsenal & Tecnologia
                </Link>
              </li>
              <li>
                <Link href="/frentes/teatro-de-operacoes" className="text-zinc-500 hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="text-[#2a2f3a] group-hover:text-primary transition-colors">▹</span> Teatro de Operações
                </Link>
              </li>
              <li>
                <Link href="/frentes/manual-de-sobrevivencia" className="text-zinc-500 hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="text-[#2a2f3a] group-hover:text-primary transition-colors">▹</span> Sobrevivencialismo
                </Link>
              </li>
              <li>
                <Link href="/frentes/carreiras-estrategicas" className="text-zinc-500 hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="text-[#2a2f3a] group-hover:text-primary transition-colors">▹</span> Concursos & Carreiras
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. INSTITUCIONAL (Direita - 4 colunas) */}
          <div className="md:col-span-4 lg:col-span-4">
            <h3 className="text-xs uppercase tracking-[0.2em] font-black text-zinc-300 mb-6 flex items-center gap-2">
              <span className="w-1 h-3 bg-zinc-600"></span>
              Inteligência Institucional
            </h3>

            <ul className="space-y-3 text-sm font-bold tracking-wide">
              <li>
                <Link href="/about" className="text-zinc-500 hover:text-zinc-200 transition-colors uppercase text-[12px] tracking-wider">
                  Sobre / Missão
                </Link>
              </li>
              <li>
                <Link href="/manifesto" className="text-zinc-500 hover:text-zinc-200 transition-colors uppercase text-[12px] tracking-wider">
                  Manifesto Institucional
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-zinc-500 hover:text-zinc-200 transition-colors uppercase text-[12px] tracking-wider">
                  Política de Privacidade (LGPD)
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-zinc-500 hover:text-zinc-200 transition-colors uppercase text-[12px] tracking-wider">
                  Contato Editorial
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* ── DIVISOR HORIZONTAL ── */}
        <div className="w-full h-px bg-[#2a2f3a] my-10 relative">
          <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-4 h-1.25 bg-[#05080b] border border-[#2a2f3a]" />
        </div>

        {/* ── BLOCO INFERIOR (Copyright e Manifesto) ── */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 text-center lg:text-left">

          <div className="text-[12px] text-zinc-500 font-mono tracking-widest uppercase flex flex-col sm:flex-row items-center gap-2">
            <span>&copy; {currentYear} VETOR ESTRATÉGICO™</span>
            <span className="hidden sm:block text-[#2a2f3a]">|</span>
            <span>TODOS OS DIREITOS RESERVADOS</span>
          </div>

          <div className="text-[12px] text-zinc-400/80 tracking-widest uppercase font-bold max-w-2xl leading-relaxed bg-[#111318] p-3 border border-[#2a2f3a]">
            Portal brasileiro independente de análise estratégica. <br className="hidden sm:block" />
            <span className="text-[#c8a84b]">Não reproduzimos propaganda. Não operamos com viés partidário. Análise não é torcida.</span>
          </div>

        </div>

      </div>
    </footer>
  );
}