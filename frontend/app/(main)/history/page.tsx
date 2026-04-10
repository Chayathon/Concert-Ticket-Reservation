"use client";

import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import HistoryTable from "./HistoryTable";
import Loading from "@/components/common/loading";

export default function HistoryPage() {
    type Reservation = {
        id: number;
        createdAt: string;
        reservation: {
            user: {
                name: string;
            };
            concert: {
                name: string;
            };
        };
        event: string;
    };

    const [reservationEvents, setReservationEvents] = useState<Reservation[]>(
        [],
    );

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchResevationEvents = async () => {
            setIsLoading(true);
            try {
                const response = await api.get("/reservation/events");
                setReservationEvents(response.data);
            } catch (error) {
                toast.error(
                    "Failed to fetch reservation events. Please try again.",
                );
                console.error("Failed to fetch reservation events:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchResevationEvents();
    }, []);

    return isLoading ? (
        <Loading />
    ) : (
        <div className="p-4">
            <HistoryTable reservationEvents={reservationEvents} />
        </div>
    );
}
