import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // Simplesmente desabilita otimização
    remotePatterns: [
      // Configuração correta para o Sanity.io conforme README
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  // Adicionando Headers de Segurança (CSP, HSTS, X-Frame-Options)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY', // Previne Clickjacking
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff', // Previne MIME-sniffing
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload', // Força HTTPS
          },
        ],
      },
    ];
  },
};

export default withFlowbiteReact(nextConfig);
