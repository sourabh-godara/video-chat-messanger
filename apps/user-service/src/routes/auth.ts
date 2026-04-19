import { Router, type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import passport from "passport";
import { Strategy as GoogleStrategy, type Profile } from "passport-google-oauth20";
import prisma from "@repo/prisma";
import {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
    signResetToken,
    verifyResetToken,
    verifyAccessToken,
} from "../utils/jwt";
import { setRefreshCookie, clearRefreshCookie, getRefreshCookie } from "../utils/cookies";
import { sendPasswordResetEmail } from "../utils/email";
import { validate } from "../middleware/validate";
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from "../schemas/auth.schema";

const router = Router();

const CLIENT_URL = process.env.CLIENT_URL ?? "http://localhost:3000";
const SERVER_URL = process.env.SERVER_URL ?? "http://localhost:8531";
const BCRYPT_ROUNDS = 12;


function makePayload(user: { id: string; email: string; name: string | null }) {
    return { sub: user.id, email: user.email, name: user.name };
}

function makePublicUser(user: { id: string; email: string; name: string | null; image: string | null }) {
    return { id: user.id, email: user.email, name: user.name, image: user.image };
}

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            // Must match exactly what's registered in Google Console
            callbackURL: `${SERVER_URL}/api/auth/google/callback`,
        },
        async (_accessToken, _refreshToken, profile: Profile, done) => {
            try {
                const email = profile.emails?.[0]?.value;
                if (!email) return done(new Error("No email from Google"));

                const user = await prisma.user.upsert({
                    where: { email },
                    update: {
                        name: profile.displayName,
                        image: profile.photos?.[0]?.value ?? null,
                    },
                    create: {
                        email,
                        name: profile.displayName,
                        image: profile.photos?.[0]?.value ?? null,
                    },
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        image: true,
                        passwordHash: true,
                    },
                });

                return null//done(null, user);
            } catch (err) {
                return done(err as Error);
            }
        }
    )
);


router.post("/register", validate(registerSchema), async (req: Request, res: Response) => {
    const { name, email, password } = req.body as {
        name: string;
        email: string;
        password: string;
    };

    try {
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            res.status(409).json({ success: false, error: "An account with this email already exists" });
            return;
        }

        const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);
        const user = await prisma.user.create({
            data: { name: name.trim(), email, passwordHash: hash },
        });

        const payload = makePayload(user);
        const accessToken = signAccessToken(payload);
        const refreshToken = signRefreshToken(payload);

        setRefreshCookie(res, refreshToken);

        res.status(201).json({
            success: true,
            data: { accessToken, user: makePublicUser(user) },
        });
    } catch (err) {
        console.error("[POST /auth/register]", err);
        res.status(500).json({ success: false, error: "Something went wrong" });
    }
});


router.post("/login", validate(loginSchema), async (req: Request, res: Response) => {
    const { email, password } = req.body as { email: string; password: string };

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        const dummyHash = "$2a$12$dummyhashfordummycomparison000000000000000000000000000";
        const hash = user?.passwordHash ?? dummyHash;
        const valid = await bcrypt.compare(password, hash);

        if (!user || !valid || !user.passwordHash) {
            res.status(401).json({ success: false, error: "Invalid email or password" });
            return;
        }

        const payload = makePayload(user);
        const accessToken = signAccessToken(payload);
        const refreshToken = signRefreshToken(payload);

        setRefreshCookie(res, refreshToken);

        res.json({
            success: true,
            data: { accessToken, user: makePublicUser(user) },
        });
    } catch (err) {
        console.error("[POST /auth/login]", err);
        res.status(500).json({ success: false, error: "Something went wrong" });
    }
});


router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["openid", "email", "profile"],
        session: false,
    })
);


