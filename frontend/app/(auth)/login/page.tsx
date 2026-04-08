"use client";

import { Button } from "@/components/ui/button";
import { User, users } from "@/lib/auth";
import { ArrowLeft, ShieldUser, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();

    const handleSelectUser = (user: User) => {
        const userData = encodeURIComponent(
            JSON.stringify({
                id: user.id,
                name: user.name,
                role: user.role,
            }),
        );
        const maxAge = 60 * 60 * 24 * 7;
        document.cookie = `user=${userData}; path=/; max-age=${maxAge}; SameSite=Lax`;

        localStorage.setItem("user", userData);

        const targetPath = user.role === "ADMIN" ? "/admin/home" : "/booking";
        router.push(targetPath);
    };

    return (
        <div className="min-h-screen bg-white px-6 py-10 text-zinc-900">
            <div className="mx-auto w-full max-w-3xl">
                <Link
                    href="/"
                    className="inline-flex gap-1 items-center rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-sm font-medium text-violet-700"
                >
                    <ArrowLeft className="size-3.5" />
                    Back
                </Link>

                <section className="mt-6 rounded-3xl border border-violet-200 bg-white p-6 shadow-xl sm:p-8">
                    <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
                        Login
                    </h1>
                    <p className="mt-3 text-zinc-600">
                        Select a user to log in for continuing. This is just a
                        simulation, no password needed.
                    </p>

                    <div className="mt-6 space-y-4">
                        {users.map((user) => {
                            const isAdmin = user.role === "ADMIN";

                            return (
                                <Button
                                    key={user.id}
                                    type="button"
                                    variant="outline"
                                    onClick={() => handleSelectUser(user)}
                                    className="h-auto w-full justify-start rounded-2xl border-violet-200 p-4 text-left hover:bg-violet-50 cursor-pointer"
                                >
                                    <span className="inline-flex items-center gap-3">
                                        <span className="inline-flex size-9 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                                            {isAdmin ? (
                                                <ShieldUser className="size-5" />
                                            ) : (
                                                <UserRound className="size-5" />
                                            )}
                                        </span>

                                        <span>
                                            <span className="block text-sm font-semibold text-zinc-900">
                                                {user.name}
                                            </span>
                                            <span className="block text-xs text-zinc-500">
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
