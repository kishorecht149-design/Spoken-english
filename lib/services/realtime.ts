import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getRealtimeSocket() {
  if (typeof window === "undefined") return null;
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4001", {
      transports: ["websocket"]
    });
  }
  return socket;
}
