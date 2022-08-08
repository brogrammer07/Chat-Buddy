import React, { useState } from "react";
import { useRecoilValue } from "recoil";
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
const Room = () => {
  const language = useRecoilValue(langaugeState);
  const theme = useRecoilValue(themeState);
  const fontSize = useRecoilValue(fontSizeState);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [widthLeft, setWidthLeft] = useState("");
  const [widthRight, setWidthRight] = useState("");
  const [body, setBody] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleWidthChange = (e) => {
    e.preventDefault();

    let x = e.target.value;
    console.log(x);
    setWidthRight((100 - x).toString());
    setWidthLeft(x.toString());
  };

  const handleBodyChange = () => {};
  const handleInputChange = () => {};

  return (
    <div className="w-full h-screen flex flex-col bg-[#272A37] overflow-hidden relative">
      <RoomHeader />
      <Sidebar />
      <hr />
      <div
        style={{
          position: "relative",
          width: "100%",
        }}
      >
        <Split class="wrap" sizes={[50, 50]}>
          <div className="">
            <Editor
              theme={theme}
              width={"100%"}
              height={"80vh"}
              language={language}
              body={mainEditorBody}
              setBody={SetMainEditorBody}
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
