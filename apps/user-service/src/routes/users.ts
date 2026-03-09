import { Router, type Request, type Response } from "express";
import prisma from "@repo/prisma";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

router.use(requireAuth);

router.get("/me", async (req: Request, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user!.sub },
            select: { id: true, name: true, email: true, image: true, createdAt: true },
        });

        if (!user) {
            res.status(404).json({ success: false, error: "User not found" });
            return;
        }

        res.json({ success: true, data: user });
    } catch (err) {
        console.error("[GET /users/me]", err);
        res.status(500).json({ success: false, error: "Something went wrong" });
    }
});

router.patch("/me", async (req: Request, res: Response) => {
    const { name, image } = req.body as { name?: string; image?: string };

    if (!name?.trim() && !image) {
        res.status(400).json({ success: false, error: "Nothing to update" });
        return;
    }

    try {
        const updated = await prisma.user.update({
            where: { id: req.user!.sub },
            data: {
                ...(name?.trim() && { name: name.trim() }),
                ...(image && { image }),
            },
            select: { id: true, name: true, email: true, image: true },
        });

        res.json({ success: true, data: updated });
    } catch (err) {
        console.error("[PATCH /users/me]", err);
        res.status(500).json({ success: false, error: "Something went wrong" });
    }
});

router.get("/search", async (req: Request, res: Response) => {
    const query = (req.query.q as string)?.trim();
    const userId = req.user!.sub;

    if (!query || query.length < 1) {
        res.status(400).json({ success: false, error: "Search query is required" });
        return;
    }

    try {
        const users = await prisma.user.findMany({
            where: {
                AND: [
                    { id: { not: userId } },
                    {
                        OR: [
                            { name: { contains: query, mode: "insensitive" } },
                            { email: { contains: query, mode: "insensitive" } },
                        ],
                    },
                    {
                        NOT: {
                            friendsInitiated: { some: { friendId: userId } },
                        },
                    },
                    {
                        NOT: {
                            friendsAccepted: { some: { userId: userId } },
                        },
                    },
                ],
            },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                friendRequestsSent: {
                    where: { receiverId: userId, status: "PENDING" },
                    select: { id: true },
                },
                friendRequestsReceived: {
                    where: { senderId: userId, status: "PENDING" },
                    select: { id: true },
                },
            },
            take: 10,
        });

        const result = users.map((u) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            image: u.image,
            requestReceived: u.friendRequestsSent.length > 0,
            requestSent: u.friendRequestsReceived.length > 0,
        }));

        res.json({ success: true, data: result });
    } catch (err) {
        console.error("[GET /users/search]", err);
        res.status(500).json({ success: false, error: "Something went wrong" });
    }
});

router.get("/:id", async (req: Request, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.params.id },
            select: { id: true, name: true, image: true },
        });

        if (!user) {
            res.status(404).json({ success: false, error: "User not found" });
            return;
        }

        res.json({ success: true, data: user });
    } catch (err) {
        console.error("[GET /users/:id]", err);
        res.status(500).json({ success: false, error: "Something went wrong" });
    }
});

export default router;