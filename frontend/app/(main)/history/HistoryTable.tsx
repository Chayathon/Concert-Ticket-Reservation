import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { formatDateTime } from "@/lib/date";

type ReservationEvent = {
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

type HistoryTableProps = {
    reservationEvents: ReservationEvent[];
};

export default function HistoryTable({ reservationEvents }: HistoryTableProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Date time</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Concert name</TableHead>
                    <TableHead>Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {reservationEvents.map((event) => (
                    <TableRow key={event.id}>
                        <TableCell>{formatDateTime(event.createdAt)}</TableCell>
                        <TableCell>{event.reservation?.user.name}</TableCell>
                        <TableCell>{event.reservation?.concert.name}</TableCell>
                        <TableCell>{event.event}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
