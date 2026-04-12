import { cn } from "@/lib/utils";

describe("cn", () => {
    it("merges classes and removes duplicates in tailwind groups", () => {
        expect(cn("p-2", "p-4", "text-sm")).toBe("p-4 text-sm");
    });

    it("supports conditional classes", () => {
        expect(cn("base", false && "hidden", true && "block")).toBe(
            "base block",
        );
    });
});
