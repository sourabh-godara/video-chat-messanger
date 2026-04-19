import { Router, type Request, type Response } from "express";
import prisma from "@repo/prisma";
import { requireAuth } from "../middleware/requireAuth";
import { validate } from "../middleware/validate";
import { sendRequestSchema, respondRequestSchema, requestIdParamSchema, friendIdParamSchema } from "../schemas/friends.schema";

const router = Router();

router.use(requireAuth);

router.get("/", async (req: Request, res: Response) => {
    try {
        const friendships = await prisma.friendship.findMany({
            where: { userId: req.user!.sub },
            include: {
                friend: {
                    select: { id: true, name: true, email: true, image: true },
                },
            },
        });

        const friends = friendships.map((f: typeof friendships[number]) => f.friend);
        res.json({ success: true, data: friends });
    } catch (err) {
        console.error("[GET /friends]", err);
        res.status(500).json({ success: false, error: "Something went wrong" });
    }
});


router.get("/requests", async (req: Request, res: Response) => {
    const userId = req.user!.sub;

    try {
        const [receivedRequests, sentRequests] = await Promise.all([
            prisma.friendRequest.findMany({
                where: { receiverId: userId, status: "PENDING" },
                include: {
                    sender: {
                        select: { id: true, name: true, email: true, image: true },
                    },
                },
                orderBy: { createdAt: "desc" },
            }),
            prisma.friendRequest.findMany({
                where: { senderId: userId, status: "PENDING" },
                include: {
                    receiver: {
                        select: { id: true, name: true, email: true, image: true },
                    },
                },
                orderBy: { createdAt: "desc" },
            }),
        ]);

        res.json({ success: true, data: { receivedRequests, sentRequests } });
    } catch (err) {
        console.error("[GET /friends/requests]", err);
        res.status(500).json({ success: false, error: "Something went wrong" });
    }
});


router.post("/requests", validate(sendRequestSchema), async (req: Request, res: Response) => {
    const senderId = req.user!.sub;
    const { receiverId } = req.body as { receiverId: string };

    if (receiverId === senderId) {
        res.status(400).json({ success: false, error: "Cannot send a request to yourself" });
        return;
    }

    try {
        const receiver = await prisma.user.findUnique({
            where: { id: receiverId },
            select: { id: true },
        });

        if (!receiver) {
            res.status(404).json({ success: false, error: "User not found" });
            return;
        }

        const alreadyFriends = await prisma.friendship.findFirst({
            where: {
                OR: [
                    { userId: senderId, friendId: receiverId },
                    { userId: receiverId, friendId: senderId },
                ],
            },
        });

        if (alreadyFriends) {
            res.status(409).json({ success: false, error: "Already friends" });
            return;
        }

        const existingRequest = await prisma.friendRequest.findFirst({
            where: {
                OR: [
                    { senderId, receiverId, status: "PENDING" },
                    { senderId: receiverId, receiverId: senderId, status: "PENDING" },
                ],
            },
        });

        if (existingRequest) {
            res.status(409).json({ success: false, error: "A friend request already exists between these users" });
            return;
        }

        const request = await prisma.friendRequest.create({
            data: { senderId, receiverId, status: "PENDING" },
            include: {
                receiver: {
                    select: { id: true, name: true, email: true, image: true },
                },
            },
        });

        res.status(201).json({ success: true, data: request });
    } catch (err) {
        console.error("[POST /friends/requests]", err);
        res.status(500).json({ success: false, error: "Something went wrong" });
    }
});


router.patch("/requests/:requestId", validate(requestIdParamSchema, "params"), validate(respondRequestSchema), async (req: Request, res: Response) => {
    const userId = req.user!.sub;
    const { requestId } = req.params;
    const { action } = req.body as { action: "ACCEPTED" | "DECLINED" };

    try {
        const friendRequest = await prisma.friendRequest.findUnique({
            where: { id: requestId },
            select: { id: true, senderId: true, receiverId: true, status: true },
        });

        if (!friendRequest) {
            res.status(404).json({ success: false, error: "Friend request not found" });
            return;
        }

        if (friendRequest.receiverId !== userId) {
            res.status(403).json({ success: false, error: "Not authorised to respond to this request" });
            return;
        }

        if (friendRequest.status !== "PENDING") {
            res.status(409).json({ success: false, error: "Request has already been responded to" });
            return;
        }

        await prisma.$transaction(async (tx) => {
            if (action === "ACCEPTED") {
                await tx.friendship.createMany({
                    data: [
                        { userId: friendRequest.senderId, friendId: friendRequest.receiverId },
                        { userId: friendRequest.receiverId, friendId: friendRequest.senderId },
                    ],
                    skipDuplicates: true,
                });
            }
            await tx.friendRequest.delete({ where: { id: requestId } });
        });

        res.json({ success: true, data: { action } });
    } catch (err) {
        console.error("[PATCH /friends/requests/:requestId]", err);
        res.status(500).json({ success: false, error: "Something went wrong" });
    }
});

router.delete("/requests/:requestId", async (req: Request, res: Response) => {
    const userId = req.user!.sub;

    try {
        const request = await prisma.friendRequest.findUnique({
            where: { id: req.params.requestId },
            select: { senderId: true },
        });

        if (!request) {
            res.status(404).json({ success: false, error: "Friend request not found" });
            return;
        }

        if (request.senderId !== userId) {
            res.status(403).json({ success: false, error: "Not authorised to cancel this request" });
            return;
        }

        await prisma.friendRequest.delete({ where: { id: req.params.requestId } });

        res.json({ success: true, data: null });
    } catch (err) {
        console.error("[DELETE /friends/requests/:requestId]", err);
        res.status(500).json({ success: false, error: "Something went wrong" });
    }
});

router.delete("/:friendId", validate(friendIdParamSchema, "params"), async (req: Request, res: Response) => {
    const userId = req.user!.sub;
    const { friendId } = req.params;

    try {
        const friendship = await prisma.friendship.findFirst({
            where: {
                OR: [
                    { userId, friendId },
                    { userId: friendId, friendId: userId },
                ],
            },
        });

        if (!friendship) {
            res.status(404).json({ success: false, error: "Friendship not found" });
            return;
        }

        await prisma.friendship.deleteMany({
            where: {
                OR: [
                    { userId, friendId },
                    { userId: friendId, friendId: userId },
                ],
            },
        });

        res.json({ success: true, data: null });
    } catch (err) {
        console.error("[DELETE /friends/:friendId]", err);
        res.status(500).json({ success: false, error: "Something went wrong" });
    }
});

export default router;