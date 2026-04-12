import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="overflow-y-auto max-h-screen">
                <header className="sticky top-0 z-20 flex h-14 items-center border-b bg-background/95 px-4 backdrop-blur md:hidden">
                    <SidebarTrigger className="-ml-1" />
                    <p className="ml-2 text-sm font-semibold">Menu</p>
                </header>
                {children}
            </SidebarInset>
        </SidebarProvider>
    );
}
