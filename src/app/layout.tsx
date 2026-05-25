import type { Metadata } from "next";
import { Inter, Lexend, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

// URL base do domínio (não usado ainda)
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ponskan.com.br';

const lexendSans = Lexend({
  variable: "--font-lexend-sans",
  subsets: ["latin"],
});

const interSans = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ponskan",
  description: "Sitema de detecção de doenças em citrus",
  keywords: ['citros', 'doenças', 'agricultura', 'IA', 'detecção de pragas', 'monitoramento'],

  // Link/card personalizado para compartilhar em redes sociais 
  openGraph: { 
    title: 'Detecção de Doenças em Citros',
    description: 'Identificação rápida e precisa de pragas em citros via IA.',
    type: 'website',
    url: 'https://ponskan.com.br', 
    images: [ 
      {
        url: `${BASE_URL}/images/logotipo-ponskan.jpg`, // Buscar a imagem do link na pasta do site
        width: 1200,
        height: 630,
        alt: 'Sistema de detecção de doenças em citros',
      },
    ],
    
  }
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html
      lang="pt"
      data-scroll-behavior="smooth"
      className={cn("h-full", "antialiased", lexendSans.variable, interSans.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );  
}
