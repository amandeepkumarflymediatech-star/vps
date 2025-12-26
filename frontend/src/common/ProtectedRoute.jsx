import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuth = false; // later JWT logic

  return isAuth ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