router.get(
    "/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: `${CLIENT_URL}/auth/signin?error=oauth` }),
    (req: Request, res: Response) => {
        const user = req.user as unknown as {
            id: string;
            email: string;
            name: string | null;
            image: string | null;
            passwordHash?: string | null;
        };

        const payload = makePayload(user);
        const accessToken = signAccessToken(payload);
        const refreshToken = signRefreshToken(payload);

        setRefreshCookie(res, refreshToken);

        const userEncoded = Buffer.from(JSON.stringify(makePublicUser(user))).toString("base64");
        res.redirect(`${CLIENT_URL}/auth/callback#token=${accessToken}&user=${userEncoded}`);
    }
);


router.post("/refresh", async (req: Request, res: Response) => {
    const token = getRefreshCookie(req.cookies);

    if (!token) {
        res.status(401).json({ success: false, error: "No refresh token" });
        return;
    }

    try {
        const payload = verifyRefreshToken(token);

        const user = await prisma.user.findUnique({
            where: { id: payload.sub },
            select: { id: true, email: true, name: true, image: true },
        });

        if (!user) {
            clearRefreshCookie(res);
            res.status(401).json({ success: false, error: "User not found" });
            return;
        }

        const newPayload = makePayload(user);
        const accessToken = signAccessToken(newPayload);
        const newRefreshToken = signRefreshToken(newPayload);

        setRefreshCookie(res, newRefreshToken);

        res.json({
            success: true,
            data: { accessToken, user: makePublicUser(user) },
        });
    } catch {
        clearRefreshCookie(res);
        res.status(401).json({ success: false, error: "Invalid or expired refresh token" });
    }
});


router.post("/logout", (_req: Request, res: Response) => {
    clearRefreshCookie(res);
    res.json({ success: true, data: null });
});


router.post(
    "/forgot-password",
    validate(forgotPasswordSchema),
    async (req: Request, res: Response) => {
        const { email } = req.body as { email: string };

        // Always return the same response — never leak whether email exists
        const genericResponse = () =>
            res.json({
                success: true,
                data: { message: "If that email exists, a reset link has been sent" },
            });

        try {
            const user = await prisma.user.findUnique({
                where: { email },
                select: { id: true, email: true, passwordHash: true },
            });

            if (!user || !user.passwordHash) {
                genericResponse();
                return;
            }

            const resetToken = signResetToken(user.id, user.passwordHash);
            const resetUrl = `${CLIENT_URL}/auth/reset-password?token=${resetToken}`;

            // Fire and forget — don't block response on SMTP
            sendPasswordResetEmail(user.email, resetUrl).catch((err) =>
                console.error("[email] Failed to send reset email", err)
            );

            genericResponse();
        } catch (err) {
            console.error("[POST /auth/forgot-password]", err);
            genericResponse();
        }
    }
);

router.post(
    "/reset-password",
    validate(resetPasswordSchema),
    async (req: Request, res: Response) => {
        const { token, password } = req.body as { token: string; password: string };

        try {
            const payloadPart = token.split(".")[1];
            if (!payloadPart) {
                res.status(400).json({
                    success: false,
                    error: "Reset link is invalid or has expired",
                });
                return;
            }

            const decoded = JSON.parse(
                Buffer.from(payloadPart, "base64url").toString()
            ) as { sub: string };

            const user = await prisma.user.findUnique({
                where: { id: decoded.sub },
                select: { id: true, passwordHash: true },
            });

            if (!user || !user.passwordHash) {
                res.status(400).json({
                    success: false,
                    error: "Reset link is invalid or has expired",
                });
                return;
            }

            // Verifies signature using old hash — auto-invalidates after password change
            verifyResetToken(token, user.passwordHash);

            const newHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

            await prisma.user.update({
                where: { id: user.id },
                data: { passwordHash: newHash },
            });

            res.json({ success: true, data: { message: "Password updated successfully" } });
        } catch {
            res.status(400).json({
                success: false,
                error: "Reset link is invalid or has expired",
            });
        }
    }
);

export default router;