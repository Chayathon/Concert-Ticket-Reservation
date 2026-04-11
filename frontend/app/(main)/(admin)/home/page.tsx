"use client";

import type { SubmitEvent } from "react";
import Loading from "@/components/common/loading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import CreateConcert from "./CreateConcert";
import ConcertCard from "./ConcertCard";
import Dashboard from "./Dashboard";

export default function HomePage() {
    type Concert = {
        id: number;
        name: string;
        description: string;
        totalSeats: number;
        reserved: number;
    };

    type DashboardSummary = {
        totalSeats: number;
        reserved: number;
        cancelled: number;
    };

    const [concerts, setConcerts] = useState<Concert[]>([]);
    const [concert, setConcert] = useState<Concert | null>(null);
    const [summary, setSummary] = useState<DashboardSummary>({
        totalSeats: 0,
        reserved: 0,
        cancelled: 0,
    });
    const [activeTab, setActiveTab] = useState("overview");

    const [isLoading, setIsLoading] = useState(false);

    const fetchConcerts = async () => {
        setIsLoading(true);
        try {
            const response = await api.get("/concert");
            setConcerts(response.data);
        } catch (error) {
            console.error("Failed to fetch concerts:", error);
            toast.error("Failed to fetch concerts. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchConcertById = async (concertId: number) => {
        try {
            const response = await api.get(`/concert/${concertId}`);

            setConcert(response.data);
        } catch (error) {
            console.error("Failed to fetch concert details:", error);
            toast.error("Failed to fetch concert details. Please try again.");
            return null;
        }
    };

    const fetchDashboardSummary = async () => {
        try {
            const response = await api.get("/reservation/summary");
            setSummary(response.data);
        } catch (error) {
            console.error("Failed to fetch dashboard summary:", error);
            setSummary({
                totalSeats: 0,
                reserved: 0,
                cancelled: 0,
            });
        }
    };

    const createConcert = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get("concertName") as string,
            description: formData.get("description") as string,
            totalSeats: Number(formData.get("totalSeat")),
        };

        setIsLoading(true);
        try {
            await api.post("/concert", data);
            toast.success("Create successfully!");
            await Promise.all([fetchConcerts(), fetchDashboardSummary()]);
            setActiveTab("overview");
        } catch (error) {
            console.error("Failed to create concert:", error);
            toast.error("Failed to create concert. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const updateConcert = async (
        concertId: number,
        e: SubmitEvent<HTMLFormElement>,
    ) => {
        setIsLoading(true);
        try {
            const formData = new FormData(e.currentTarget);
            const data = {
                name: formData.get("concertName") as string,
                description: formData.get("description") as string,
                totalSeats: Number(formData.get("totalSeat")),
            };
            await api.patch(`/concert/${concertId}`, data);
            toast.success("Update successfully!");
            await Promise.all([fetchConcerts(), fetchDashboardSummary()]);
        } catch (error: any) {
            console.error("Failed to update concert:", error);
            toast.error(
                error.response.data.message ||
                    "Failed to update concert. Please try again.",
            );
        } finally {
            setIsLoading(false);
        }
    };

    const deleteConcert = async (concertId: number) => {
        setIsLoading(true);
        try {
            await api.delete(`/concert/${concertId}`);
            toast.success("Delete successfully!");
            await Promise.all([fetchConcerts(), fetchDashboardSummary()]);
        } catch (error) {
            console.error("Failed to delete concert:", error);
            toast.error("Failed to delete concert. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchConcerts();
        fetchDashboardSummary();
    }, []);

    return (
        <div className="p-4">
            <Dashboard
                totalSeats={summary.totalSeats}
                reservedSeats={summary.reserved}
                cancelledCount={summary.cancelled}
            />
            <div className="mt-4">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList variant="line">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="create">Create</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview">
                        {isLoading ? (
                            <Loading />
                        ) : (
                            <div className="pt-2 flex flex-col gap-4">
                                {concerts.map((concert) => (
                                    <ConcertCard
                                        key={concert.id}
                                        concert={concert}
                                        onFetchConcert={fetchConcertById}
                                        onUpdate={updateConcert}
                                        onDelete={deleteConcert}
                                    />
                                ))}
                            </div>
                        )}
                    </TabsContent>
                    <TabsContent value="create">
                        <div className="pt-2">
                            <CreateConcert onSubmit={createConcert} />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
