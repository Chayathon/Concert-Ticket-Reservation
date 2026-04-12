import { formatDateTime } from "@/lib/date";

describe("formatDateTime", () => {
    it("returns a formatted datetime string", () => {
        const result = formatDateTime("2026-04-11T12:34:56.000Z");

        expect(typeof result).toBe("string");
        expect(result.length).toBeGreaterThan(0);
    });

    it("handles invalid date string without throwing", () => {
        expect(() => formatDateTime("invalid-date")).not.toThrow();
    });
});
