import { Server } from "socket.io";
import http from "http";

export function initSocket(server: http.Server) {

  const io = new Server(server, {
    cors: { origin: "*" }
  });

  io.on("connection", (socket) => {

    socket.on("join-project", (projectId) => {
      socket.join(projectId);
    });

    socket.on("file-update", ({ projectId, content }) => {
      socket.to(projectId).emit("file-update", content);
    });

    socket.on("cursor", (data) => {
      socket.broadcast.emit("cursor", data);
    });

  });
}
