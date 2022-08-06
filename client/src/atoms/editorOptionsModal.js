import { atom } from "recoil";

export const langaugeState = atom({
  key: "langaugeState",
  default: "python",
});

export const themeState = atom({
  key: "themeState",
  default: "monokai",
});
export const fontSizeState = atom({
  key: "fontSizeState",
  default: "8",
});
