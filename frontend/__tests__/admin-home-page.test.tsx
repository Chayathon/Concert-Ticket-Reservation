import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import HomePage from "@/app/(main)/(admin)/home/page";
import { api } from "@/lib/api";
import { toast } from "sonner";

jest.mock("@/lib/api", () => ({
    api: {
        get: jest.fn(),
        post: jest.fn(),
        patch: jest.fn(),
        delete: jest.fn(),
    },
}));

jest.mock("sonner", () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

jest.mock("@/components/common/loading", () => () => <div>loading</div>);

jest.mock("@/components/ui/tabs", () => ({
    Tabs: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
    TabsList: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
    TabsTrigger: ({ children }: { children: React.ReactNode }) => (
        <button type="button">{children}</button>
    ),
    TabsContent: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
}));

jest.mock("@/app/(main)/(admin)/home/Dashboard", () => ({
    __esModule: true,
    default: () => <div>dashboard</div>,
}));

jest.mock("@/app/(main)/(admin)/home/CreateConcert", () => ({
    __esModule: true,
    default: ({
        onSubmit,
    }: {
        onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    }) => (
        <form onSubmit={onSubmit} aria-label="create-form">
            <input name="concertName" defaultValue="New Concert" />
            <input name="totalSeat" defaultValue="200" />
            <textarea name="description" defaultValue="Desc" />
            <button type="submit">submit-create</button>
        </form>
    ),
}));

jest.mock("@/app/(main)/(admin)/home/ConcertCard", () => ({
    __esModule: true,
    default: ({
        concert,
        onFetchConcert,
        onUpdate,
        onDelete,
    }: {
        concert: { id: number; name: string };
        onFetchConcert: (id: number) => void;
        onUpdate: (id: number, e: React.FormEvent<HTMLFormElement>) => void;
        onDelete: (id: number) => void;
    }) => (
        <div>
            <span>{concert.name}</span>
            <button type="button" onClick={() => onFetchConcert(concert.id)}>
                fetch-{concert.id}
            </button>
            <form
                onSubmit={(e) => onUpdate(concert.id, e)}
                aria-label={`update-${concert.id}`}
            >
                <input name="concertName" defaultValue="Updated Concert" />
                <input name="totalSeat" defaultValue="250" />
                <textarea name="description" defaultValue="Updated Desc" />
                <button type="submit">update-{concert.id}</button>
            </form>
            <button type="button" onClick={() => onDelete(concert.id)}>
                delete-{concert.id}
            </button>
        </div>
    ),
}));

describe("Admin HomePage", () => {
    const mockedApi = api as jest.Mocked<typeof api>;

    beforeEach(() => {
        jest.clearAllMocks();

        mockedApi.get.mockImplementation((url: string) => {
            if (url === "/concert") {
                return Promise.resolve({
                    data: [
                        {
                            id: 1,
                            name: "A",
                            description: "d",
                            totalSeats: 10,
                            reserved: 1,
                        },
                    ],
                });
            }

            if (url === "/reservation/summary") {
                return Promise.resolve({
                    data: { totalSeats: 10, reserved: 1, cancelled: 0 },
                });
            }

            if (url === "/concert/1") {
                return Promise.resolve({
                    data: {
                        id: 1,
                        name: "A",
                        description: "d",
                        totalSeats: 10,
                        reserved: 1,
                    },
                });
            }

            return Promise.resolve({ data: {} });
        });
    });

    it("fetches concerts and summary on mount", async () => {
        render(<HomePage />);

        await waitFor(() => {
            expect(mockedApi.get).toHaveBeenCalledWith("/concert");
            expect(mockedApi.get).toHaveBeenCalledWith("/reservation/summary");
        });

        expect(screen.getByText("A")).toBeInTheDocument();
    });

    it("creates a concert and refreshes dashboard data", async () => {
        mockedApi.post.mockResolvedValue({ data: { id: 2 } });

        render(<HomePage />);

        fireEvent.submit(screen.getByLabelText("create-form"));

        await waitFor(() => {
            expect(mockedApi.post).toHaveBeenCalledWith("/concert", {
                name: "New Concert",
                description: "Desc",
                totalSeats: 200,
            });
        });

        expect(toast.success).toHaveBeenCalled();
        expect(mockedApi.get).toHaveBeenCalledWith("/concert");
        expect(mockedApi.get).toHaveBeenCalledWith("/reservation/summary");
    });

    it("updates and deletes a concert", async () => {
        mockedApi.patch.mockResolvedValue({ data: { id: 1 } });
        mockedApi.delete.mockResolvedValue({ data: { id: 1 } });

        render(<HomePage />);

        await waitFor(() => expect(screen.getByText("A")).toBeInTheDocument());

        fireEvent.click(screen.getByRole("button", { name: "fetch-1" }));
        fireEvent.submit(screen.getByLabelText("update-1"));

        await waitFor(() => {
            expect(mockedApi.patch).toHaveBeenCalledWith("/concert/1", {
                name: "Updated Concert",
                description: "Updated Desc",
                totalSeats: 250,
            });
        });

        fireEvent.click(screen.getByRole("button", { name: "delete-1" }));

        await waitFor(() => {
            expect(mockedApi.delete).toHaveBeenCalledWith("/concert/1");
        });
    });
});
