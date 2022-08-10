import React, { useEffect } from "react";
import { io } from "socket.io-client";
import logo from "../Assets/Bg_improved.jpg";
import Form from "./Form";
import HomeHeader from "./HomeHeader";

const Home = () => {
  return (
    <div
      className="w-full h-screen flex flex-col"
      style={{
        backgroundImage: `url(${logo})`,
        backgroundSize: "cover",
      }}>
      <HomeHeader />
      <Form />
    </div>
  );
};

export default Home;
