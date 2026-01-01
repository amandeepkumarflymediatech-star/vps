// import { Navigate } from "react-router-dom";

// const DashboardRedirect = () => {
//   const user = JSON.parse(localStorage.getItem("user"));

//   if (!user) return <Navigate to="/login" replace />;

//   if (user.role === "admin") return <Navigate to="/admin" replace />;
//   if (user.role === "tutor") return <Navigate to="/tutor" replace />;

//   return <Navigate to="/" replace />;
// };

// export default DashboardRedirect;



import { Navigate } from "react-router-dom";

const DashboardRedirect = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  if (user.role === "tutor") {
    return <Navigate to="/tutor/dashboard" replace />;
  }

  return <Navigate to="/" replace />;
};

export default DashboardRedirect;
