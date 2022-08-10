import express from "express";
import bodyParser from "body-parser";
import http from "http";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import roomRoutes from "./routes/room.js";
import { addUser, removeUser, getUser, getUsersInRoom } from "./utils/user.js";
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

io.on("connection", (socket) => {
  console.log("socket connected", socket.id);
  socket.on("join_room", ({ roomId, username }) => {
    const { error, user } = addUser({ id: socket.id, username, roomId });

    if (error) return callback(error);
    socket.join(roomId);
    io.to(roomId).emit("roomData", {
      room: roomId,
      users: getUsersInRoom(roomId),
    });
    console.log(`${username} joined room ${roomId}`);
  });
  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      if (roomId !== socket.id) {
        socket.in(roomId).emit(
          "leave_room",
          {
            id: socket.id,
            username: getUser(socket.id).username,
          },
          () => {
            removeUser(socket.id);
            console.log(`${getUser(socket.id).username} left room ${rooms}`);
          }
        );
      }
    });
    socket.leave();
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
