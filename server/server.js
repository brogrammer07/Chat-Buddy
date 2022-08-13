import express from "express";
import bodyParser from "body-parser";
import http from "http";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import roomRoutes from "./routes/room.js";
import { addUser, removeUser, getUser, getUsersInRoom } from "./utils/user.js";
import { ACTIONS } from "./utils/Actions.js";
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

  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);
    console.log(`${username} joined ${roomId}`);
    const clients = getAllConnectedClients(roomId);
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId: socket.id,
      });
    });
  });

  socket.on(ACTIONS.BODY_CHANGE, ({ roomId, body }) => {
    console.log("Body Change", body);
    socket.to(roomId).emit(ACTIONS.BODY_CHANGE, { body });
  });
  socket.on(ACTIONS.INPUT_CHANGE, ({ roomId, input }) => {
    console.log("Input Change", input);
    socket.to(roomId).emit(ACTIONS.INPUT_CHANGE, { input });
  });
  socket.on(ACTIONS.OUTPUT_CHANGE, ({ roomId, output }) => {
    console.log("Output Change", output);
    socket.to(roomId).emit(ACTIONS.OUTPUT_CHANGE, { output });
  });
  socket.on(ACTIONS.LANGUAGE_CHANGE, ({ roomId, language }) => {
    console.log("Language Change", language);
    socket.to(roomId).emit(ACTIONS.LANGUAGE_CHANGE, { language });
  });

  socket.on(
    ACTIONS.SYNC_CODE,
    ({ socketId, body, input, output, language }) => {
      console.log("Sync Change", body, input, output, language, socketId);
      io.to(socketId).emit(ACTIONS.BODY_CHANGE, { body });
      io.to(socketId).emit(ACTIONS.INPUT_CHANGE, { input });
      io.to(socketId).emit(ACTIONS.OUTPUT_CHANGE, { output });
      io.to(socketId).emit(ACTIONS.LANGUAGE_CHANGE, { language });
    }
  );

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });
    delete userSocketMap[socket.id];
    console.log("socket disconnected", socket.id);
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
