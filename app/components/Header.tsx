import { Button, Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from "flowbite-react";
import Image from "next/image";

export default function Header() {
  return (
    <Navbar
      fluid
      rounded
      // Usa as novas variáveis para o fundo e a borda
      className="sticky w-full z-20 top-0 start-0 border-b border-[var(--border)] bg-[var(--card-bg)]/80"
    >
      <NavbarBrand href="/">
        <Image src="/logo.png" width={60} height={60} className="mr-0" alt="Buildebite Logo" />
        {/* O texto agora usa a cor primária */}
        <span className="self-center whitespace-nowrap text-xl font-bold tracking-tight text-primary dark:text-white">
          Buildebite
        </span>
      </NavbarBrand>

      <div className="flex md:order-2 gap-2">
        {/* Botão com a cor secundária */}
        <Button className="font-medium shadow-md bg-secondary text-white hover:bg-red-700">
          Get started
        </Button>
        <NavbarToggle />
      </div>

      <NavbarCollapse>
        {/* Links com a cor primária no hover */}
        <NavbarLink href="/" className="hover:text-primary dark:hover:text-blue-400 transition-colors duration-200">
          INÍCIO
        </NavbarLink>
        <NavbarLink
          href="/destaques"
          className="hover:text-primary dark:hover:text-blue-400 transition-colors duration-200"
        >
          DESTAQUES
        </NavbarLink>
        <NavbarLink
          href="/videos"
          className="hover:text-primary dark:hover:text-blue-400 transition-colors duration-200"
        >
          VIDEOS
        </NavbarLink>
        <NavbarLink
          href="/achados"
          className="hover:text-primary dark:hover:text-blue-400 transition-colors duration-200"
        >
          ACHADOS
        </NavbarLink>
        <NavbarLink
          href="/ia"
          className="hover:text-primary dark:hover:text-blue-400 transition-colors duration-200"
        >
          IA
        </NavbarLink>
        <NavbarLink
          href="/mundo"
          className="hover:text-primary dark:hover:text-blue-400 transition-colors duration-200"
        >
          MUNDO
        </NavbarLink>
        <NavbarLink
          href="/contato"
          className="hover:text-primary dark:hover:text-blue-400 transition-colors duration-200"
        >
          CONTATO
        </NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
}