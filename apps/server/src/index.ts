import { createServer } from "http";
import SocketService from "./services/SocketService";
const PORT = 8530;

const httpServer = createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  if (req.url === "/") {
    res.write("<h1>Server is Healthy :)");
    res.end();
  }
});

async function initServer() {
  const socket = new SocketService();
  socket.io.attach(httpServer);

  try {
    httpServer.listen(PORT, () => {
      console.log(`> Ready on http://localhost:${PORT}`);
    });

    socket.initialize();
  } catch (error) {
    console.error("Something went wrong, Server went down.", { error });
  }
}

initServer();
