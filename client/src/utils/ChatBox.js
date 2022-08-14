import React, { useEffect, useRef, useState } from "react";
import { MdClose, MdSend } from "react-icons/md";
import { FaRegWindowMinimize } from "react-icons/fa";
import { BsChevronCompactUp, BsFillEmojiSmileFill } from "react-icons/bs";
import Picker from "emoji-picker-react";
import { ACTIONS } from "./Actions";
import Typing from "./Typing";
const ChatBox = ({
  setOpenChat,
  roomName,
  socketRef,
  roomId,
  username,
  setMessages,
  messages,
}) => {
  const [minimize, setMinimize] = useState(false);
  const [message, setMessage] = useState("");
  const [typing, setTyping] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);
  const handleChange = (e) => {
    socketRef.current.emit(ACTIONS.TYPING, { username, roomId });
    setMessage(e.target.value);
  };
  const sendMessage = (e) => {
    e.preventDefault();
    socketRef.current.emit(ACTIONS.SEND_MESSAGE, {
      message,
      roomId,
      socketId: socketRef.current.id,
      username,
    });
    setMessages((list) => [
      ...list,
      { message, socketId: socketRef.current.id, username },
    ]);
    setMessage("");
  };
  const [showEmoji, setShowEmoji] = useState(false);

  const onEmojiClick = (event, emojiObject) => {
    setMessage(message + emojiObject.emoji);
  };

  useEffect(() => {
    socketRef.current.on(ACTIONS.RECEIVE_MESSAGE, (data) => {
      setMessages((list) => [...list, data]);
      setIsTyping(false);
      console.log(data);
    });
    socketRef.current.on(ACTIONS.TYPED, (data) => {
      setIsTyping(true);
      setTyping(data.username);
    });
  }, []);
  useEffect(() => {
    console.log("Scroll");
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isTyping) {
      setTimeout(() => {
        setIsTyping(false);
      }, 2000);
    }
  }, [isTyping]);
  return (
    <div className="absolute bottom-2 z-10 right-32 w-[20rem] bg-[#272727] rounded-md flex flex-col">
      <div className="h-[3rem] border-b-[1px] border-[#3e3d3d] cursor-pointer flex items-center px-4 justify-between">
        <div className="text-[#dedede]">Room - {roomName}</div>
        <div className="text-[#1d90f5] flex space-x-3 ">
          {minimize ? (
            <BsChevronCompactUp size={30} onClick={() => setMinimize(false)} />
          ) : (
            <FaRegWindowMinimize
              onClick={() => setMinimize(!minimize)}
              size={20}
            />
          )}
          <MdClose onClick={() => setOpenChat(false)} size={30} />
        </div>
      </div>
      <div hidden={minimize} className="h-[22rem] relative">
        <div
          onClick={() => setShowEmoji(false)}
          className="h-[19rem] px-2 py-5 overflow-y-auto overflow-x-hidden space-y-1">
          {messages.map((message, index) => (
            <>
              {message.socketId !== socketRef.current.id ? (
                <div key={index} className="flex space-x-2 w-full">
                  <div className="rounded-full h-[2rem] w-[2rem] bg-red-600 flex items-center justify-center text-white self-end">
                    {message.username.charAt(0)}
                  </div>
                  <p className="bg-[#4d4d4d] min-w-[3%] max-w-[55%] rounded-xl p-2 text-gray-200">
                    {message.message}
                  </p>
                </div>
              ) : (
                <div
                  key={index}
                  className="flex space-x-2 w-full justify-end  ">
                  <p className="bg-[#1f5dc1] max-w-[55%]  rounded-xl p-2 text-gray-200 mr-3">
                    {message.message}
                  </p>
                </div>
              )}
            </>
          ))}
          {isTyping && (
            <div className="flex space-x-2 w-full items-center">
              <div className="rounded-full h-[2rem] w-[2rem] bg-red-600 flex items-center justify-center text-white self-end">
                {typing.charAt(0)}
              </div>
              <Typing />
            </div>
          )}
          <div ref={bottomRef}></div>
        </div>
        <form
          onSubmit={sendMessage}
          className=" flex items-center px-4 w-full space-x-4 mb-3">
          <div className="bg-[#3c3c3c] w-full rounded-full flex items-center px-2">
            <input
              onClick={() => setShowEmoji(false)}
              value={message}
              onChange={handleChange}
              placeholder="Type a message"
              className="bg-[#3c3c3c] px-2 py-2 outline-none rounded-l-full w-full text-white h-[2.5rem] overflow-hidden"
            />
            <BsFillEmojiSmileFill
              onClick={() => setShowEmoji(!showEmoji)}
              className="cursor-pointer"
              size={20}
              color={"#1d90f5"}
            />
            {showEmoji && (
              <div className="absolute -top-8 -left-6">
                <Picker
                  onEmojiClick={onEmojiClick}
                  disableAutoFocus={true}
                  native
                />
              </div>
            )}
          </div>
          <button type="submit">
            <MdSend color={"#1d90f5"} size={25} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;
