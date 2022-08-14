import Room from "../models/room.js";
import { v4 as uuidv4 } from "uuid";

export const createRoom = async (req, res) => {
  const { name } = req.body;
  console.log(name);
  const roomId = uuidv4();
  const room = new Room({
    name,
    roomId,
  });
  room.save((err, room) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        error: err,
      });
    }
    res.status(200).json(room);
  });
};
export const save = async (req, res) => {
  const { body, input, language, roomId } = req.body;
  const room = await Room.findOne({ roomId });
  room.body = body;
  room.input = input;
  room.language = language;
  room.save((err, room) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        error: err,
      });
    }
    res.status(200).json({ message: "Saved" });
  });
};
export const getRoomData = async (req, res) => {
  const { roomId } = req.body;
  console.log(roomId);
  const room = Room.findOne({ roomId }).exec((err, room) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        error: err,
      });
    }

    res.status(200).json(room);
  });
};
