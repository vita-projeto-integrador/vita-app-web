export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <div className="flex h-dvh w-dvw px-4 justify-center items-center bg-slate-100">
            
            
            {children}
        </div>

    );
}