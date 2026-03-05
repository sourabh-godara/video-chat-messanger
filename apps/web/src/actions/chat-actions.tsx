"use server";

import { getUserIdFromSession } from "@/lib";
import { ChatType } from "@/types";
import { redirect } from "next/navigation";
import prisma from "@repo/prisma";
import { generateRoomId } from "@/lib/generateRoomId";
const MESSAGES_PER_PAGE = 30;

class NotAuthenticatedError extends Error {
  constructor(message = "User is not authenticated") {
    super(message);
    this.name = "NotAuthenticatedError";
  }
}
export async function fetchChats(friendId: string): Promise<ChatType> {
  const userId = await getUserIdFromSession();
  if (!userId) {
    throw new NotAuthenticatedError();
  }

  const roomId = generateRoomId(userId, friendId);

  const [friendship, user] = await prisma.$transaction([
    // Check for friendship
    prisma.friendship.findFirst({
      where: {
        OR: [
          { userId: userId, friendId: friendId },
          { userId: friendId, friendId: userId },
        ],
      },
      select: { id: true },
    }),
    // Fetch friend's info (can run in parallel with the friendship check)
    prisma.user.findUnique({
      where: { id: friendId },
      select: { name: true, image: true, email: true },
    }),
  ]);

  if (!friendship) {
    return redirect("/");
  }

  if (!user) {
    throw new Error("Friend not found");
  }

  // Upsert the room and fetch messages in a single transaction
  const { messages } = await prisma.room.upsert({
    where: { id: roomId },
    // If room doesn't exist, create it
    create: {
      id: roomId,
      isGroup: false,
      members: {
        create: [{ userId: userId }, { userId: friendId }],
      },
    },
    // If it exists, do nothing to the room itself
    update: {},
    // In either case, include the messages
    include: {
      messages: {
        orderBy: { createdAt: "desc" },
        take: MESSAGES_PER_PAGE,
        select: {
          id: true,
          senderId: true,
          content: true,
          createdAt: true,
        },
      },
    },
  });

  return { user, messages };
}
