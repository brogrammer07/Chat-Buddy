import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
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
import { roomState } from "../atoms/roomModal";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { userState } from "../atoms/userModal";
import { socket } from "../utils/socket";
import { toast } from "react-toastify";
const Room = () => {
  const language = useRecoilValue(langaugeState);
  const [user, setUser] = useState(
    JSON.parse(sessionStorage.getItem("username"))
  );
  const username = useRecoilValue(userState);

  const theme = useRecoilValue(themeState);
  const fontSize = useRecoilValue(fontSizeState);

  const roomId = useParams();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [widthLeft, setWidthLeft] = useState("");
  const [widthRight, setWidthRight] = useState("");
  const [body, setBody] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [users, setUsers] = useState([]);
  const handleWidthChange = (e) => {
    e.preventDefault();

    let x = e.target.value;
    console.log(x);
    setWidthRight((100 - x).toString());
    setWidthLeft(x.toString());
  };
  useEffect(() => {
    if (user) {
      console.log(user, roomId);
      socket.emit("join_room", {
        roomId: roomId.id,
        username: user,
      });
    } else {
      console.log(username);
      socket.emit("join_room", {
        roomId: roomId.id,
        username: username,
      });
    }
    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
    socket.on("leave_room", ({ id, username }) => {
      setUsers(users.filter((user) => user.id !== id));
      toast.info(`${username} left the room`);
    });
  }, []);

  const handleBodyChange = () => {};
  const handleInputChange = () => {};

  return (
    <div className="w-full h-screen flex flex-col bg-[#272A37] overflow-hidden relative">
      <RoomHeader />
      <Sidebar users={users} />
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
                width={(window.innerWidth - 30) / 2}
                height={"35vh"}
                fontSize={fontSize}
              />
              <Editor
                theme={theme}
                language={""}
                body={output}
                setBody={setOutput}
                width={(window.innerWidth - 30) / 2}
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
