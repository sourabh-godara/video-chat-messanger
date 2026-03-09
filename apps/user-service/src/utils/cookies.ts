import type { Response } from "express";

const COOKIE_NAME = "refresh_token";
const IS_PROD = process.env.NODE_ENV === "production";

export function setRefreshCookie(res: Response, token: string) {
    res.cookie(COOKIE_NAME, token, {
        httpOnly: true,          // not accessible from JS — XSS protection
        secure: IS_PROD,         // HTTPS only in production
        sameSite: IS_PROD ? "strict" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
        path: "/auth",           // only sent on /auth/* routes — reduces attack surface
    });
}

export function clearRefreshCookie(res: Response) {
    res.clearCookie(COOKIE_NAME, { path: "/auth" });
}

export function getRefreshCookie(cookies: Record<string, string>): string | undefined {
    return cookies[COOKIE_NAME];
}