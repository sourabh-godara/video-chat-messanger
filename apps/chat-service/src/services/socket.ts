import { Server, Socket } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { publisher, subscriber } from "./redisClient";
import { produceMessages } from "./kafka";
import { verifySocketAuth } from "../utils/verifySocketAuth";
import { checkRoomMembership } from "../utils/checkRoomMembership";
import { Messages } from "../types";
import { setOnlineUser, userOffline } from "../utils/onlineUsers";

export interface AuthenticatedSocket extends Socket {
  userId: string;
}

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
        credentials: true,
      },
    });
    console.log("Socket Service initialized.");
  }

  public async initListeners(): Promise<void> {
    this._io.adapter(createAdapter(publisher, subscriber));

    this.setupMiddleware();

    this._io.on("connection", (socket: Socket) => {
      this.handleConnection(socket as AuthenticatedSocket);
    });
  }

  private setupMiddleware(): void {
    this._io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth?.token;
        if (!token || typeof token !== "string") {
          return next(new Error("auth/no-token"));
        }
        const user = await verifySocketAuth(token);
        if (!user) {
          return next(new Error("auth/invalid-token"));
        }
        (socket as AuthenticatedSocket).userId = user;
        next();
      } catch (err) {
        next(new Error("auth/verification-failed"));
      }
    });
  }

  private async handleConnection(socket: AuthenticatedSocket): Promise<void> {
    console.log(`User connected: ${socket.id}, User ID: ${socket.userId}`);

    await setOnlineUser(socket.userId, socket);

    socket.on("join_room", (roomId) => this.onJoinRoom(socket, roomId));
    socket.on("send_message", (message) => this.onSendMessage(socket, message));
    socket.on("typing", (data) => this.onTyping(socket, data));
    socket.on("disconnect", () => this.onDisconnect(socket));
  }

  private async onJoinRoom(
    socket: AuthenticatedSocket,
    roomId: string
  ): Promise<void> {
    if (typeof roomId !== "string" || roomId.length === 0 || roomId.length > 200) {
      socket.emit("error", "invalid-room-id");
      return;
    }
    if (!/^[A-Za-z0-9:_-]+$/.test(roomId)) {
      socket.emit("error", "invalid-room-id");
      return;
    }

    const isAllowed = await checkRoomMembership(socket.userId, roomId);

    if (!isAllowed) {
      socket.emit("error", "not-authorized-to-join-room");
      console.warn(`User ${socket.userId} denied access to room ${roomId}`);
      return;
    }

    await socket.join(roomId);
    socket.emit("join_success", roomId);
  }

  private onSendMessage(socket: AuthenticatedSocket, message: Messages): void {
    if (!socket.rooms.has(message.roomId)) {
      socket.emit("error", "You are not in this room");
      console.warn(
        `User ${socket.userId} tried to send to room ${message.roomId} without access`
      );
      return;
    }
    // 5. Using Kafka for message persistence and broadcasting
    // Instead of emitting directly, we produce a message to Kafka.
    socket.to(message.roomId).emit("receive_message", message);
    // Another service (a Kafka consumer) would be responsible for saving it to the DB
    // and broadcasting it back to the clients.
    //produceMessages(message);
    //console.log(`Message produced to Kafka for room ${message.roomId}`);
  }

  private onTyping(
    socket: AuthenticatedSocket,
    { roomId, isTyping }: { roomId: string; isTyping: boolean }
  ): void {
    if (!roomId || !socket.rooms.has(roomId)) {
      return;
    }
    socket.to(roomId).emit("typing", { userId: socket.userId, isTyping: !!isTyping });
  }

  private async onDisconnect(socket: AuthenticatedSocket): Promise<void> {
    console.log(`User disconnected: ${socket.id}, User ID: ${socket.userId}`);
    await userOffline(socket.userId, socket);
  }

  get io(): Server {
    return this._io;
  }
}

export default SocketService;
