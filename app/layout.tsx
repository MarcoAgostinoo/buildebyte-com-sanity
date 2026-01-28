import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
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
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <PreviewBanner />
      </body>
    </html>
  );
}
