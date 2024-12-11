import { createContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

export const SocketContext = createContext();
const socket = io("http://localhost:5000"); // Initialize the socket once outside the component

const SocketProvider = ({ children }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket connected");
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socket.on("getUsers", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (userInfo?.id) {
      socket.emit("addUser", userInfo.id);
    }
  }, [userInfo]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
