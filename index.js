import express from "express";
import { Server } from "socket.io";
import cors from "cors";
import http from "http";

import Socket from "./socket.js";
import Logger from "./logger.js";

const app = express();
const PORT = 8000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());

// add this
app.get("/socket.io/socket.io.js", (req, res) => {
  res.sendFile(__dirname + "/node_modules/socket.io/client-dist/socket.io.js");
});
///

app.get("/", (req, resp) => {
  const message = 'a user visited the index page'
  console.log(message);
  Logger(message, "access");
  
  resp.send({
    message: "Unauthorized Access",
    status: false,
  });
});

io.on("connection", (socket) => {
  console.log("A user has connected", socket.id);

  const id = socket.id;
  const ip_address = socket.handshake.address;
  const message = `---SOCKET CONNECTION--- [ID] : ${id} [IP ADDRESS] : ${ip_address}`;
  Logger(message, "access");

  Socket(socket, io);
});

server.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`);
});
