// ── Auth ──────────────────────────────────────────────────────────────────────

/** Public user profile returned after login / register / token refresh. */
export interface AuthUser {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
}

/** Container for tokens exposed to the client (refresh lives in HttpOnly cookie). */
export interface AuthTokens {
    accessToken: string;
}

/** Payload stored inside access & refresh JWTs. */
export interface JwtPayload {
    sub: string;   // userId
    email: string;
    name: string | null;
}
