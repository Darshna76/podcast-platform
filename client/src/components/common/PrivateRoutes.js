import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import Loader from "./Loader";

function PrivateRoutes() {
  const { user, loading } = useAppContext();

  if (loading) {
    return <Loader />;
  }

  return user ? <Outlet /> : <Navigate to="/" replace />;
}

export default PrivateRoutes;