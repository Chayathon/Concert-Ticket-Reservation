export type Role = "USER" | "ADMIN";

export type AuthUser = {
    id: number;
    name: string;
    role: Role;
};

export const AUTH_COOKIE_NAME = "user";
export const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export const LOGIN_PATH = "/login";
export const BOOKING_PATH = "/booking";
export const ADMIN_HOME_PATH = "/admin/home";

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
