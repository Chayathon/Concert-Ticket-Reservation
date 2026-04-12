/** @jest-environment node */

import { api } from "@/lib/api";

const { middleware } = require("@/middleware");

jest.mock("@/lib/api", () => ({
    api: {
        get: jest.fn(),
    },
}));

function makeRequest(pathname: string, token?: string) {
    const nextUrl = new URL(`http://localhost${pathname}`) as URL & {
        clone: () => URL;
    };
    nextUrl.clone = () => new URL(nextUrl.toString());

    return {
        nextUrl,
        cookies: {
            get: jest.fn((name: string) => {
                if (name === "accessToken" && token) {
                    return { value: token };
                }
                return undefined;
            }),
        },
    } as any;
}

describe("middleware", () => {
    const mockedApi = api as jest.Mocked<typeof api>;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("redirects unauthenticated user from protected route to login", async () => {
        const request = makeRequest("/reserve");

        const response = await middleware(request);

        expect(response.headers.get("location")).toBe("http://localhost/login");
    });

    it("redirects USER away from admin home", async () => {
        mockedApi.get.mockResolvedValue({
            data: {
                user: {
                    id: 1,
                    role: "USER",
                },
            },
        });

        const request = makeRequest("/home", "token");

        const response = await middleware(request);

        expect(response.headers.get("location")).toBe(
            "http://localhost/reserve",
        );
    });

    it("redirects ADMIN from reserve route to admin home", async () => {
        mockedApi.get.mockResolvedValue({
            data: {
                user: {
                    id: 2,
                    role: "ADMIN",
                },
            },
        });

        const request = makeRequest("/reserve", "token");

        const response = await middleware(request);

        expect(response.headers.get("location")).toBe("http://localhost/home");
    });

    it("redirects authenticated users away from login page by role", async () => {
        mockedApi.get.mockResolvedValue({
            data: {
                user: {
                    id: 2,
                    role: "ADMIN",
                },
            },
        });

        const request = makeRequest("/login", "token");

        const response = await middleware(request);

        expect(response.headers.get("location")).toBe("http://localhost/home");
    });
});
