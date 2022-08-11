import io from "socket.io-client";

export const connect = () => {
  const socket = io(process.env.REACT_APP_SERVER_URL);
  return socket;
};
