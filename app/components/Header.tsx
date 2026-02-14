import { Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from "flowbite-react";
import Image from "next/image";

export default function Header() {
  return (
    <Navbar
      fluid
      rounded
      // AQUI: "bg-white dark:bg-white" garante fundo branco SEMPRE.
      className="sticky w-full z-20 top-0 start-0 border-b border-gray-200 bg-white dark:bg-white md:bg-white/80 md:dark:bg-white/80"
    >
      <NavbarBrand href="/">
        <Image src="/logo.png" width={60} height={60} className="mr-0" alt="Build&Byte Logo" />
        {/* AQUI: "text-primary dark:text-primary" garante texto azul SEMPRE. */}
        <span className="self-center whitespace-nowrap text-xl font-bold tracking-tight text-primary dark:text-primary">
          Build&Byte
        </span>
      </NavbarBrand>

      <div className="flex md:order-2 gap-2">
        {/* AQUI: Ícone do menu azul SEMPRE */}
        <NavbarToggle className="text-primary dark:text-primary hover:bg-gray-100 focus:ring-gray-200" />
      </div>

      {/* AQUI: Fundo do menu aberto branco SEMPRE */}
      <NavbarCollapse className="bg-white dark:bg-white">
        <NavbarLink href="/" className="text-gray-800 dark:text-gray-800 hover:text-primary dark:hover:text-primary">
          INÍCIO
        </NavbarLink>
        <NavbarLink href="/destaques" className="text-gray-800 dark:text-gray-800 hover:text-primary dark:hover:text-primary">
          DESTAQUES
        </NavbarLink>
        <NavbarLink href="/videos" className="text-gray-800 dark:text-gray-800 hover:text-primary dark:hover:text-primary">
          VIDEOS
        </NavbarLink>
        <NavbarLink href="/achados" className="text-gray-800 dark:text-gray-800 hover:text-primary dark:hover:text-primary">
          ACHADOS
        </NavbarLink>
        <NavbarLink href="/ia" className="text-gray-800 dark:text-gray-800 hover:text-primary dark:hover:text-primary">
          IA
        </NavbarLink>
        <NavbarLink href="/mundo" className="text-gray-800 dark:text-gray-800 hover:text-primary dark:hover:text-primary">
          MUNDO
        </NavbarLink>
        <NavbarLink href="/contato" className="text-gray-800 dark:text-gray-800 hover:text-primary dark:hover:text-primary">
          CONTATO
        </NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
}