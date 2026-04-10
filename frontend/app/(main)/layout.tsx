import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="overflow-y-auto max-h-screen">
                {children}
            </SidebarInset>
        </SidebarProvider>
    );
}
