import Link from "next/link";

const footerLinks = [
    { label: "About", href: "#hero" },
    { label: "Features", href: "#features" },
];

export default function Footer() {
    return (
        <footer id="footer" className="border-t border-zinc-200 bg-white/70">
            <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-zinc-500 md:flex-row">
                <p>
                    &copy; {new Date().getFullYear()} Concertly. All rights
                    reserved.
                </p>

                <div className="flex items-center gap-5">
                    {footerLinks.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="transition-colors hover:text-black"
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            </div>
        </footer>
    );
}
