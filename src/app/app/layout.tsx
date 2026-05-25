import { SidebarInset, SidebarProvider, } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app/app-sidebar";
import { AnalysisProvider } from "@/context/AnalysisProvider";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <SidebarProvider>
            <AnalysisProvider>
                <AppSidebar />

                <SidebarInset className="bg-slate-100 h-screen">
                    {children}
                </SidebarInset>
            </AnalysisProvider>
        </SidebarProvider>
    );
}