import mongoose from "mongoose";
const { Schema } = mongoose;
const roomSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  roomId: {
    type: String,
    required: true,
  },
  body: {
    type: String,
  },
  language: {
    type: String,
  },
  input: {
    type: String,
  },
});

export default mongoose.model("Room", roomSchema);
