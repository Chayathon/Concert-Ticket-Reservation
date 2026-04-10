import { Ban, History, ListMusic, Ticket } from "lucide-react";

const featureItems = [
    {
        icon: ListMusic,
        title: "View All Concerts",
        description:
            "View a comprehensive list of all upcoming concerts with details like date, venue, and available seats, making it easy to find events that interest you.",
    },
    {
        icon: Ticket,
        title: "Reserve 1 Seat Per User",
        description:
            "Limit reservations to 1 seat per user to ensure fair access to tickets.",
    },
    {
        icon: Ban,
        title: "Cancel Reservation",
        description:
            "Cancel reserved seats at any time if your plans change, with automatic seat restoration.",
    },
    {
        icon: History,
        title: "My Reservation History",
        description:
            "View your own reservation history at any time, with clear status updates for each item.",
    },
];

export default function Features() {
    return (
        <section
            id="features"
            className="mx-auto w-full max-w-6xl px-6 py-20 md:py-24"
        >
            <div className="mx-auto max-w-2xl text-center">
                <p className="text-sm font-medium uppercase text-muted-foreground">
                    Features
                </p>
                <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
                    Everything you need to book your next concert.
                </h2>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                {featureItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <article
                            key={item.title}
                            className="rounded-3xl border border-border bg-card p-6 shadow-xl transition-transform duration-200 hover:-translate-y-1"
                        >
                            <div className="inline-flex rounded-2xl bg-primary p-2.5 text-primary-foreground">
                                <Icon className="size-5" />
                            </div>
                            <h3 className="mt-5 text-xl font-semibold text-foreground">
                                {item.title}
                            </h3>
                            <p className="mt-3 leading-7 text-muted-foreground">
                                {item.description}
                            </p>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}
