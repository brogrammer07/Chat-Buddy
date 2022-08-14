import React from "react";

const ChatBox = ({ setOpenChat }) => {
  return (
    <div className="absolute bottom-0 z-10 right-32 w-[20rem] bg-[#272727] h-[22rem] rounded-md flex flex-col">
      <div
        onClick={() => setOpenChat(false)}
        className="h-[3rem] border-b-[1px] border-[#3e3d3d] cursor-pointer"></div>
    </div>
  );
};

export default ChatBox;
