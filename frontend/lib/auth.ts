import { api } from "./api";

export type Role = "USER" | "ADMIN";

export type AuthUser = {
    id: number;
    name: string;
    role: Role;
};

export const ACCESS_TOKEN_COOKIE_NAME = "accessToken";

export const LOGIN_PATH = "/login";
export const RESERVE_PATH = "/reserve";
export const HISTORY_PATH = "/history";
export const ADMIN_HOME_PATH = "/home";

export type User = {
    id: number;
    name: string;
    role: Role;
};

export const users: User[] = [
    { id: 1, name: "John Doe", role: "USER" },
    { id: 2, name: "Jane Doe", role: "USER" },
    { id: 3, name: "Admin", role: "ADMIN" },
];

export async function loginByUserId(userId: number) {
    const response = await api.post("/auth/login", { userId });
    return response.data;
}

export async function logoutAuth(): Promise<void> {
    await api.post("/auth/logout");
}

export async function getCurrentAuthUser(): Promise<AuthUser | null> {
    const response = await api.get("/auth/me");
    return response.data.user;
}
