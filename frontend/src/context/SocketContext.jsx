import { createContext, useEffect } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

export const SocketContext = createContext();
const socket = io("http://localhost:5000");

const SocketProvider = ({ children }) => {
  const { userInfo } = useSelector((state) => state.auth);
  useEffect(() => {
    socket.on("connect", () => {
      if (userInfo) {
        socket.emit("addUser", userInfo.id);
      }
    });

    socket.on("disconnect", () => {});
  }, []);
  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
