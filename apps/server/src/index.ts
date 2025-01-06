import { createServer } from "http";
import express from "express";
import { Server } from "socket.io";
import { Messages } from "./types/index";
import { createClient } from "redis";

const PORT = 8530;
const app = express();

// Redis Clients for Pub/Sub
const publisher = createClient({
  url: process.env.REDIS_URL,
  socket: {
    reconnectStrategy: function (retries) {
      if (retries > 20) {
        console.log(
          "Too many attempts to reconnect. Redis publisher connection was terminated"
        );
        return new Error("Too many retries.");
      } else {
        return retries * 500;
      }
    },
  },
});

const subscriber = createClient({
  url: process.env.REDIS_URL,
  socket: {
    reconnectStrategy: function (retries) {
      if (retries > 20) {
        console.log(
          "Too many attempts to reconnect. Redis subscriber connection was terminated"
        );
        return new Error("Too many retries.");
      } else {
        return retries * 500;
      }
    },
  },
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [
      "https://chatterbox.fun",
      "https://video-chat-messanger.vercel.app",
      "http://localhost:3000",
    ],
  },
});

io.on("connection", (socket) => {
  console.log("Connected to: ", socket.id);

  socket.on("event:message", async (msg: Messages) => {
    await publisher.PUBLISH("message", JSON.stringify(msg));
  });

  socket.on("disconnect", () => {
    console.log("Connection closed");
  });
});

app.get("/", (req, res) => {
  res.send("<h1>Server is running..</h1>");
  res.end();
});

async function initServer() {
  try {
    await Promise.all([publisher.connect(), subscriber.connect()]);

    publisher.on("error", (err) => console.log("Redis Publisher Error", err));
    subscriber.on("error", (err) => console.log("Redis Subscriber Error", err));
    httpServer
      .once("error", (err) => {
        console.error(err);
        process.exit(1);
      })
      .listen(PORT, () => {
        console.log(`> Ready on http://localhost:${PORT}`);
      });

    await subscriber.subscribe("message", (message) => {
      const msg: Messages = JSON.parse(message);
      io.emit(msg.receiverId, msg);
    });
  } catch (error) {
    console.error("Something went wrong, Server went down.", { error });
  }
}
initServer();
