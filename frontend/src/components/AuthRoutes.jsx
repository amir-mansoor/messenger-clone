import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const AuthRoutes = () => {
  const { userInfo } = useSelector((state) => state.auth);
  return userInfo ? <Navigate to="/chats" replace /> : <Outlet />;
};

export default AuthRoutes;
