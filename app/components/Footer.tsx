"use client";

import { 
  Footer, 
  FooterBrand, 
  FooterCopyright, 
  FooterDivider, 
  FooterLink, 
  FooterLinkGroup 
} from "flowbite-react";

export default function SimpleFooter() {
  return (
    <Footer container className="rounded-none bg-amber-50 dark:bg-zinc-950 shadow-none border-t border-[var(--border)] pt-12 pb-8">
      <div className="w-full max-w-7xl mx-auto">
        
        <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1 gap-8">  
          {/* Marca / Identidade */}
          <div className="flex flex-col items-start">
            <FooterBrand
              href="/"
              src="/logo.png" 
              alt="Vetor Estratégico Logo"
              name="Vetor Estratégico"
              className="mb-4 flex items-center"
            />
            <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-xs leading-relaxed">
              Decodificando a arquitetura do mundo moderno. <br/>
              <span className="text-xs font-mono opacity-60 mt-2 block">
                VERSION: 2.0.4-STABLE
              </span>
            </p>
          </div>

          {/* Links Técnicos */}
          <div className="flex items-center">
            <FooterLinkGroup className="flex flex-wrap gap-x-8 gap-y-4 justify-start sm:justify-end">
              <FooterLink href="/about" className="text-zinc-600 dark:text-zinc-400 hover:text-primary uppercase text-xs font-bold tracking-widest transition-colors">
                Sobre / Missão
              </FooterLink>
              <FooterLink href="/privacy-policy" className="text-zinc-600 dark:text-zinc-400 hover:text-primary uppercase text-xs font-bold tracking-widest transition-colors">
                Privacidade (LGPD)
              </FooterLink>
              <FooterLink href="/licensing" className="text-zinc-600 dark:text-zinc-400 hover:text-primary uppercase text-xs font-bold tracking-widest transition-colors">
                Licenciamento
              </FooterLink>
              <FooterLink href="/contato" className="text-zinc-600 dark:text-zinc-400 hover:text-primary uppercase text-xs font-bold tracking-widest transition-colors">
                Abrir Chamado
              </FooterLink>
            </FooterLinkGroup>
          </div>
        </div>
        
        <FooterDivider className="my-8 border-[var(--border)]" />
        
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <FooterCopyright 
            href="/" 
            by="Vetor Estratégico™ Media." 
            year={new Date().getFullYear()} 
            className="text-zinc-400 dark:text-zinc-500 text-xs font-mono"
          />

          {/* Indicador de Status do Sistema */}
          <div className="flex items-center gap-3 px-4 py-1.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 bg-green-500"></span>
            </div>
            <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-widest">
              Systems Operational
            </span>
          </div>

        </div>
      </div>
    </Footer>
  );
}