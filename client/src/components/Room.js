import React, { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import queryString from "query-string";
import {
  fontSizeState,
  langaugeState,
  themeState,
} from "../atoms/editorOptionsModal";
import Editor from "../utils/Editor";
import Split from "react-split";
import "./Room.css";
// import SplitPane from "react-split-pane";

import RoomHeader from "./RoomHeader";
import Sidebar from "./Sidebar";
import { useLocation, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { connect, initSocket } from "../utils/socket";
import { ACTIONS } from "../utils/Actions";
const Room = () => {
  const [language, setLanguage] = useRecoilState(langaugeState);
  const fontSize = useRecoilValue(fontSizeState);
  const theme = useRecoilValue(themeState);
  const [body, setBody] = useState("");
  const [input, setInput] = useState("");
  const navigate = useLocation();
  const [output, setOutput] = useState("");
  const location = useLocation();
  const [clients, setClients] = useState([]);
  const { roomId } = useParams();
  const socketRef = useRef(null);
  const bodyRef = useRef(null);
  const inputRef = useRef(null);
  const outputRef = useRef(null);
  const languageRef = useRef(null);
  languageRef.current = language;
  useEffect(() => {
    const init = () => {
      socketRef.current = initSocket();
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      function handleErrors(e) {
        toast.error("Socket connection failed, try again later.");
        navigate("/");
      }

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });

      // Listening for joined event

      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (username !== location.state?.username) {
            toast.success(`${username} joined the room.`);
            console.log(username, language);

            socketRef.current.emit(ACTIONS.SYNC_CODE, {
              body: bodyRef.current,
              input: inputRef.current,
              output: outputRef.current,
              language: languageRef.current,
              socketId,
            });
          }
          setClients(clients);
        }
      );
      // Listening for body change event
      socketRef.current.on(ACTIONS.BODY_CHANGE, ({ body }) => {
        bodyRef.current = body;
        setBody(body);
      });
      // Listening for input change event
      socketRef.current.on(ACTIONS.INPUT_CHANGE, ({ input }) => {
        inputRef.current = input;
        setInput(input);
      });
      // Listening for output change event
      socketRef.current.on(ACTIONS.OUTPUT_CHANGE, ({ output }) => {
        outputRef.current = output;
        setOutput(output);
      });
      // Listening for Language change event
      socketRef.current.on(ACTIONS.LANGUAGE_CHANGE, ({ language }) => {
        languageRef.current = language;
        setLanguage(language);
      });

      // Listening for disconnected
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room.`);
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
    };
    init();
    return () => {
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
    };
  }, []);

  const handleInputChange = (value) => {
    socketRef.current.emit(ACTIONS.INPUT_CHANGE, {
      roomId,
      input: value,
    });
    inputRef.current = value;
    setInput(value);
  };
  const handleBodyChange = (value) => {
    socketRef.current.emit(ACTIONS.BODY_CHANGE, {
      roomId,
      body: value,
    });
    bodyRef.current = value;
    setBody(value);
  };
  const handleOutputChange = (value) => {
    socketRef.current.emit(ACTIONS.OUTPUT_CHANGE, {
      roomId,
      output: value,
    });
    outputRef.current = value;
    setOutput(value);
  };
  const handleLanguageChange = (e) => {
    console.log("e", e.target.value);
    socketRef.current.emit(ACTIONS.LANGUAGE_CHANGE, {
      roomId,
      language: e.target.value,
    });
    languageRef.current = e.target.value;
    setLanguage(e.target.value);
  };
  console.log(languageRef.current);
  return (
    <div className="w-full h-screen flex flex-col bg-[#272A37] overflow-hidden relative">
      <ToastContainer />
      <RoomHeader handleLanguageChange={handleLanguageChange} />
      <Sidebar users={clients} />
      <hr />
      <div className="flex">
        <div className="flex-[0.6]">
          <Editor
            type={"body"}
            theme={theme}
            width={"100%"}
            height={"80vh"}
            language={language}
            body={body}
            handleBodyChange={handleBodyChange}
            fontSize={fontSize}
          />
        </div>
        <div className="flex-[0.4] flex flex-col">
          <div className="">
            <Editor
              type={"input"}
              theme={theme}
              language={""}
              body={input}
              handleInputChange={handleInputChange}
              width={`${(window.innerWidth - 30) / 2}px`}
              height={"40vh"}
              fontSize={fontSize}
            />
            <Editor
              type={"output"}
              theme={theme}
              language={""}
              body={output}
              handleOutputChange={handleOutputChange}
              width={`${(window.innerWidth - 30) / 2}px`}
              readOnly={true}
              height={"40vh"}
              fontSize={fontSize}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Room;
