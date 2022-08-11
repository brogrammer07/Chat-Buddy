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
import { connect } from "../utils/socket";
import { ACTIONS } from "../utils/Actions";
const Room = () => {
  const language = useRecoilValue(langaugeState);
  const fontSize = useRecoilValue(fontSizeState);
  const theme = useRecoilValue(themeState);
  const [body, setBody] = useState("");
  const [input, setInput] = useState("");
  const navigate = useLocation();
  const [output, setOutput] = useState("");
  const location = useLocation();

  const [clients, setClients] = useState([]);
  console.log(location.state);
  const { roomId } = useParams();
  useEffect(() => {
    const socket = connect();
    socket.on("connect_error", (err) => handleErrors(err));
    socket.on("connect_failed", (err) => handleErrors(err));

    function handleErrors(e) {
      console.log("socket error", e);
      toast.error("Socket connection failed, try again later.");
      navigate("/");
    }

    socket.emit(ACTIONS.JOIN, {
      roomId,
      username: location.state?.username,
    });

    // Listening for joined event
    socket.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
      if (username !== location.state?.username) {
        toast.info(`${username} joined the room.`);
        console.log(`${username} joined`);
      }
      setClients(clients);
      // socket.emit(ACTIONS.SYNC_CODE, {
      //   code: codeRef.current,
      //   socketId,
      // });
    });

    // Listening for disconnected
    socket.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
      toast.info(`${username} left the room.`);
      setClients((prev) => {
        return prev.filter((client) => client.socketId !== socketId);
      });
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleInputChange = () => {};

  return (
    <div className="w-full h-screen flex flex-col bg-[#272A37] overflow-hidden relative">
      <ToastContainer />
      <RoomHeader />
      <Sidebar users={clients} />
      <hr />
      <div
        style={{
          position: "relative",
          width: "100%",
          padding: "0px 10px",
        }}>
        <Split className="wrap" sizes={[50, 50]}>
          <div className="">
            <Editor
              theme={theme}
              width={"100%"}
              height={"80vh"}
              language={language}
              body={body}
              setBody={setBody}
              fontSize={fontSize}
            />
          </div>
          <div className="grid grid-rows-2">
            <div className="comp">
              <Editor
                theme={theme}
                language={""}
                body={input}
                setBody={handleInputChange}
                width={`${(window.innerWidth - 30) / 2}px`}
                height={"35vh"}
                fontSize={fontSize}
              />
              <Editor
                theme={theme}
                language={""}
                body={output}
                setBody={setOutput}
                width={`${(window.innerWidth - 30) / 2}px`}
                readOnly={true}
                height={"39vh"}
                fontSize={fontSize}
              />
            </div>
          </div>
        </Split>
      </div>
    </div>
  );
};

export default Room;
