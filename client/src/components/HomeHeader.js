import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { formState } from "../atoms/formModal";

const HomeHeader = () => {
  const [isJoin, setIsJoin] = useRecoilState(formState);
  const navigate = useNavigate();
  const [historyRoom, setHistoryRoom] = useState(
    JSON.parse(localStorage.getItem("room")) || []
  );
  const [username, setUsername] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const handleJoin = () => {
    navigate(`/room/${historyRoom.roomId}`, {
      state: {
        username: username,
      },
    });
  };
  return (
    <div className="flex text-[#5b5b5b] space-x-16 px-8 pl-24 py-10 w-full font-semibold text-[1.2rem]">
      <div className="cursor-pointer text-white">Chat Buddy</div>

      <div
        onClick={() => setIsJoin(true)}
        className={`cursor-pointer ${
          isJoin && "text-white"
        } hover:text-white duration-200 transition-all`}>
        Join
      </div>
      <div
        onClick={() => setIsJoin(false)}
        className={`cursor-pointer ${
          !isJoin && "text-white"
        } hover:text-white duration-200 transition-all`}>
        Create
      </div>
      <div
        onMouseEnter={() => setShowHistory(true)}
        onMouseLeave={() => setShowHistory(false)}
        className={`cursor-pointer ${
          !isJoin && "text-white"
        } hover:text-white duration-200 transition-all relative`}>
        <p>History</p>
        {showHistory && (
          <>
            {historyRoom.length !== 0 ? (
              <div className="w-[15rem]  rounded-md  bg-[#1c1d23] -right-[140%]  border-[#404040] text-black absolute flex flex-col items-center space-y-3 backdrop-blur-xl shadow-xl py-4 pb-7">
                <div className=" text-[#1d90f5] font-bold">
                  {historyRoom.roomName}
                </div>
                <input
                  className="w-[10rem] rounded-xl px-3 py-1 text-[15px] outline-none"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                />
                <button
                  onClick={handleJoin}
                  className="w-[10rem] text-[14px] text-white bg-[#1df594] rounded-xl px-4 py-1 font-bold hover:bg-[#13a161] duration-200 transition-all ">
                  Join
                </button>
              </div>
            ) : (
              <div className="w-[15rem]  rounded-md  bg-[#1c1d23] -right-[140%]  border-[#404040] text-black absolute flex flex-col items-center backdrop-blur-xl shadow-xl py-6 ">
                <div className="text-red-600">No History Found</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HomeHeader;
