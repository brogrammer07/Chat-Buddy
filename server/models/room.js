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
    unique: true,
  },
  body: {
    type: String,
    default: "",
  },
  language: {
    type: String,
    default: "python",
  },
  input: {
    type: String,
    default: "",
  },
});

export default mongoose.model("Room", roomSchema);
