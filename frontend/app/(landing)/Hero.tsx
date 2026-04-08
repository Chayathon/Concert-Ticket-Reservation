import { Button } from "@/components/ui/button";
import { ArrowRight, CalendarDays, MapPin, Sparkles } from "lucide-react";
import Link from "next/link";

const stats = [
    { label: "Events", value: "1,200+" },
    { label: "Tickets sold", value: "95K+" },
    { label: "Happy fans", value: "4.9/5" },
];

const upcomingShows = [
    {
        title: "Synthwave Night",
        venue: "Skyline Arena",
        date: "May 18",
    },
    {
        title: "City Lights Tour",
        venue: "Riverfront Hall",
        date: "May 23",
    },
    {
        title: "Acoustic Weekend",
        venue: "Moonrise Dome",
        date: "Jun 02",
    },
];

export default function Hero() {
    return (
        <section
            id="hero"
            className="mx-auto grid w-full max-w-6xl gap-12 px-6 pb-20 pt-16 md:grid-cols-2 md:items-center md:pt-24"
        >
            <div className="animate-in fade-in-0 slide-in-from-bottom-6 duration-700">
                <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-medium text-violet-900">
                    <Sparkles className="size-3.5" />
                    Fast booking for live concerts
                </div>

                <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
                    Find your next concert and reserve your seat in minutes.
                </h1>

                <p className="mt-6 max-w-xl text-base text-zinc-600 sm:text-lg">
                    A calm and simple way to discover events, get your e-ticket
                    instantly. No long forms, no stress, just music.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                    <Link href="/login">
                        <Button className="h-11 rounded-full bg-zinc-900 px-6 text-white hover:bg-zinc-700 cursor-pointer">
                            Start booking
                            <ArrowRight className="size-4" />
                        </Button>
                    </Link>
                    <Button
                        variant="outline"
                        asChild
                        className="h-11 rounded-full border-zinc-300 bg-white px-6"
                    >
                        <a href="#features">See features</a>
                    </Button>
                </div>

                <div className="mt-10 grid max-w-md grid-cols-3 gap-3">
                    {stats.map((item) => (
                        <div
                            key={item.label}
                            className="rounded-2xl border border-zinc-300 px-4 py-3"
                        >
                            <p className="text-lg font-semibold text-zinc-900">
                                {item.value}
                            </p>
                            <p className="text-xs text-zinc-500">
                                {item.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="animate-in fade-in-0 slide-in-from-bottom-6 duration-1000">
                <div className="rounded-3xl border border-zinc-300 p-5 shadow-xl">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-medium">Upcoming shows</h2>
                        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs text-emerald-700">
                            Live
                        </span>
                    </div>

                    <div className="mt-4 space-y-3">
                        {upcomingShows.map((show) => (
                            <div
                                key={show.title}
                                className="rounded-2xl border border-zinc-900/10 bg-white p-4"
                            >
                                <p className="font-medium text-zinc-900">
                                    {show.title}
                                </p>
                                <div className="mt-2 flex items-center gap-3 text-xs text-zinc-500">
                                    <span className="inline-flex items-center gap-1">
                                        <MapPin className="size-3.5" />
                                        {show.venue}
                                    </span>
                                    <span className="inline-flex items-center gap-1">
                                        <CalendarDays className="size-3.5" />
                                        {show.date}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
