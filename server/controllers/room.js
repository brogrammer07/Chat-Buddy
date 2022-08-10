import Room from "../models/room.js";
import { v4 as uuidv4 } from "uuid";

export const createRoom = (req, res) => {
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
export const joinRoom = (req, res) => {};
