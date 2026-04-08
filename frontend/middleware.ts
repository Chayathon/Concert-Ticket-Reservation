import { NextRequest, NextResponse } from "next/server";
import {
    AUTH_COOKIE_NAME,
    ADMIN_HOME_PATH,
    BOOKING_PATH,
    LOGIN_PATH,
} from "@/lib/auth";

function redirectTo(request: NextRequest, pathname: string): NextResponse {
    const url = request.nextUrl.clone();
    url.pathname = pathname;
    return NextResponse.redirect(url);
}

function parseAuthUserFromCookie(request: NextRequest) {
    const cookieValue = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (!cookieValue) {
        return null;
    }
    const parsed = decodeURIComponent(cookieValue);

    return JSON.parse(parsed);
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isLoginPath = pathname === LOGIN_PATH;
    const isBookingPath = pathname === BOOKING_PATH;
    const isAdminPath = pathname === "/admin" || pathname.startsWith("/admin/");

    const authUser = parseAuthUserFromCookie(request);

    if (!authUser) {
        if (isBookingPath || isAdminPath) {
            return redirectTo(request, LOGIN_PATH);
        }

        return NextResponse.next();
    }

    if (isLoginPath) {
        return redirectTo(
            request,
            authUser.role === "ADMIN" ? ADMIN_HOME_PATH : BOOKING_PATH,
        );
    }

    if (authUser.role === "USER" && isAdminPath) {
        return redirectTo(request, BOOKING_PATH);
    }

    if (authUser.role === "ADMIN") {
        if (isBookingPath) {
            return redirectTo(request, ADMIN_HOME_PATH);
        }

        if (pathname === "/admin") {
            return redirectTo(request, ADMIN_HOME_PATH);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/login",
        "/booking",
        "/booking/:path*",
        "/admin",
        "/admin/:path*",
    ],
};
