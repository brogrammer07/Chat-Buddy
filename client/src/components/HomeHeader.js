import React from "react";
import { useRecoilState } from "recoil";
import { formState } from "../atoms/formModal";

const HomeHeader = () => {
  const [isJoin, setIsJoin] = useRecoilState(formState);
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
    </div>
  );
};

export default HomeHeader;
