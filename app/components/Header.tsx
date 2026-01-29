import { Button, Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from "flowbite-react";
import Image from "next/image";

export default function Header() {
  return (
    <Navbar 
      fluid 
      rounded 
      // Fixa o menu no topo, adiciona z-index, fundo semi-transparente e desfoque
      className="sticky w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600 bg-white/80 backdrop-blur-md dark:bg-gray-900/80"
    >
      <NavbarBrand href="/">
        <Image src="/next.svg" width={36} height={36} className="mr-3" alt="Buildebite Logo" />
        <span className="self-center whitespace-nowrap text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          Buildebite
        </span>
      </NavbarBrand>
      
      {/* Agrupamento do Botão e Toggle para Mobile */}
      <div className="flex md:order-2 gap-2">
        <Button className="font-medium shadow-md">
          Get started
        </Button>
        <NavbarToggle />
      </div>

      <NavbarCollapse>
        {/* Links com estilização moderna e espaçamento */}
        <NavbarLink href="/" className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors duration-200">
          INÍCIO
        </NavbarLink>
        <NavbarLink 
          href="/videos" 
          className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors duration-200"
        >
          VIDEOS
        </NavbarLink>
        <NavbarLink 
          href="/achados" 
          className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors duration-200"
        >
          ACHADOS
        </NavbarLink>
        <NavbarLink 
          href="/ia" 
          className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors duration-200"
        >
          IA
        </NavbarLink>
        <NavbarLink 
          href="/mundo" 
          className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors duration-200"
        >
          MUNDO
        </NavbarLink>
        <NavbarLink 
          href="/contato" 
          className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors duration-200"
        >
          CONTATO
        </NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
}