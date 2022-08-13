import { io } from "socket.io-client";

export const initSocket = () => {
  return io(process.env.REACT_APP_SERVER_URL);
};
