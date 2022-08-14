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
  output,
  setOutput,
}) => {
  // Modal states
  const language = useRecoilValue(langaugeState);
  const [theme, setTheme] = useRecoilState(themeState);
  const [fontSize, setFontSize] = useRecoilState(fontSizeState);
  // Saving and Running State
  const [saving, setSaving] = useState(false);
  const [running, setRunning] = useState(false);
  const [submissionID, setSubmissionID] = useState("");
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [submissionCheckerID, setSubmissionCheckerId] = useState(null);

  // common response from paizo.io
  const idleStatus = "Idle";
  const runningStatus = "running";
  const compeletedStatus = "completed";
  const errorStatus = "Some error occured";

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

  useEffect(() => {
    if (submissionStatus == compeletedStatus && submissionCheckerID) {
      // destroy the checker
      clearInterval(submissionCheckerID);
      setSubmissionCheckerId(null);

      const params = new URLSearchParams({
        id: submissionID,
        api_key: "guest",
      });

      const outputQuery = params.toString();
      axios
        .get(`https://api.paiza.io/runners/get_details?${outputQuery}`)
        .then((res) => {
          console.log("output", res.data);
          const { stdout, stderr, build_stderr } = res.data;
          let newOutput = "";
          if (stdout) newOutput += stdout;
          if (stderr) newOutput += stderr;
          if (build_stderr) newOutput += build_stderr;

          if (newOutput) {
            setOutput(newOutput);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [submissionStatus]);

  const runCode = async () => {
    console.log(bodyRef.current, inputRef.current, language);
    const params = {
      source_code: bodyRef.current,
      language: language,
      input: inputRef.current,
      api_key: "guest",
    };

    await axios
      .post(`https://api.paiza.io/runners/create`, params)
      .then((res) => {
        const { id, status } = res.data;
        setSubmissionID(id);
        setSubmissionStatus(status);
      })
      .catch((err) => {
        console.log(err);
        setSubmissionID("");
        toast.error("Could not run code");
      });
  };

  useEffect(() => {
    if (submissionID) {
      setSubmissionCheckerId(setInterval(() => checkSubmissionStatus(), 1000));
    }
  }, [submissionID]);

  const checkSubmissionStatus = async () => {
    const params = new URLSearchParams({
      id: submissionID,
      api_key: "guest",
    });

    const statusQuery = params.toString();
    await axios
      .get(`https://api.paiza.io/runners/get_status?${statusQuery}`)
      .then((res) => {
        console.log("status", res.data);
        const { status } = res.data;
        setSubmissionStatus(status);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="flex md:flex-row flex-col text-[#5b5b5b] lg:space-x-16 md:space-x-4 space-y-3 md:space-y-0 px-8 lg:pl-24 py-10 w-full font-semibold text-[1.2rem] bg-[#2c2e3f]">
      <div className="md:w-[10rem] w-full">
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
            onChange={handleLanguageChange}
          >
            {langauges.map((lang, i) => (
              <MenuItem key={i} value={lang[1]}>
                {lang[0]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div className="md:w-[10rem] w-full">
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
            onChange={(e) => setTheme(e.target.value)}
          >
            {themes.map((theme, i) => (
              <MenuItem key={i} value={theme}>
                {theme}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div className="md:w-[10rem] w-full">
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
            onChange={(e) => setFontSize(e.target.value)}
          >
            {fontSizes.map((size, i) => (
              <MenuItem key={i} value={size}>
                {size}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div className="flex space-x-5 md:w-[50%] w-full md:justify-end">
        <div className="md:w-[10rem] w-full">
          <button
            onClick={() => saveCode()}
            className="rounded-md w-full bg-white py-3 hover:bg-gray-200 duration-150 transition-all"
          >
            {saving ? "Saving" : "Save"}
          </button>
        </div>
        <div className="md:w-[10rem] w-full">
          <button
            onClick={() => runCode()}
            className="rounded-md w-full bg-white py-3 hover:bg-gray-200 duration-150 transition-all"
          >
            {running ? "Running" : "Run"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomHeader;
