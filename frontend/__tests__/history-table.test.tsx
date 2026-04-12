import { render, screen } from "@testing-library/react";
import HistoryTable from "@/app/(main)/history/HistoryTable";

jest.mock("@/lib/date", () => ({
    formatDateTime: jest.fn(() => "2026/4/11, 12:00:00"),
}));

describe("HistoryTable", () => {
    it("renders reservation events data in table rows", () => {
        render(
            <HistoryTable
                reservationEvents={[
                    {
                        id: 1,
                        createdAt: "2026-04-11T12:00:00.000Z",
                        reservation: {
                            user: { name: "Alice" },
                            concert: { name: "Rock Live" },
                        },
                        event: "RESERVED",
                    },
                ]}
            />,
        );

        expect(screen.getByText("Date time")).toBeInTheDocument();
        expect(screen.getByText("Alice")).toBeInTheDocument();
        expect(screen.getByText("Rock Live")).toBeInTheDocument();
        expect(screen.getByText("RESERVED")).toBeInTheDocument();
        expect(screen.getByText("2026/4/11, 12:00:00")).toBeInTheDocument();
    });
});
