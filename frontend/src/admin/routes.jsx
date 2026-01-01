import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Tutors from "./pages/Tutors";
import Users from "./pages/Users";
import Settings from "./pages/Settings";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route index element={<Dashboard />} />
      <Route path="tutors" element={<Tutors />} />
      <Route path="users" element={<Users />} />
      <Route path="settings" element={<Settings />} />
    </Routes>
  );
};

export default AdminRoutes;
