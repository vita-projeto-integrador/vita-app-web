import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  images: { 
    // Permite que o Next.js gere imagens com qualidade 25 ou 75
    qualities: [25, 75, 100],

    remotePatterns: [ // Para permitir pegar imagens de outras rotas alem da api
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080', 
        pathname: '/storage/**',
      },
    ],
    // Desativa a otimização em modo de desenvolvimento se necessário
    unoptimized: process.env.NODE_ENV === 'development',
  },
};
export default nextConfig;
