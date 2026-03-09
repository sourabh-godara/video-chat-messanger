import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
const ACCESS_EXPIRES = "15m";
const REFRESH_EXPIRES = "7d";

export interface JwtPayload {
    sub: string;   // userId
    email: string;
    name: string | null;
}

// ─── Access Token ─────────────────────────────────────────────────────────────
// Short-lived (15min), stored in memory on the client

export function signAccessToken(payload: JwtPayload): string {
    return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES });
}

export function verifyAccessToken(token: string): JwtPayload {
    return jwt.verify(token, ACCESS_SECRET) as JwtPayload;
}

// ─── Refresh Token ────────────────────────────────────────────────────────────
// Long-lived (7d), stored in HttpOnly cookie

export function signRefreshToken(payload: JwtPayload): string {
    return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES });
}

export function verifyRefreshToken(token: string): JwtPayload {
    return jwt.verify(token, REFRESH_SECRET) as JwtPayload;
}

// ─── Password Reset Token ─────────────────────────────────────────────────────
// One-time use, 15 min, signed with access secret + user's current password hash
// This makes the token auto-invalidate once the password changes

export function signResetToken(userId: string, passwordHash: string): string {
    return jwt.sign({ sub: userId }, ACCESS_SECRET + passwordHash, {
        expiresIn: "15m",
    });
}

export function verifyResetToken(
    token: string,
    passwordHash: string
): { sub: string } {
    return jwt.verify(token, ACCESS_SECRET + passwordHash) as { sub: string };
}