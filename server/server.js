import express from "express";
import bodyParser from "body-parser";
import http from "http";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import roomRoutes from "./routes/room.js";
import { ACTIONS } from "./utils/Actions.js";
const app = express();
dotenv.config({ path: "./config/config.env" });

// middlewares

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(
  cors({
    allowedHeaders: ["Content-Type"],
    origin: [process.env.CLIENT_URL],
  })
);

// set routes
app.use("/api", roomRoutes);

// Set Port
const PORT = process.env.PORT;
app.get("/", (req, res) => {
  res.send("Chat Buddy API");
});

// Create http server
const server = http.createServer(app);

// Create socket server
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
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

// Socket Connection

io.on("connection", (socket) => {
  console.log("socket connected", socket.id);
  // Socket Events

  // Join Room Event
  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);
    console.log(`${username} joined ${roomId}`);
    const clients = getAllConnectedClients(roomId);
    clients.forEach(({ socketId }) => {
      // Send Joined Client to other clients
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId: socket.id,
      });
    });
  });

  // Body Change Event
  socket.on(ACTIONS.BODY_CHANGE, ({ roomId, body }) => {
    console.log("Body Change", body);
    socket.to(roomId).emit(ACTIONS.BODY_CHANGE, { body });
  });
  // Input Change Event
  socket.on(ACTIONS.INPUT_CHANGE, ({ roomId, input }) => {
    console.log("Input Change", input);
    socket.to(roomId).emit(ACTIONS.INPUT_CHANGE, { input });
  });
  // Output Change Event
  socket.on(ACTIONS.OUTPUT_CHANGE, ({ roomId, output }) => {
    console.log("Output Change", output);
    socket.to(roomId).emit(ACTIONS.OUTPUT_CHANGE, { output });
  });
  // Language Change Event
  socket.on(ACTIONS.LANGUAGE_CHANGE, ({ roomId, language }) => {
    console.log("Language Change", language);
    socket.to(roomId).emit(ACTIONS.LANGUAGE_CHANGE, { language });
  });

  // Sync Code Event
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

  // Save Code Event
  socket.on(ACTIONS.SAVE, ({ roomId }) => {
    console.log("Save", roomId);
    socket.in(roomId).emit(ACTIONS.SAVE);
  });
  // Saved Code Event
  socket.on(ACTIONS.SAVED, ({ roomId }) => {
    console.log("Saved", roomId);
    socket.in(roomId).emit(ACTIONS.SAVED);
  });
  // Run Code Event
  socket.on(ACTIONS.RUN, ({ roomId }) => {
    console.log("Run", roomId);
    socket.in(roomId).emit(ACTIONS.RUN);
  });
  // Runned Code Event
  socket.on(ACTIONS.RUNNED, ({ roomId }) => {
    console.log("Runned", roomId);
    socket.in(roomId).emit(ACTIONS.RUNNED);
  });
  // Send Message Event
  socket.on(ACTIONS.SEND_MESSAGE, ({ message, roomId, socketId, username }) => {
    console.log("Send Message", message);
    socket
      .to(roomId)
      .emit(ACTIONS.RECEIVE_MESSAGE, { message, socketId, username });
  });
  // Typing Event
  socket.on(ACTIONS.TYPING, ({ roomId, username }) => {
    console.log("Typing", username);
    socket.in(roomId).emit(ACTIONS.TYPED, { username, roomId });
  });

  // Disconnect Event
  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      // Remove user from room
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

// Connect to MongoDB
mongoose
  .connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  )
  .catch((error) => console.log("MongoDB Error", error.message));
