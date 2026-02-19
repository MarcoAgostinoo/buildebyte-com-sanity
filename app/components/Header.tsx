import { Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from "flowbite-react";
import Image from "next/image";

export default function Header() {
  return (
    <Navbar
      fluid
      rounded
      // Mantendo o header sempre branco conforme seu pedido anterior
      className="sticky w-full z-20 top-0 start-0 border-b border-gray-200 bg-white md:bg-white/80"
    >
      <NavbarBrand href="/" className="flex items-center">
        {/* O Logo de imagem permanece aqui */}
        <Image src="/logo.png" width={60} height={60} className="mr-3" style={{ height: "auto" }} alt="Vetor Estratégico Logo" />

        {/* --- INÍCIO DA MUDANÇA DA TAGLINE --- */}
        {/* Criamos uma DIV para agrupar o Título e a Tagline em uma coluna vertical */}
        <div className="flex flex-col justify-center">
            {/* Título Principal (Seu span original com pequenos ajustes de espaçamento) */}
            <span className="whitespace-nowrap text-xl font-bold tracking-tight text-primary leading-tight">
              Vetor Estratégico
            </span>

            {/* NOVA TAGLINE AQUI */}
            {/* text-sm (menor), text-gray-600 (cinza para contraste), font-medium (peso médio) */}
            <span className="text-sm text-gray-600 font-medium whitespace-nowrap hidden md:block">
              Inteligência, Defesa e Tecnologia
            </span>
             {/* Versão mobile da Tagline (opcional: pode ser menor ou escondida) */}
            <span className="text-xs text-gray-600 font-medium whitespace-nowrap md:hidden">
              Inteligência & Tecnologia
            </span>
        </div>
        {/* --- FIM DA MUDANÇA DA TAGLINE --- */}

      </NavbarBrand>

      <div className="flex md:order-2 gap-2">
        <NavbarToggle className="text-primary hover:!bg-gray-100 focus:!ring-gray-200" />
      </div>

      <NavbarCollapse className="bg-white">
        <NavbarLink href="/" className="text-gray-800 hover:text-primary">INÍCIO</NavbarLink>
        <NavbarLink href="/destaques" className="text-gray-800 hover:text-primary">DESTAQUES</NavbarLink>
        <NavbarLink href="/videos" className="text-gray-800 hover:text-primary">VIDEOS</NavbarLink>
        <NavbarLink href="/mundo" className="text-gray-800 hover:text-primary">MUNDO</NavbarLink>
        <NavbarLink href="/contato" className="text-gray-800 hover:text-primary">CONTATO</NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
}