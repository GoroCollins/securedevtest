import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthService } from "./Auth.Service";

export const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated } = useAuthService();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};
