import { Footer } from "@/components/layout/marketing";

export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {
  return (
    <>
      <main className="w-full flex-1">
        {children}
      </main>

      <Footer />
    </>
  );  
}
