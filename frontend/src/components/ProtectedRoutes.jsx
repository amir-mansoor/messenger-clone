import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
  const { userInfo } = useSelector((state) => state.auth);
  return !userInfo ? <Navigate to="/login" replace /> : <Outlet />;
};

export default ProtectedRoutes;
