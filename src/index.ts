import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv"
import SocketRouter from "./service/Messages.js"
import { handleSocket } from "./service/Socket.js";
dotenv.config()

export const app = express();
export const server = http.createServer(app);

export const io = new Server(server, { cors: { origin: "*" } });



handleSocket(io)



server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});


app.use("/socket"  , SocketRouter)
