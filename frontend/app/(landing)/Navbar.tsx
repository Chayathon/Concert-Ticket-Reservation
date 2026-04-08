import { Button } from "@/components/ui/button";
import Link from "next/link";

const navItems = [
    { label: "About", href: "#hero" },
    { label: "Features", href: "#features" },
];

export default function Navbar() {
    return (
        <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/70 backdrop-blur-xl">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
                <Link
                    href="#hero"
                    className="text-lg font-semibold tracking-tight"
                >
                    Concertly
                </Link>

                <nav className="hidden items-center gap-8 md:flex">
                    {navItems.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            className="text-sm text-zinc-600 transition-colors hover:text-black"
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>

                <div className="flex items-center">
                    <Button
                        asChild
                        className="rounded-full bg-zinc-900 px-5 text-white hover:bg-zinc-700"
                    >
                        <Link href="/booking">Book now</Link>
                    </Button>
                </div>
            </div>
        </header>
    );
}
