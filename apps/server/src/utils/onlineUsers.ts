import { redis } from "../services/redisClient";
import { AuthenticatedSocket } from "../services/socket";

export const setOnlineUser = async (userId: string,socket:AuthenticatedSocket) => {
    await redis.sadd(`user:${userId}:sockets`, socket.id);
    const socketCount = await redis.scard(`user:${userId}:sockets`);
    if (socketCount === 1) {
    console.log(`User ${userId} is online`);
    await redis.sadd("onlineUsers", userId);
    socket.emit("user:online", userId);
  }
}

export const userOffline = async (userId: string,socket:AuthenticatedSocket) => {
    await redis.srem(`user:${userId}:sockets`, socket.id);

  const socketCount = await redis.scard(`user:${userId}:sockets`);
  if (socketCount === 0) {
    console.log(`User ${userId} is offline`);
    await redis.srem("onlineUsers", userId);
    socket.emit("user:offline", userId);
  }
}