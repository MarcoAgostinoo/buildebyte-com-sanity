import type { Metadata } from "next";
import { Bebas_Neue, Barlow } from "next/font/google";
import Script from "next/script";
import { GoogleTagManager } from "@next/third-parties/google";
import "./globals.css";
import { ThemeInit } from "../.flowbite-react/init";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PreviewBanner from "./components/PreviewBanner";
import { Analytics } from '@vercel/analytics/react';

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

export const metadata: Metadata = {
  metadataBase: new URL("https://vetorestrategico.com"),

  title: {
    default: "Vetor Estratégico | Tecnologia, Defesa e Infraestrutura",
    template: "%s | Vetor Estratégico",
  },

  description:
    "Portal brasileiro de análise sobre tecnologia, defesa, infraestrutura crítica e soberania tecnológica com foco no impacto estratégico para o Brasil.",

  keywords: [
    "tecnologia",
    "defesa",
    "infraestrutura crítica",
    "soberania tecnológica",
    "engenharia de sistemas",
    "segurança cibernética",
    "indústria de defesa",
    "Brasil estratégico",
    "análise sistêmica",
    "tecnologia militar",
  ],

  authors: [{ name: "Vetor Estratégico" }],
  creator: "Vetor Estratégico",
  publisher: "Vetor Estratégico",

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

  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://vetorestrategico.com",
    siteName: "Vetor Estratégico",
    title: "Vetor Estratégico | Tecnologia. Poder. Direção.",
    description:
      "Análise técnica sobre sistemas de defesa, infraestrutura crítica e soberania tecnológica.",
    images: [
      {
        url: "https://vetorestrategico.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Vetor Estratégico - Engenharia e Defesa",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Vetor Estratégico | Tecnologia e Infraestrutura",
    description:
      "Análise técnica sobre sistemas de defesa e soberania tecnológica.",
    images: ["https://vetorestrategico.com/og-image.png"],
  },

  category: "Engenharia de Sistemas e Defesa",
};

import { client } from "./lib/sanity";

// ... (imports existentes)

export interface Pillar {
  title: string;
  slug: string;
}

async function getPillars(): Promise<Pillar[]> {
  const query = `*[_type == "pillar"] | order(title asc) {
    title,
    "slug": slug.current
  }`;
  return client.fetch(query);
}

// ... (metadados existentes)

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pillars = await getPillars();
  const jsonLd = {
    // ... (jsonLd existente)
  };

  return (
    <html lang="pt-BR">
      <head>
        {/* ... */}
      </head>

      <body
        className={`${bebas_neue.variable} ${barlow.variable} flex flex-col min-h-screen bg-zinc-950 text-zinc-100 antialiased`}
      >
        <ThemeInit />
        <Header pillars={pillars} />

        <main className="grow">{children}</main>

        <Footer />
        <PreviewBanner />
        <Analytics />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
