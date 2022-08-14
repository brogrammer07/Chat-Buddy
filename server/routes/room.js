import express from "express";

import { createRoom, save, getRoomData } from "../controllers/room.js";

const router = express.Router();

router.post("/createroom", createRoom);
router.post("/save", save);
router.post("/getroomdata", getRoomData);

export default router;
