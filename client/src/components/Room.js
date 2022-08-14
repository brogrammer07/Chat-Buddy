import React, { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import queryString from "query-string";
import {
  fontSizeState,
  langaugeState,
  themeState,
} from "../atoms/editorOptionsModal";
import Editor from "../utils/Editor";
import "./Room.css";

import RoomHeader from "./RoomHeader";
import Sidebar from "./Sidebar";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { initSocket } from "../utils/socket";
import { ACTIONS } from "../utils/Actions";
import { Helmet } from "react-helmet";
import axios from "axios";
import Loader from "../utils/Loader";
const Room = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Editor Options Modal
  const [language, setLanguage] = useRecoilState(langaugeState);
  const fontSize = useRecoilValue(fontSizeState);
  const theme = useRecoilValue(themeState);
  const [roomName, setRoomName] = useState("Room");
  const languageRef = useRef(null);
  // Body, Input, Output with their respective refs
  const [body, setBody] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const bodyRef = useRef(null);
  const inputRef = useRef(null);
  const outputRef = useRef(null);
  // Ref Assignings
  languageRef.current = language;
  bodyRef.current = body;
  inputRef.current = input;
  outputRef.current = output;
  // Socket Connection and Initialization
  const socketRef = useRef(null);
  const [clients, setClients] = useState([]);
  const { roomId } = useParams();
  // Loader
  const [loading, setLoading] = useState(true);

  // Get Room Details from DB and set it to state
  useEffect(() => {
    if (location.state === null) {
      navigate("/");
    }
    const getRoomData = async () => {
      await axios
        .post(`${process.env.REACT_APP_SERVER_URL}/api/getroomdata`, {
          roomId: roomId,
        })
        .then((res) => {
          let data = JSON.parse(localStorage.getItem("room"));
          data.roomName = res.data.name;
          localStorage.setItem("room", JSON.stringify(data));
          setLoading(false);
          setRoomName(res.data.name);
          setBody(res.data.body);
          setInput(res.data.input);
          setLanguage(res.data.language);
        })
        .catch((err) => {
          console.log(err);
          toast.error("Error in getting room data");
        });
    };
    getRoomData();
  }, []);

  // Socket Connection and Initialization
  useEffect(() => {
    if (!loading) {
      const init = () => {
        socketRef.current = initSocket();
        // Socket Connection Errors
        socketRef.current.on("connect_error", (err) => handleErrors(err));
        socketRef.current.on("connect_failed", (err) => handleErrors(err));
        function handleErrors(e) {
          toast.error("Socket connection failed, try again later.");
          navigate("/");
        }

        // Join Room Event on Socket Connection
        socketRef.current.emit(ACTIONS.JOIN, {
          roomId,
          username: location.state?.username,
        });

        // Listening for Joined Clients
        socketRef.current.on(
          ACTIONS.JOINED,
          ({ clients, username, socketId }) => {
            if (username !== location.state?.username) {
              toast.info(`${username} joined the room.`);
              console.log(username, language);
              // Sync Clients with other clients
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
          toast.info(`${username} left the room.`);
          setClients((prev) => {
            return prev.filter((client) => client.socketId !== socketId);
          });
        });
      };
      init();
      // Disconnect Socket on unmount
      return () => {
        socketRef.current.disconnect();
        socketRef.current.off(ACTIONS.JOINED);
        socketRef.current.off(ACTIONS.DISCONNECTED);
      };
    }
  }, [loading]);

  // Handle Body Change
  const handleBodyChange = (value) => {
    socketRef.current.emit(ACTIONS.BODY_CHANGE, {
      roomId,
      body: value,
    });
    bodyRef.current = value;
    setBody(value);
  };

  // Handle Input Change
  const handleInputChange = (value) => {
    socketRef.current.emit(ACTIONS.INPUT_CHANGE, {
      roomId,
      input: value,
    });
    inputRef.current = value;
    setInput(value);
  };

  // Handle Output Change
  const handleOutputChange = (value) => {
    socketRef.current.emit(ACTIONS.OUTPUT_CHANGE, {
      roomId,
      output: value,
    });
    outputRef.current = value;
    setOutput(value);
  };

  useEffect(() => {
    if (output) {
      handleOutputChange(output);
    }
  }, [output]);

  // Handle Language Change
  const handleLanguageChange = (e) => {
    console.log("e", e.target.value);
    socketRef.current.emit(ACTIONS.LANGUAGE_CHANGE, {
      roomId,
      language: e.target.value,
    });
    languageRef.current = e.target.value;
    setLanguage(e.target.value);
  };
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="w-full h-screen flex flex-col bg-[#434343] overflow-hidden relative">
          <Helmet>
            <meta charSet="utf-8" />
            <title>Chat Buddy | {roomName}</title>
          </Helmet>
          <ToastContainer />
          <RoomHeader
            handleLanguageChange={handleLanguageChange}
            inputRef={inputRef}
            outputRef={outputRef}
            bodyRef={bodyRef}
            languageRef={languageRef}
            roomId={roomId}
            socketRef={socketRef}
            output={output}
            setOutput={setOutput}
          />
          <Sidebar users={clients} />
          <hr />
          <div className="flex lg:flex-row flex-col overflow-y-auto lg:overflow-y-hidden bg-[#434343]">
            <div className="flex-[0.7] border-[1rem] border-b-[2rem] border-l-[3rem] border-[#434343] lg:h-[80vh]">
              <p className="text-white bg-[#434343] mx-auto">Code</p>
              <Editor
                type={"body"}
                theme={theme}
                width={"100%"}
                language={language}
                body={body}
                handleBodyChange={handleBodyChange}
                fontSize={fontSize}
              />
            </div>
            <div className="flex-[0.3] flex flex-col border-r-[1rem] border-b-[1rem] border-[#434343] h-[82vh]">
              <div className="border-[1rem] border-[#434343] h-full ">
                <p className="text-white bg-[#434343] mx-auto pl-[2rem] lg:pl-0">
                  Input
                </p>
                <Editor
                  type={"input"}
                  theme={theme}
                  language={""}
                  body={input}
                  handleInputChange={handleInputChange}
                  width={"100%"}
                  height={"34vh"}
                  fontSize={fontSize}
                />
              </div>
              <div className="border-[1rem] border-t-0 border-[#434343] h-full">
                <p className="text-white bg-[#434343] mx-auto pl-[2rem] lg:pl-0">
                  Output
                </p>
                <Editor
                  type={"output"}
                  theme={theme}
                  language={""}
                  body={output}
                  handleOutputChange={handleOutputChange}
                  width={"100%"}
                  readOnly={true}
                  height={"34vh"}
                  fontSize={fontSize}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Room;
