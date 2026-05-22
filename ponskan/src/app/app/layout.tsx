import { SidebarInset, SidebarProvider, } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app/app-sidebar";
// import { ProcessProvider } from "@/context/ProcessesProvider";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <SidebarProvider>
            <AppSidebar />

            <SidebarInset className="bg-slate-100 h-screen">
                {children}
            </SidebarInset>
        </SidebarProvider>
    );
}