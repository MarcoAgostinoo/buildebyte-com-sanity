import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeInit } from "../.flowbite-react/init";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PreviewBanner from "./components/PreviewBanner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "build-e-byte - Novidades do mundo da Tecnologia",
  description: "Seu portal de notícias sobre programação, hardware e tudo que acontece no mundo da tecnologia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      {/* Adicionei 'antialiased' para deixar a fonte mais nítida */}
      <body className={`${inter.className} flex flex-col min-h-screen antialiased`}>
        <ThemeInit />
        <Header />
        {/* 'grow' faz a mesma coisa que flex-grow, mas é o padrão atual do Tailwind */}
        <main className="grow">
          {children}
        </main>
        <Footer />
        <PreviewBanner />
      </body>
    </html>
  );
}