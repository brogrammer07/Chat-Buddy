import React from "react";
import { useRecoilValue } from "recoil";
import {
  fontSizeState,
  langaugeState,
  themeState,
} from "../atoms/editorOptionsModal";
import Editor from "../utils/Editor";

import RoomHeader from "./RoomHeader";
const Room = () => {
  const language = useRecoilValue(langaugeState);
  const theme = useRecoilValue(themeState);
  const fontSize = useRecoilValue(fontSizeState);
  return (
    <div className="w-full h-screen flex flex-col bg-[#272A37]">
      <RoomHeader />
      <div className="grid grid-cols-2">
        <div className="">
          <Editor
            theme={theme}
            width={window.innerWidth}
            // @ts-ignore
            language={language}
            body={""}
            setBody={""}
            fontSize={fontSize}
          />
        </div>
        <div className="grid grid-rows-2">
          <div className="">
            {" "}
            <Editor
              theme={theme}
              language={""}
              body={""}
              setBody={""}
              height={"35vh"}
              width={1000}
              fontSize={fontSize}
            />
          </div>
          <div className="">
            <Editor
              theme={theme}
              language={""}
              body={""}
              setBody={""}
              readOnly={true}
              height={"39vh"}
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
