import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // Altere para o tamanho que julgar necessário
    },
  },
};

export default nextConfig;
