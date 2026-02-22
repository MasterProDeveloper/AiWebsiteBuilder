import http from "http";
import { app } from "./app";
import { initSocket } from "./websocket/socket";

const server = http.createServer(app);

initSocket(server);

server.listen(4000, () => {
  console.log("DevForge API running on port 4000");
});
