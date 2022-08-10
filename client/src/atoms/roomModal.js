import { atom } from "recoil";

export const roomState = atom({
  key: "roomState",
  default: { roomName: "", roomId: "" },
});
