/**
 * ============================================================================
 * LAYOUT - [pillarBasePath] - Layout para Rotas de Pilar
 * ============================================================================
 * Layout padre para todos os pilares, categorias e posts
 */

import { ReactNode } from "react";
import { Metadata } from "next";

interface LayoutProps {
  children: ReactNode;
  params: Promise<{
    pillarBasePath?: string;
  }>;
}

export const metadata: Metadata = {
  robots: {
    index: true,
    follow: true,
  },
};

export default async function Layout({ children, params }: LayoutProps) {
  // Você pode usar params.pillarBasePath aqui para lógica do layout se necessário
  // const { pillarBasePath } = await params;

  return (
    <>
      {/* Header é compartilhado via root layout */}
      <main className="bg-white">
        {children}
      </main>
      {/* Footer é compartilhado via root layout */}
    </>
  );
}
