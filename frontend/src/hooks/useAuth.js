import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const navigate = useNavigate();

  const logout = () => {
    // clear auth data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // redirect
    navigate("/login");
  };

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  return {
    user,
    token,
    isAdmin: user?.role === "admin",
    isTutor: user?.role === "tutor",
    logout,
  };
};
