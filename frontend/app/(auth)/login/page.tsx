"use client";

import { Button } from "@/components/ui/button";
import {
    ADMIN_HOME_PATH,
    RESERVE_PATH,
    loginByUserId,
    users,
    type User,
} from "@/lib/auth";
import { ArrowLeft, ShieldUser, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function LoginPage() {
    const router = useRouter();
    const [loadingUserId, setLoadingUserId] = useState<number | null>(null);

    const handleSelectUser = async (user: User) => {
        setLoadingUserId(user.id);

        try {
            const { user: authUser } = await loginByUserId(user.id);

            toast.success(`Logged in as ${authUser.name} (${authUser.role})`);

            const targetPath =
                authUser.role === "ADMIN" ? ADMIN_HOME_PATH : RESERVE_PATH;
            router.push(targetPath);
        } catch (error) {
            toast.error("Failed to login. Please try again.");
        } finally {
            setLoadingUserId(null);
        }
    };

    return (
        <div className="min-h-screen bg-background px-6 py-10 text-foreground">
            <div className="mx-auto w-full max-w-3xl">
                <Link
                    href="/"
                    className="inline-flex gap-1 items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary"
                >
                    <ArrowLeft className="size-3.5" />
                    Back
                </Link>

                <section className="mt-6 rounded-3xl border border-primary/30 bg-card p-6 shadow-xl sm:p-8">
                    <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                        Login
                    </h1>
                    <p className="mt-3 text-muted-foreground">
                        Select a user to log in for continuing. This is just a
                        simulation, no password needed.
                    </p>

                    <div className="mt-6 space-y-4">
                        {users.map((user) => {
                            const isAdmin = user.role === "ADMIN";
                            const isLoading = loadingUserId === user.id;

                            return (
                                <Button
                                    key={user.id}
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        void handleSelectUser(user);
                                    }}
                                    disabled={loadingUserId !== null}
                                    className="h-auto w-full justify-start rounded-2xl border-primary/30 p-4 text-left hover:bg-primary/10 cursor-pointer"
                                >
                                    <span className="inline-flex items-center gap-3">
                                        <span className="inline-flex size-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
                                            {isAdmin ? (
                                                <ShieldUser className="size-5" />
                                            ) : (
                                                <UserRound className="size-5" />
                                            )}
                                        </span>

                                        <span>
                                            <span className="block text-sm font-semibold text-foreground">
                                                {isLoading
                                                    ? "Signing in..."
                                                    : user.name}
                                            </span>
                                            <span className="block text-xs text-muted-foreground">
                                                Role: {user.role}
                                            </span>
                                        </span>
                                    </span>
                                </Button>
                            );
                        })}
                    </div>
                </section>
            </div>
        </div>
    );
}
