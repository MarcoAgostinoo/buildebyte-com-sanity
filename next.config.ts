import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // Simplesmente desabilita otimização
    remotePatterns: [
      {
        protocol: "https",
        hostname: "romantic-frog-d139ad790e.media.strapiapp.com",
      },
      {
        protocol: 'https',
        hostname: 'http2.mlstatic.com',
        pathname: '/**',
      },
    ],
  },
};

export default withFlowbiteReact(nextConfig);