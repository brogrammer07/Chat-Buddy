import React, { useEffect, useState } from "react";
import { BsChevronCompactRight, BsChevronCompactLeft } from "react-icons/bs";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { socket } from "../utils/socket";

const Sidebar = ({ users }) => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const roomId = useParams();
  const navigate = useNavigate();

  useEffect(() => {}, []);
  return (
    <div
      className={`absolute bg-[#1B1C29] h-screen z-[10] flex transition-all duration-100 w-[15rem] ${
        openSidebar ? "translate-x-[0]" : "-translate-x-[13.5rem]"
      }`}>
      <ToastContainer />
      <div className="flex-[0.95] flex flex-col text-white pl-4 pr-1 py-3 justify-between">
        <div className="">
          <div className=" border-b-[1px] border-[#313131] pb-4">
            <h1 className="font-bold text-[2rem]">Chat Buddy</h1>
            <p className="text-[#1d90f5]">Realtime Collaboration</p>
          </div>
          <div className="py-3 space-y-3">
            <h2 className="font-semibold text-[18px]">Connected</h2>
            <div className="grid grid-cols-3 gap-1 h-[57vh] overflow-y-auto scrollbar-hide">
              {users.map((user, i) => (
                <div
                  className="flex flex-col items-center space-y-1 h-[5rem]"
                  key={user.id}>
                  <div className="bg-red-600 flex items-center justify-center w-[3rem] h-[3rem] rounded-xl text-[20px] font-bold">
                    {user.username.charAt(0)}
                  </div>
                  <p>{user.username}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col space-y-3 items-center">
          <button
            onClick={() => {
              navigator.clipboard.writeText(roomId.id);
              toast.success("Room ID copied to clipboard");
            }}
            className="bg-slate-200 w-full text-black font-bold rounded-xl py-2 hover:bg-slate-300 duration-150 transition-all">
            COPY ROOM ID
          </button>
          <button
            onClick={() => {
              socket.disconnect();
              navigate("/");
            }}
            className="bg-red-500 w-full flex items-center justify-center text-white font-bold  rounded-xl py-2 hover:bg-red-600 duration-150 transition-all">
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
