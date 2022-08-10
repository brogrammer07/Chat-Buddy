import express from "express";

import { joinRoom, createRoom } from "../controllers/room.js";

const router = express.Router();

router.post("/joinroom", joinRoom);
router.post("/createroom", createRoom);

export default router;
