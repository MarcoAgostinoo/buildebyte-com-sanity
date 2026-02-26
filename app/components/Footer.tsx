"use client";

import {
  Footer,
  FooterCopyright,
  FooterDivider,
  FooterLink,
  FooterLinkGroup,
} from "flowbite-react";
import Image from "next/image";
import Link from "next/link";

export default function StrategicFooter() {
  return (
    <Footer
      container
      className="rounded-none bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 pt-16 pb-10"
    >
      <div className="w-full max-w-7xl mx-auto">

        {/* BLOCO PRINCIPAL */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* IDENTIDADE */}
          <div className="flex flex-col space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logofooter.webp"
                alt="Vetor Estratégico Logo"
                width={39}
                height={32}
                className="mr-3 h-8 w-auto"
              />
              <span className="self-center whitespace-nowrap text-xl font-semibold text-zinc-800 dark:text-white">
                Vetor Estratégico
              </span>
            </Link>

            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-sm">
              Análise aplicada sobre tecnologia, defesa, infraestrutura e poder global —
              com foco no impacto sistêmico para o Brasil.
            </p>

            <p className="text-xs font-mono text-zinc-400 tracking-wider">
              Tecnologia. Poder. Direção.
            </p>
          </div>

          {/* PILARES EDITORIAIS */}
          <div>
            <h3 className="text-xs uppercase tracking-widest font-semibold text-zinc-500 mb-4">
              Áreas de Análise
            </h3>

            <ul className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
              <li>Defesa & Tecnologia Militar</li>
              <li>Infraestrutura & Soberania</li>
              <li>Economia de Poder</li>
              <li>Brasil Estratégico</li>
            </ul>
          </div>

          {/* INSTITUCIONAL */}
          <div>
            <h3 className="text-xs uppercase tracking-widest font-semibold text-zinc-500 mb-4">
              Institucional
            </h3>

            <FooterLinkGroup col className="space-y-3">
              <FooterLink href="/about" className="hover:text-primary">
                Sobre / Missão
              </FooterLink>
              <FooterLink href="/manifesto" className="hover:text-primary">
                Manifesto Institucional
              </FooterLink>
              <FooterLink href="/privacy-policy" className="hover:text-primary">
                Política de Privacidade (LGPD)
              </FooterLink>
              <FooterLink href="/contato" className="hover:text-primary">
                Contato Editorial
              </FooterLink>
            </FooterLinkGroup>
          </div>
        </div>

        <FooterDivider className="my-10 border-zinc-200 dark:border-zinc-800" />

        {/* BLOCO INFERIOR */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">

          <FooterCopyright
            href="/"
            by="Vetor Estratégico™"
            year={new Date().getFullYear()}
            className="text-xs text-zinc-500 font-mono"
          />

          <div className="text-[11px] text-zinc-400 tracking-wide text-center md:text-right max-w-md">
            Portal brasileiro independente de análise estratégica.
            Não reproduzimos propaganda. Não operamos com viés partidário.
            Análise não é torcida.
          </div>
        </div>
      </div>
    </Footer>
  );
}