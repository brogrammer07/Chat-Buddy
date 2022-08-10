import express from "express";
import bodyParser from "body-parser";
import http from "http";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import roomRoutes from "./routes/room.js";

const app = express();
dotenv.config({ path: "./config/config.env" });

// middlewares

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(
  cors(
    cors({
      allowedHeaders: ["Content-Type"],
      origin: ["http://localhost:3000"],
    })
  )
);

// set routes
app.use("/api", roomRoutes);

const PORT = process.env.PORT;
app.get("/", (req, res) => {
  res.send("Chat Buddy API");
});
const server = http.createServer(app);

mongoose
  .connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  )
  .catch((error) => console.log("MongoDB Error", error.message));
