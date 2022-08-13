import React, { useEffect, useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { allLangauges } from "../utils/langauges";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  fontSizeState,
  langaugeState,
  themeState,
} from "../atoms/editorOptionsModal";
import axios from "axios";
import { toast } from "react-toastify";
import { ACTIONS } from "../utils/Actions";
const langauges = Object.entries(allLangauges);
const themes = [
  "monokai",
  "github",
  "solarized_dark",
  "dracula",
  "github",
  "solarized_dark",
  "monokai",
  "eclipse",
  "tomorrow_night",
  "tomorrow_night_blue",
  "xcode",
  "ambiance",
  "solarized_light",
].sort();

const fontSizes = [
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
];

const style = {
  color: "white",
  ".MuiOutlinedInput-notchedOutline": {
    borderColor: "#ffffff",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(228, 219, 233, 0.25)",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(228, 219, 233, 0.75)",
  },
  ".MuiSvgIcon-root ": {
    fill: "white !important",
  },
};

const RoomHeader = ({
  handleLanguageChange,
  roomId,
  bodyRef,
  languageRef,
  inputRef,
  socketRef,
}) => {
  // Modal states
  const language = useRecoilValue(langaugeState);
  const [theme, setTheme] = useRecoilState(themeState);
  const [fontSize, setFontSize] = useRecoilState(fontSizeState);
  // Saving and Running State
  const [saving, setSaving] = useState(false);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    // Listening for saving event
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.SAVE, () => {
        setSaving(true);
      });
      // Listening for saved event
      socketRef.current.on(ACTIONS.SAVED, () => {
        toast.success("Code saved successfully");
        setSaving(false);
      });
    }
  }, []);
  // Save Code Handler
  const saveCode = async () => {
    setSaving(true);
    socketRef.current.emit(ACTIONS.SAVE, {
      roomId,
    });
    await axios
      .post(`${process.env.REACT_APP_SERVER_URL}/api/save`, {
        language: languageRef.current,
        roomId: roomId,
        body: bodyRef.current,
        input: inputRef.current,
      })
      .then((res) => {
        setSaving(false);
        socketRef.current.emit(ACTIONS.SAVED, {
          roomId,
        });
        toast.success("Code saved successfully");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error in saving");
      });
  };
  return (
    <div className="flex text-[#5b5b5b] space-x-16 h-[30rem] px-8 pl-24 py-10 w-full font-semibold text-[1.2rem] bg-[#2c2e3f]">
      <div className="w-[10rem]">
        <FormControl fullWidth>
          <InputLabel sx={{ color: "white" }} id="demo-simple-select-label">
            Choose Language
          </InputLabel>
          <Select
            sx={style}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={language}
            label="Choose Language"
            onChange={handleLanguageChange}>
            {langauges.map((lang, i) => (
              <MenuItem key={i} value={lang[1]}>
                {lang[0]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div className="w-[10rem]">
        <FormControl fullWidth>
          <InputLabel sx={{ color: "white" }} id="demo-simple-select-label">
            Choose Theme
          </InputLabel>
          <Select
            sx={style}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={theme}
            label="Choose Theme"
            onChange={(e) => setTheme(e.target.value)}>
            {themes.map((theme, i) => (
              <MenuItem key={i} value={theme}>
                {theme}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div className="w-[10rem]">
        <FormControl fullWidth>
          <InputLabel sx={{ color: "white" }} id="demo-simple-select-label">
            Choose Font Size
          </InputLabel>
          <Select
            sx={style}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={fontSize}
            label="Choose Font Size"
            onChange={(e) => setFontSize(e.target.value)}>
            {fontSizes.map((size, i) => (
              <MenuItem key={i} value={size}>
                {size}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div className="flex space-x-5 ">
        <div className="w-[10rem]">
          <button
            onClick={() => saveCode()}
            className="rounded-md w-[10rem] bg-white py-3 hover:bg-gray-200 duration-150 transition-all">
            {saving ? "Saving" : "Save"}
          </button>
        </div>
        <div className="w-[10rem]">
          <button
            onClick={() => saveCode()}
            className="rounded-md w-[10rem] bg-white py-3 hover:bg-gray-200 duration-150 transition-all">
            {running ? "Running" : "Run"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomHeader;
