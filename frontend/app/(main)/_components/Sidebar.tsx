"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    History,
    House,
    LogOut,
    Repeat,
    ShieldUser,
    Ticket,
    UserRound,
    type LucideIcon,
} from "lucide-react";
import {
    ADMIN_HOME_PATH,
    RESERVE_PATH,
    getCurrentAuthUser,
    loginByUserId,
    logoutAuth,
    users,
    type AuthUser,
} from "@/lib/auth";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import { toast } from "sonner";

type MenuItem = {
    label: string;
    href: string;
    icon: LucideIcon;
};

const USER_MENU: MenuItem[] = [
    {
        label: "Reserve",
        href: "/reserve",
        icon: Ticket,
    },
    {
        label: "History",
        href: "/history",
        icon: History,
    },
];

const ADMIN_MENU: MenuItem[] = [
    {
        label: "Home",
        href: "/home",
        icon: House,
    },
    {
        label: "History",
        href: "/history",
        icon: History,
    },
];

export function AppSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { isMobile, setOpenMobile } = useSidebar();
    const [authUser, setAuthUser] = useState<AuthUser | null>(null);
    const [isSwitchingAccount, setIsSwitchingAccount] = useState(false);

    useEffect(() => {
        const loadCurrentUser = async () => {
            try {
                const currentUser = await getCurrentAuthUser();
                setAuthUser(currentUser);
            } catch {
                setAuthUser(null);
            }
        };

        void loadCurrentUser();
    }, []);

    useEffect(() => {
        if (isMobile) {
            setOpenMobile(false);
        }
    }, [isMobile, pathname, setOpenMobile]);

    const menuItems = useMemo(() => {
        if (authUser?.role === "ADMIN") {
            return ADMIN_MENU;
        }

        if (authUser?.role === "USER") {
            return USER_MENU;
        }

        return [];
    }, [authUser?.role]);

    const handleLogout = async () => {
        try {
            await logoutAuth();
        } finally {
            setOpenMobile(false);
            toast.success("Logged out successfully");
            setAuthUser(null);
            router.replace("/login");
        }
    };

    const handleToggleAccount = async () => {
        if (!authUser) {
            return;
        }

        setIsSwitchingAccount(true);

        const nextUser = authUser.role === "ADMIN" ? users[0] : users[2];
        try {
            const { user } = await loginByUserId(nextUser.id);
            setAuthUser(user);
            setOpenMobile(false);
            router.replace(
                user.role === "ADMIN" ? ADMIN_HOME_PATH : RESERVE_PATH,
            );
            toast.success(`Account switched to ${user.name}`);
        } catch (error) {
            toast.error("Failed to switch account. Please try again.");
        } finally {
            setIsSwitchingAccount(false);
        }
    };

    return (
        <Sidebar
            collapsible="offcanvas"
            className="border-r border-sidebar-border bg-sidebar"
        >
            <SidebarHeader className="px-4 pt-4 pb-2">
                <p className="truncate text-2xl text-primary font-bold">
                    Concertly
                </p>
            </SidebarHeader>

            <SidebarContent className="px-2 pb-3">
                <SidebarGroup className="px-2 py-0">
                    <SidebarGroupLabel className="px-2 uppercase">
                        Menu
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-1.5">
                            {menuItems.map((item) => {
                                const isActive =
                                    pathname === item.href ||
                                    pathname.startsWith(`${item.href}/`);

                                return (
                                    <SidebarMenuItem key={item.href}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            className="h-10 rounded-lg px-3 text-sidebar-foreground hover:bg-sidebar-accent data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
                                        >
                                            <Link
                                                href={item.href}
                                                onClick={() => {
                                                    if (isMobile) {
                                                        setOpenMobile(false);
                                                    }
                                                }}
                                            >
                                                <item.icon className="size-4" />
                                                <span>{item.label}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}

                            {authUser && (
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        onClick={() => {
                                            void handleToggleAccount();
                                        }}
                                        disabled={isSwitchingAccount}
                                        className="h-10 rounded-lg px-3 text-sidebar-foreground hover:bg-sidebar-accent"
                                    >
                                        <Repeat className="size-4" />
                                        <span>
                                            {isSwitchingAccount
                                                ? "Switching..."
                                                : `Switch to ${
                                                      authUser.role === "ADMIN"
                                                          ? "user"
                                                          : "admin"
                                                  }`}
                                        </span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="mt-auto p-3">
                <button
                    type="button"
                    onClick={() => {
                        void handleLogout();
                    }}
                    className="flex h-10 w-full items-center gap-2 rounded-lg px-3 text-sm hover:bg-sidebar-accent"
                >
                    <LogOut className="size-4" />
                    <span>Logout</span>
                </button>
                <div className="rounded-xl border border-sidebar-border bg-card px-3 py-2">
                    <div className="flex items-center gap-3">
                        <span className="inline-flex size-9 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
                            {authUser?.role === "USER" ? (
                                <UserRound className="size-4" />
                            ) : (
                                <ShieldUser className="size-4" />
                            )}
                        </span>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-foreground">
                                {authUser?.name ?? "Loading..."}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {authUser?.role === "ADMIN" ? "Admin" : "User"}
                            </p>
                        </div>
                    </div>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
