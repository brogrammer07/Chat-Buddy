import { atom } from "recoil";

export const langaugeState = atom({
  key: "langaugeState",
  default: "python",
});

export const themeState = atom({
  key: "themeState",
  default: "dracula",
});
export const fontSizeState = atom({
  key: "fontSizeState",
  default: "16",
});
