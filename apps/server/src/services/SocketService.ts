import { Server } from "socket.io";
import { Messages } from "../types";
import prisma from "@repo/prisma";
import Redis from "ioredis";

const pub = new Redis(process.env.REDIS_URL!);

const sub = new Redis(process.env.REDIS_URL!);

class SocketService {
  private _io: Server;

  constructor() {
    this._io = new Server({
      cors: {
        origin: [
          "https://chatterbox.fun",
          "https://video-chat-messanger.vercel.app",
          "http://localhost:3000",
        ],
      },
    });
    sub.subscribe("MESSAGES");
  }

  public initialize() {
    const io = this._io;
    io.on("connection", (socket) => {
      console.log("Connected to: ", socket.id);

      socket.on("event:message", async (msg: Messages) => {
        await pub.publish("MESSAGES", JSON.stringify(msg));
      });

      socket.on("join-room", (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
      });

      socket.on("leave_room", (roomId) => {
        socket.leave(roomId);
        console.log(`User ${socket.id} left room ${roomId}`);
      });

      socket.on("disconnect", () => {
        console.log("Connection closed");
      });
      7;
    });

    sub.on("message", async (channel, message) => {
      if (channel === "MESSAGES") {
        const msg: Messages = JSON.parse(message);
        io.to(msg.roomId).emit("receive-message", msg);
        //Implement Kafka
        console.log("message saved to db");
        await prisma.message.create({
          data: {
            id: msg.id,
            content: msg.content,
            senderId: msg.senderId,
            receiverId: msg.receiverId,
          },
        });
      }
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
