// ============================================================
// 1. TODOS OS IMPORTS NO TOPO (Ordem Corrigida)
// ============================================================
import type { Metadata } from "next";
import { Bebas_Neue, Barlow } from "next/font/google";
import Script from "next/script";
import { GoogleTagManager } from "@next/third-parties/google";
import { Analytics } from '@vercel/analytics/react';
import { ThemeInit } from "../.flowbite-react/init";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PreviewBanner from "./components/PreviewBanner";

// Este import foi movido para o topo para evitar erros de compilação
import { client } from "./lib/sanity"; 

// Import global de estilos (geralmente por último)
import "./globals.css";


// ============================================================
// 2. CONFIGURAÇÃO DE FONTES DO GOOGLE
// ============================================================
const bebas_neue = Bebas_Neue({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
  variable: "--font-bebas-neue",
});

const barlow = Barlow({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-barlow",
});


// ============================================================
// 3. INTERFACES E TIPAGENS
// ============================================================
export interface Pillar {
  title: string;
  slug: string;
  basePath: string;
}


// ============================================================
// 4. METADATA DE SEO (Centralizado e Otimizado)
// ============================================================
export const metadata: Metadata = {
  metadataBase: new URL("https://vetorestrategico.com"),

  // Título Dinâmico
  title: {
    default: "Vetor Estratégico | Tecnologia, Defesa e Infraestrutura",
    template: "%s | Vetor Estratégico",
  },

  // Descrição Principal
  description: "Portal brasileiro de análise sobre tecnologia, defesa, infraestrutura crítica e soberania tecnológica com foco no impacto estratégico para o Brasil.",

  // Palavras-chave
  keywords: [
    "tecnologia", "defesa", "infraestrutura crítica", "soberania tecnológica",
    "engenharia de sistemas", "segurança cibernética", "indústria de defesa",
    "Brasil estratégico", "análise sistêmica", "tecnologia militar",
  ],

  // Atribuição
  authors: [{ name: "Vetor Estratégico" }],
  creator: "Vetor Estratégico",
  publisher: "Vetor Estratégico",

  // =========================================================================
  // AJUSTE CRÍTICO: ADICIONADO PARA VERIFICAÇÃO INSTANTÂNEA NO SEARCH CONSOLE
  // Usei o código correto que termina em "...NpKKw"
  // =========================================================================
  verification: {
    google: "J3d8JCbDKMu_W-_lw4elkvmWUF3be bD8XHpVizNpKKw",
  },
  // =========================================================================

  // Configurações de Indexação (Robots)
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Open Graph (Redes Sociais em geral)
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://vetorestrategico.com",
    siteName: "Vetor Estratégico",
    title: "Vetor Estratégico | Tecnologia. Poder. Direção.",
    description: "Análise técnica sobre sistemas de defesa, infraestrutura crítica e soberania tecnológica.",
    images: [
      {
        url: "https://vetorestrategico.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Vetor Estratégico - Engenharia e Defesa",
      },
    ],
  },

  // Twitter/X Card
  twitter: {
    card: "summary_large_image",
    title: "Vetor Estratégico | Tecnologia e Infraestrutura",
    description: "Análise técnica sobre sistemas de defesa e soberania tecnológica.",
    images: ["https://vetorestrategico.com/og-image.png"],
  },

  category: "Engenharia de Sistemas e Defesa",
};


// ============================================================
// 5. FUNÇÕES DE FETCH (SANITY)
// ============================================================
async function getPillars(): Promise<Pillar[]> {
  const query = `*[_type == "pillar"] | order(title asc) {
    title,
    "slug": slug.current,
    basePath
  }`;
  return client.fetch(query);
}


// ============================================================
// 6. COMPONENTE PRINCIPAL (ROOTLAYOUT)
// ============================================================
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Chamada de dados no servidor
  const pillars = await getPillars();

  // JSON-LD (Sua estrutura existente)
  const jsonLd = {
    // ... (jsonLd existente que você já definiu)
  };

  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://api.worldbank.org" />
        {/* Você pode renderizar o JSON-LD aqui se tiver a estrutura completa:
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
        */}
      </head>

      <body
        // Classes de estilo global: Fontes, Cores (Dark), Layout Flexível
        className={`${bebas_neue.variable} ${barlow.variable} flex flex-col min-h-screen bg-zinc-950 text-zinc-100 antialiased`}
      >
        <ThemeInit />
        <Header pillars={pillars} />

        {/* Conteúdo Dinâmico das Páginas */}
        <main className="grow">{children}</main>

        <Footer />
        <PreviewBanner />
        
        {/* Vercel Analytics */}
        <Analytics />
        
        {/* Google Tag Manager (Renderização condicional segura) */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
