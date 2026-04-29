import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const port = Number(process.env.PORT || 4001);
const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    credentials: true
  }
});

io.on("connection", (socket) => {
  socket.on("practice:join", (topic) => {
    socket.emit("practice:coach", {
      message: `You joined the live practice room for "${topic}". Start speaking whenever you're ready.`
    });
  });

  socket.on("practice:message", (payload) => {
    socket.emit("practice:coach", {
      message: `Nice work. Expand on: ${payload.message}`
    });
  });
});

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

server.listen(port, () => {
  console.log(`Realtime server running on http://localhost:${port}`);
});
