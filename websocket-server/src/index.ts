import { createServer } from "http";
import express from "express";
import { Server } from "socket.io";
import { Messages } from "./types/index";
const PORT = 8530;
const app = express();

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
  socket.on("event:message", (msg: Messages) => {
    io.emit(msg.receiverId, msg);
  });
  socket.on("disconnect", () => {
    console.log("Connection closed");
  });
});

app.get("/", (req, res) => {
  res.send("<h1>Server is running..</h1>");
  res.end();
});

httpServer
  .once("error", (err) => {
    console.error(err);
    process.exit(1);
  })
  .listen(PORT, () => {
    console.log(`> Ready on http://localhost:${PORT}`);
  });
