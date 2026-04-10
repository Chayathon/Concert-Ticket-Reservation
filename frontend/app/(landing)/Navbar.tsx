import { Button } from "@/components/ui/button";
import Link from "next/link";

const navItems = [
    { label: "About", href: "#hero" },
    { label: "Features", href: "#features" },
];

export default function Navbar() {
    return (
        <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
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
                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>

                <div className="flex items-center">
                    <Button
                        asChild
                        className="rounded-full bg-primary px-5 text-primary-foreground hover:bg-primary/90"
                    >
                        <Link href="/login">Reserve now</Link>
                    </Button>
                </div>
            </div>
        </header>
    );
}
