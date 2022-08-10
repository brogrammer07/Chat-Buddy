import express from "express";
import bodyParser from "body-parser";
import http from "http";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import roomRoutes from "./routes/room.js";

const app = express();
dotenv.config({ path: "./config/config.env" });

// middlewares

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(
  cors({
    allowedHeaders: ["Content-Type"],
    origin: ["http://localhost:3000"],
  })
);

// set routes
app.use("/api", roomRoutes);

const PORT = process.env.PORT;
app.get("/", (req, res) => {
  res.send("Chat Buddy API");
});
const server = http.createServer(app);

// Socket Io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {};
function getAllConnectedClients(roomId) {
  // Map
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    }
  );
}

io.on("connection", (socket) => {
  console.log("socket connected", socket.id);
  socket.on("join_room", ({ roomId, username }) => {
    socket.join(roomId);
    const clients = getAllConnectedClients(roomId);
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit("new_user", {
        clients,
        username,
        socketId: socket.id,
      });
    });
  });
});

mongoose
  .connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  )
  .catch((error) => console.log("MongoDB Error", error.message));
