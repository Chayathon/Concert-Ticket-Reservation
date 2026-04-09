import { NextRequest, NextResponse } from "next/server";
import {
    ACCESS_TOKEN_COOKIE_NAME,
    ADMIN_HOME_PATH,
    RESERVE_PATH,
    HISTORY_PATH,
    LOGIN_PATH,
    type Role,
} from "@/lib/auth";
import { api } from "./lib/api";

function redirectTo(request: NextRequest, pathname: string): NextResponse {
    const url = request.nextUrl.clone();
    url.pathname = pathname;
    return NextResponse.redirect(url);
}

type CurrentUserResponse = { user: { id: number; role: Role } };

async function verifyAccessToken(request: NextRequest) {
    const token = request.cookies.get(ACCESS_TOKEN_COOKIE_NAME)?.value;
    if (!token) {
        return null;
    }

    try {
        const response = await api.get("/auth/me", {
            headers: {
                Cookie: `${ACCESS_TOKEN_COOKIE_NAME}=${encodeURIComponent(
                    token,
                )}`,
            },
        });

        const data = response.data as CurrentUserResponse;
        return { userId: data.user.id, role: data.user.role };
    } catch (error) {
        console.error("Failed to verify access token:", error);
        return null;
    }
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isLoginPath = pathname === LOGIN_PATH;
    const isReservePath = pathname === RESERVE_PATH;
    const isHistoryPath = pathname === HISTORY_PATH;
    const isAdminPath = pathname === ADMIN_HOME_PATH;

    const authUser = await verifyAccessToken(request);

    if (!authUser) {
        if (isReservePath || isHistoryPath || isAdminPath) {
            return redirectTo(request, LOGIN_PATH);
        }

        return NextResponse.next();
    }

    if (isLoginPath) {
        return redirectTo(
            request,
            authUser.role === "ADMIN" ? ADMIN_HOME_PATH : RESERVE_PATH,
        );
    }

    if (authUser.role === "USER" && isAdminPath) {
        return redirectTo(request, RESERVE_PATH);
    }

    if (authUser.role === "ADMIN") {
        if (isReservePath) {
            return redirectTo(request, ADMIN_HOME_PATH);
        }

        if (pathname === "/admin") {
            return redirectTo(request, ADMIN_HOME_PATH);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/login", "/reserve", "/history", "/home"],
};
