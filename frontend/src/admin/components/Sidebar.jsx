import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const Sidebar = () => {
  const { logout } = useAuth();

  return (
    <aside className="w-64 bg-white shadow-lg">
      <div className="p-5 text-xl font-bold border-b">
        Admin Panel
      </div>

      <nav className="p-4 space-y-2">
        <NavLink to="/admin" className="block p-2 rounded hover:bg-gray-200">
          Dashboard
        </NavLink>

        <NavLink to="/admin/users" className="block p-2 rounded hover:bg-gray-200">
          Users
        </NavLink>

        <NavLink to="/admin/tutors" className="block p-2 rounded hover:bg-gray-200">
          Tutors
        </NavLink>

        <NavLink to="/admin/settings" className="block p-2 rounded hover:bg-gray-200">
          Settings
        </NavLink>

        <button
          onClick={logout}
          className="w-full text-left p-2 rounded text-red-600 hover:bg-red-100"
        >
          Logout
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
