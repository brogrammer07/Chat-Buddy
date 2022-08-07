import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import {
  fontSizeState,
  langaugeState,
  themeState,
} from "../atoms/editorOptionsModal";
import Editor from "../utils/Editor";

import RoomHeader from "./RoomHeader";
import Sidebar from "./Sidebar";
const Room = () => {
  const language = useRecoilValue(langaugeState);
  const theme = useRecoilValue(themeState);
  const fontSize = useRecoilValue(fontSizeState);
  const [mainEditorBody, SetMainEditorBody] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  return (
    <div className="w-full h-screen flex flex-col bg-[#272A37] overflow-hidden relative">
      <RoomHeader />
      <Sidebar />
      <div className="grid grid-cols-2">
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
          <div className="">
            {" "}
            <Editor
              theme={theme}
              language={""}
              body={input}
              setBody={setInput}
              height={"40vh"}
              width={1000}
              fontSize={fontSize}
            />
          </div>
          <div className="">
            <Editor
              theme={theme}
              language={""}
              body={output}
              setBody={setOutput}
              readOnly={true}
              height={"40vh"}
              width={1000}
              fontSize={fontSize}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Room;
