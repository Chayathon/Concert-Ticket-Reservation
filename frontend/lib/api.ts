import axios from "axios";

function resolveApiBaseUrl(): string {
    const publicApiUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001/api";

    // In server-side contexts (middleware, SSR), Docker needs service-to-service URL.
    if (typeof window === "undefined") {
        return process.env.API_BASE_URL_SERVER ?? publicApiUrl;
    }

    return publicApiUrl;
}

export const api = axios.create({
    baseURL: resolveApiBaseUrl(),
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});
