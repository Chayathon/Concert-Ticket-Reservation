import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Award, CircleX, User } from "lucide-react";

type DashboardProps = {
    totalSeats: number;
    reservedSeats: number;
    cancelledCount: number;
};

export default function Dashboard({
    totalSeats,
    reservedSeats,
    cancelledCount,
}: DashboardProps) {
    const cards = [
        {
            title: "Total of seats",
            value: totalSeats,
            icon: User,
            className: "bg-sky-700 md:col-span-2 lg:col-span-1",
        },
        {
            title: "Reserve",
            value: reservedSeats,
            icon: Award,
            className: "bg-teal-600",
        },
        {
            title: "Cancel",
            value: cancelledCount,
            icon: CircleX,
            className: "bg-rose-500",
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 pb-2 md:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => {
                const Icon = card.icon;

                return (
                    <Card
                        key={card.title}
                        className={`${card.className} rounded-md py-5 text-white shadow-lg`}
                    >
                        <CardHeader className="px-4">
                            <div className="flex flex-col items-center gap-1 text-center">
                                <Icon className="size-10" />
                                <p className="mt-2 text-xl">{card.title}</p>
                            </div>
                        </CardHeader>
                        <CardContent className="px-4 py-2 text-center">
                            <p className="text-5xl leading-none">
                                {card.value.toLocaleString()}
                            </p>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
