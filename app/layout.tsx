import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeInit } from "../.flowbite-react/init";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { GoogleAnalytics } from "@next/third-parties/google";
import PreviewBanner from "./components/PreviewBanner";
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://vetorestrategico.com/#organization",
        name: "Vetor Estratégico",
        url: "https://vetorestrategico.com",
        logo: {
          "@type": "ImageObject",
          url: "https://vetorestrategico.com/logo.webp",
        },
        description:
          "Portal brasileiro de análise técnica sobre tecnologia, defesa e infraestrutura estratégica.",
      },
      {
        "@type": "NewsMediaOrganization",
        "@id": "https://vetorestrategico.com/#news",
        name: "Vetor Estratégico",
        url: "https://vetorestrategico.com",
        logo: {
          "@type": "ImageObject",
          url: "https://vetorestrategico.com/logo.webp",
        },
      },
      {
        "@type": "WebSite",
        "@id": "https://vetorestrategico.com/#website",
        url: "https://vetorestrategico.com",
        name: "Vetor Estratégico",
        publisher: {
          "@id": "https://vetorestrategico.com/#organization",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: "https://vetorestrategico.com/search?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <html lang="pt-BR">
      <head>
        <Script
          id="vetor-estrategico-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>

      <body
        className={`${inter.className} flex flex-col min-h-screen bg-zinc-950 text-zinc-100 antialiased`}
      >
        <ThemeInit />
        <Header />

        <main className="grow">{children}</main>

        <Footer />
        <PreviewBanner />
        <Analytics />
        {process.env.NEXT_PUBLIC_GA_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      )}
      </body>
    </html>
  );
}
