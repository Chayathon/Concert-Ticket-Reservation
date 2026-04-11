"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
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
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { PenLine, Save, Trash2Icon, User } from "lucide-react";
import type { SubmitEvent } from "react";

type Concert = {
    id: number;
    name: string;
    description: string;
    totalSeats: number;
    reserved: number;
};

type ConcertCardProps = {
    concert: Concert;
    onFetchConcert: (concertId: number) => void | Promise<any>;
    onUpdate: (
        concertId: number,
        e: SubmitEvent<HTMLFormElement>,
    ) => void | Promise<any>;
    onDelete: (concertId: number) => void | Promise<any>;
};

export default function ConcertCard({
    concert,
    onFetchConcert,
    onUpdate,
    onDelete,
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
                <div className="flex gap-2">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                type="button"
                                variant="secondary"
                                className="bg-amber-100 text-amber-600 hover:bg-amber-200"
                                onClick={() => onFetchConcert(concert.id)}
                            >
                                <PenLine className="size-4" />
                                Edit
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-xl">
                            <form onSubmit={(e) => onUpdate(concert.id, e)}>
                                <DialogHeader>
                                    <DialogTitle className="text-2xl text-primary font-bold">
                                        Edit Concert
                                    </DialogTitle>
                                </DialogHeader>
                                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="concertName">
                                            Concert Name
                                        </Label>
                                        <Input
                                            id="concertName"
                                            name="concertName"
                                            placeholder="Please input concert name"
                                            defaultValue={concert.name}
                                            required
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="totalSeat">
                                            Total of seat
                                        </Label>
                                        <InputGroup>
                                            <InputGroupInput
                                                id="totalSeat"
                                                name="totalSeat"
                                                type="number"
                                                min="0"
                                                max="100000"
                                                placeholder="Please input total seat"
                                                defaultValue={
                                                    concert.totalSeats
                                                }
                                                required
                                            />
                                            <InputGroupAddon align="inline-end">
                                                <User className="h-4 w-4" />
                                            </InputGroupAddon>
                                        </InputGroup>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label
                                        htmlFor="description"
                                        className="mt-4"
                                    >
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        placeholder="Please input description"
                                        defaultValue={concert.description}
                                        required
                                    />
                                </div>
                                <DialogFooter className="mt-4">
                                    <DialogClose asChild>
                                        <Button variant="outline">
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                    <Button type="submit">
                                        <Save className="size-4" />
                                        Save changes
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">
                                <Trash2Icon className="size-4" />
                                Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent size="sm">
                            <AlertDialogHeader>
                                <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                                    <Trash2Icon />
                                </AlertDialogMedia>
                                <AlertDialogTitle>
                                    Are you sure to delete?
                                    <br />"
                                    <span className="font-bold">
                                        {concert.name}
                                    </span>
                                    "
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will permanently delete this concert
                                    listing. All reservations for this concert
                                    will also be deleted.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel variant="outline">
                                    Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    variant="destructive"
                                    onClick={() => onDelete(concert.id)}
                                >
                                    Yes, Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </CardFooter>
        </Card>
    );
}
