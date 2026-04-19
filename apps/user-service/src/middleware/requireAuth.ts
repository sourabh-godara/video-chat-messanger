import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import type { JwtPayload } from "@repo/types";

declare global {
    namespace Express {
        interface User extends JwtPayload {}
    }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        res.status(401).json({ success: false, error: "No token provided" });
        return;
    }

    const token = authHeader.slice(7);

    try {
        req.user = verifyAccessToken(token);
        next();
    } catch {
        res.status(401).json({ success: false, error: "Invalid or expired token" });
    }
}