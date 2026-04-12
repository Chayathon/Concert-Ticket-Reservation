import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import BookingPage from "@/app/(main)/(user)/reserve/page";
import { api } from "@/lib/api";
import { toast } from "sonner";

jest.mock("@/lib/api", () => ({
    api: {
        get: jest.fn(),
        post: jest.fn(),
        patch: jest.fn(),
    },
}));

jest.mock("sonner", () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

jest.mock("@/components/common/loading", () => () => <div>loading</div>);

jest.mock("@/app/(main)/(user)/reserve/ConcertCard", () => ({
    __esModule: true,
    default: ({
        concert,
        reservationId,
        buttonLabel,
        isSoldOut,
        onReserve,
        onCancel,
    }: {
        concert: { id: number; name: string };
        reservationId?: number;
        buttonLabel: string;
        isSoldOut: boolean;
        onReserve: (id: number) => void;
        onCancel: (concertId: number, reservationId: number) => void;
    }) => (
        <div>
            <span>{concert.name}</span>
            <span>{buttonLabel}</span>
            <span>{isSoldOut ? "sold-out" : "available"}</span>
            <button type="button" onClick={() => onReserve(concert.id)}>
                reserve-{concert.id}
            </button>
            <button
                type="button"
                onClick={() => onCancel(concert.id, reservationId ?? 0)}
            >
                cancel-{concert.id}
            </button>
        </div>
    ),
}));

describe("BookingPage", () => {
    const mockedApi = api as jest.Mocked<typeof api>;

    beforeEach(() => {
        jest.clearAllMocks();

        mockedApi.get.mockImplementation((url: string) => {
            if (url === "/concert") {
                return Promise.resolve({
                    data: [
                        {
                            id: 1,
                            name: "Concert A",
                            description: "A",
                            totalSeats: 1,
                            reserved: 1,
                        },
                        {
                            id: 2,
                            name: "Concert B",
                            description: "B",
                            totalSeats: 3,
                            reserved: 0,
                        },
                    ],
                });
            }

            if (url === "/reservation") {
                return Promise.resolve({
                    data: [{ id: 55, concertId: 1, status: "RESERVED" }],
                });
            }

            return Promise.resolve({ data: [] });
        });
    });

    it("fetches concerts and reservations on mount", async () => {
        render(<BookingPage />);

        await waitFor(() => {
            expect(mockedApi.get).toHaveBeenCalledWith("/concert");
            expect(mockedApi.get).toHaveBeenCalledWith("/reservation");
        });

        expect(await screen.findByText("Concert A")).toBeInTheDocument();
        expect(await screen.findByText("Concert B")).toBeInTheDocument();
    });

    it("reserves seat and refreshes lists", async () => {
        mockedApi.post.mockResolvedValue({ data: { id: 100 } });

        render(<BookingPage />);

        await waitFor(() =>
            expect(screen.getByText("Concert B")).toBeInTheDocument(),
        );

        fireEvent.click(screen.getByRole("button", { name: "reserve-2" }));

        await waitFor(() => {
            expect(mockedApi.post).toHaveBeenCalledWith("/reservation", {
                concertId: 2,
            });
        });

        expect(toast.success).toHaveBeenCalled();
    });

    it("cancels seat and calls cancel API", async () => {
        mockedApi.patch.mockResolvedValue({ data: { id: 55 } });

        render(<BookingPage />);

        await waitFor(() =>
            expect(screen.getByText("Concert A")).toBeInTheDocument(),
        );

        fireEvent.click(screen.getByRole("button", { name: "cancel-1" }));

        await waitFor(() => {
            expect(mockedApi.patch).toHaveBeenCalledWith(
                "/reservation/55/cancel",
            );
        });
    });
});
