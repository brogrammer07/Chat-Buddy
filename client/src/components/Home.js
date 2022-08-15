import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import logo from "../Assets/Bg_improved.jpg";
import Form from "./Form";
import HomeHeader from "./HomeHeader";

const Home = () => {
  const [theme, setTheme] = useState(JSON.parse(localStorage.getItem("theme")));
  useEffect(() => {
    if (theme === undefined) {
      localStorage.setItem("theme", JSON.stringify("dark"));
    }
  }, []);
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
