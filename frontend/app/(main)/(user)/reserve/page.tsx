"use client";

import Loading from "@/components/common/loading";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ConcertCard from "./ConcertCard";

export default function BookingPage() {
    type Concert = {
        id: number;
        name: string;
        description: string;
        totalSeats: number;
        reserved: number;
    };

    type Reservation = {
        id: number;
        concertId: number;
        status: "RESERVED" | "CANCELLED";
    };

    const [concerts, setConcerts] = useState<Concert[]>([]);
    const [reservedByConcertId, setReservedByConcertId] = useState<
        Reservation[]
    >([]);

    const [isLoading, setIsLoading] = useState(false);
    const [isReserving, setIsReserving] = useState<number | null>(null);

    const fetchConcertsAndReservations = async () => {
        setIsLoading(true);
        try {
            const [concertsResponse, reservationsResponse] = await Promise.all([
                api.get("/concert"),
                api.get("/reservation"),
            ]);

            setConcerts(concertsResponse.data);

            const reservedFilter = reservationsResponse.data.filter(
                (res: Reservation) => res.status === "RESERVED",
            );

            setReservedByConcertId(reservedFilter);
        } catch (error) {
            console.error("Failed to fetch concerts:", error);
            toast.error("Failed to fetch concerts. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const reserveSeat = async (concertId: number) => {
        setIsReserving(concertId);
        try {
            await api.post("/reservation", { concertId });

            toast.success("Seat reserved successfully!");
            await fetchConcertsAndReservations();
        } catch (error) {
            console.error("Failed to reserve seat:", error);
            toast.error("Failed to reserve seat. Please try again.");
        } finally {
            setIsReserving(null);
        }
    };

    const cancelSeat = async (concertId: number, reservationId: number) => {
        setIsReserving(concertId);
        try {
            await api.patch(`/reservation/${reservationId}/cancel`);

            toast.success("Seat canceled successfully!");
            await fetchConcertsAndReservations();
        } catch (error) {
            console.error("Failed to cancel seat:", error);
            toast.error("Failed to cancel seat. Please try again.");
        } finally {
            setIsReserving(null);
        }
    };

    useEffect(() => {
        fetchConcertsAndReservations();
    }, []);

    return (
        <div className="p-4 flex flex-col gap-4">
            {isLoading ? (
                <Loading />
            ) : (
                concerts.map((concert) => {
                    const reservationId = reservedByConcertId.find(
                        (res) => res.concertId === concert.id,
                    )?.id;

                    const isReserved = Boolean(reservationId);
                    const isSoldOut =
                        !isReserved && concert.reserved === concert.totalSeats;
                    const isProcessing = isReserving === concert.id;

                    const buttonLabel = isSoldOut
                        ? "Sold Out"
                        : isReserved
                          ? "Cancel"
                          : "Reserve";

                    return (
                        <ConcertCard
                            key={concert.id}
                            concert={concert}
                            reservationId={reservationId}
                            isReserved={isReserved}
                            isSoldOut={isSoldOut}
                            isProcessing={isProcessing}
                            buttonLabel={buttonLabel}
                            onReserve={reserveSeat}
                            onCancel={cancelSeat}
                        />
                    );
                })
            )}
        </div>
    );
}
