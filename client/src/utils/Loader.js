import React from "react";
import LoadingScreen from "react-loading-screen";
const Loader = () => {
  return (
    <LoadingScreen
      loading={true}
      bgColor="#272A37"
      spinnerColor="#9ee5f8"
      textColor="#676767"
      logoSrc=""
      text="">
      {" "}
    </LoadingScreen>
  );
};

export default Loader;
