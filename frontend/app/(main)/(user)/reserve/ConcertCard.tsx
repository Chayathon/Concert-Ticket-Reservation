"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Ticket, TicketX, User, X } from "lucide-react";

type Concert = {
    id: number;
    name: string;
    description: string;
    totalSeats: number;
    reserved: number;
};

type ConcertCardProps = {
    concert: Concert;
    reservationId?: number;
    isReserved: boolean;
    isSoldOut: boolean;
    isProcessing: boolean;
    buttonLabel: string;
    onReserve: (concertId: number) => void | Promise<void>;
    onCancel: (
        concertId: number,
        reservationId: number,
    ) => void | Promise<void>;
};

export default function ConcertCard({
    concert,
    reservationId,
    isReserved,
    isSoldOut,
    isProcessing,
    buttonLabel,
    onReserve,
    onCancel,
}: ConcertCardProps) {
    return (
        <Card className="w-full shadow-lg">
            <CardHeader>
                <h2 className="text-2xl font-bold">{concert.name}</h2>
            </CardHeader>
            <Separator />
            <CardContent>
                <p>{concert.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
                <p className="flex items-center gap-2">
                    <User className="size-4" />
                    {concert.reserved} / {concert.totalSeats}
                </p>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant={isReserved ? "destructive" : "default"}
                            disabled={isSoldOut || isProcessing}
                        >
                            {isSoldOut ? (
                                <TicketX className="size-4" />
                            ) : isReserved ? (
                                <X className="size-4" />
                            ) : (
                                <Ticket className="size-4" />
                            )}
                            {buttonLabel}
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent size="sm">
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                {isReserved
                                    ? "Confirm cancellation"
                                    : "Confirm reservation"}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                {isReserved ? (
                                    <>
                                        Are you sure to cancel your reservation
                                        for
                                        <br />
                                        <span className="font-semibold">
                                            "{concert.name}"
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        Are you sure to reserve a seat for
                                        <br />
                                        <span className="font-semibold">
                                            "{concert.name}"
                                        </span>
                                    </>
                                )}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel variant="outline">
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                variant={isReserved ? "destructive" : "default"}
                                onClick={() => {
                                    if (isReserved) {
                                        onCancel(concert.id, reservationId!);
                                    } else {
                                        onReserve(concert.id);
                                    }
                                }}
                                disabled={isProcessing}
                            >
                                {isProcessing ? (
                                    <Spinner data-icon="inline-start" />
                                ) : null}
                                Confirm
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardFooter>
        </Card>
    );
}
