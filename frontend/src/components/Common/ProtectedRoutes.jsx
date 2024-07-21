// import { Navigate, useLocation } from "react-router-dom";
// import { authService } from "./Auth.Service"

// export const ProtectedRoute = ({ children }) => {
//   const location = useLocation();
//   // if (!token) {
//   //   // user is not authenticated
//   //   // return <Navigate to="/signin" />;
//   //   return <Navigate to="/" replace state={{ from: location }} />;
//   // }
//   return children;
// };
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
