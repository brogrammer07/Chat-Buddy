import React, { useEffect, useState } from "react";
import { BsChevronCompactRight, BsChevronCompactLeft } from "react-icons/bs";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { AiFillSetting } from "react-icons/ai";
import { ThemeSwitch } from "../utils/Switches";

const Sidebar = ({ users, roomName, setOpenChat }) => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const { roomId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {}, []);
  return (
    <div
      className={`absolute bg-[#c2c2c2] dark:bg-[#1B1C29] h-screen z-[10] flex transition-all duration-100 w-[15rem] ${
        openSidebar ? "translate-x-[0]" : "-translate-x-[13.5rem]"
      }`}>
      <div className="flex-[0.95] flex flex-col text-gray-600 dark:text-white pl-4 pr-1 py-3 justify-between">
        <div className="">
          <div className=" border-b-[1px] border-[#313131] pb-4">
            <h1 className="font-bold text-[2rem]">Chat Buddy</h1>
            <div className="flex space-x-3 items-center">
              <p className="text-blue-800 dark:text-[#1d90f5]">
                Room - {roomName}
              </p>
            </div>
          </div>
          <div className="py-3 space-y-3">
            <h2 className="font-semibold text-[18px]">Connected</h2>
            <div className="grid grid-cols-3 gap-1 h-[57vh] overflow-y-auto scrollbar-hide">
              {users.map((user, i) => (
                <div
                  className="flex flex-col items-center space-y-1 h-[5rem]"
                  key={i}>
                  <div className="bg-[#352626] dark:bg-red-600 flex items-center justify-center w-[3rem] h-[3rem] rounded-xl text-[20px] font-bold text-white">
                    {user.username.charAt(0)}
                  </div>
                  <p>{user.username}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col space-y-3 items-center">
          <div className="flex space-x-3 w-full">
            <button
              onClick={() => setOpenChat(true)}
              className="bg-[#000000] dark:bg-[#ffffff] text-green-600 hover:text-green-400 w-full font-bold rounded-xl py-2 dark:hover:text-green-800 duration-150 transition-all">
              CHAT
            </button>
            <button className="bg-[#000000] dark:bg-[#ffffff] text-blue-600 hover:text-blue-400 w-full font-bold rounded-xl py-2 dark:hover:text-blue-800 duration-150 transition-all">
              AUDIO
            </button>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(roomId);
              toast.success("Room ID copied to clipboard");
            }}
            className="dark:bg-slate-200 bg-gray-700 text-white w-full hover:bg-black dark:text-black font-bold rounded-xl py-2 dark:hover:bg-slate-300 duration-150 transition-all">
            COPY ROOM ID
          </button>
          <button
            onClick={() => {
              navigate("/");
            }}
            className="dark:bg-red-500 bg-white w-full flex items-center justify-center text-red-500 dark:text-white font-bold  rounded-xl py-2 hover:text-red-400  dark:hover:bg-red-600 duration-150 transition-all">
            LEAVE
          </button>
        </div>
      </div>
      <div className="flex-[0.05] flex items-center">
        {openSidebar ? (
          <BsChevronCompactLeft
            onClick={() => setOpenSidebar(false)}
            size={25}
            className="text-white cursor-pointer"
          />
        ) : (
          <BsChevronCompactRight
            onClick={() => setOpenSidebar(true)}
            size={25}
            className="text-white cursor-pointer"
          />
        )}
      </div>
    </div>
  );
};

export default Sidebar;
