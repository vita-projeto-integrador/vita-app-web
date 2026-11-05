import type { NextConfig } from "next";

// Endereço público das imagens (URLs assinadas da API)
const filesUrl = new URL(process.env.FILES_URL ?? "http://localhost:8080/api/files");

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    serverActions: {
      // upload: até 4 imagens de 5 MB + margem do multipart
      bodySizeLimit: "21mb",
    },
  },
  images: {
    // Permite que o Next.js gere imagens com qualidade 25 ou 75
    qualities: [25, 75, 100],

    remotePatterns: [
      {
        protocol: filesUrl.protocol.replace(":", "") as "http" | "https",
        hostname: filesUrl.hostname,
        port: filesUrl.port,
        pathname: `${filesUrl.pathname}/**`, // search omitido: aceita ?expires&signature
      },
    ],
    // Desativa a otimização em modo de desenvolvimento se necessário
    unoptimized: process.env.NODE_ENV === "development",
  },
};
export default nextConfig;