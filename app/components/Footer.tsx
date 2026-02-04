"use client"; // Essencial para componentes de UI no Next.js App Router

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
    <Footer container className="rounded-none bg-gray-50 shadow-none border-t border-gray-100">
      <div className="w-full text-center">
        <div className="w-full justify-between sm:flex sm:items-center sm:justify-between">
          
          {/* Marca / Logo */}
          <FooterBrand
            href="/"
            src="https://flowbite.com/docs/images/logo.svg" 
            alt="Buildebite Logo"
            name="Buildebite"
            className="mb-4 sm:mb-0 flex items-center justify-center sm:justify-start"
          />

          {/* Links Horizontais */}
          <FooterLinkGroup className="justify-center sm:justify-end gap-6">
            <FooterLink href="/about" className="text-gray-600 hover:text-blue-600 hover:underline transition-colors">
              About
            </FooterLink>
            <FooterLink href="/privacy-policy" className="text-gray-600 hover:text-blue-600 hover:underline transition-colors">
              Privacy Policy
            </FooterLink>
            <FooterLink href="/licensing" className="text-gray-600 hover:text-blue-600 hover:underline transition-colors">
              Licensing
            </FooterLink>
            <FooterLink href="/contato" className="text-gray-600 hover:text-blue-600 hover:underline transition-colors">
              Contact
            </FooterLink>
          </FooterLinkGroup>
        </div>
        
        <FooterDivider className="my-6 border-gray-200" />
        
        <FooterCopyright 
            href="/" 
            by="Buildebite™" 
            year={new Date().getFullYear()} 
            className="opacity-70"
        />
      </div>
    </Footer>
  );
}