import { createServer } from "http";
import express from "express";
import { publisher, subscriber } from "./services/redisClient";
import SocketService from "./services/socket";
import prisma from '@repo/prisma'

const PORT = 8530;
const app = express();

const httpServer = createServer(app);

app.get("/", (req, res) => {
  res.send("<h1>Server is running..</h1>");
  res.end();
});

app.get("/online-users", async (req, res) => {
  try {
    const userId = 'cmfyasg700000lb009pvknx3v'
    const friends = await prisma.friendship.findMany({
      where: { userId },
      include: {
        friend: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
    });
    const friend = friends.map((f) => f.friend);
    return res.json({ data: friend, message: 'success' })
  } catch (error: any) {
    console.log({ error })
    return res.status(500).json({ data: null, message: error.message })
  }
});


async function initServer() {
  try {
    const socketService = new SocketService();
    socketService.io.attach(httpServer);
    httpServer.listen(PORT, "0.0.0.0", () => {
      console.log(`> Ready on http://localhost:${PORT}`);
    });
    await socketService.initListeners();
    process.on("SIGINT", async () => {
      console.log("Shutting down...");
      await publisher.disconnect();
      await subscriber.disconnect();
      httpServer.close(() => process.exit(0));
    });
  } catch (error) {
    console.error("Something went wrong, Server went down.", { error });
  }
}

initServer();
