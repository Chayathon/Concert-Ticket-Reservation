"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Save, User } from "lucide-react";
import type { SubmitEvent } from "react";

type CreateConcertProps = {
    onSubmit: (e: SubmitEvent<HTMLFormElement>) => void | Promise<void>;
};

export default function CreateConcert({ onSubmit }: CreateConcertProps) {
    return (
        <Card className="w-full shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl text-primary font-bold">
                    Create
                </CardTitle>
            </CardHeader>
            <Separator />
            <form onSubmit={onSubmit}>
                <CardContent>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="concertName">Concert Name</Label>
                            <Input
                                id="concertName"
                                name="concertName"
                                placeholder="Please input concert name"
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="totalSeat">Total of seat</Label>
                            <InputGroup>
                                <InputGroupInput
                                    id="totalSeat"
                                    name="totalSeat"
                                    type="number"
                                    min="0"
                                    max="100000"
                                    placeholder="Please input total seat"
                                    required
                                />
                                <InputGroupAddon align="inline-end">
                                    <User className="h-4 w-4" />
                                </InputGroupAddon>
                            </InputGroup>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="description" className="mt-4">
                            Description
                        </Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Please input description"
                            required
                        />
                    </div>
                </CardContent>
                <CardFooter className="mt-4 flex justify-end">
                    <Button type="submit">
                        <Save className="size-4" />
                        Save
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
