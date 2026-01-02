import { Link, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, BookOpen, Settings, LogOut } from "lucide-react";

const TutorLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("tutorToken");
    navigate("/tutor/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-64 bg-[#0852A1] text-white hidden md:flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-white/20">
          <img src="/logo.png" alt="Logo" className="w-36" />
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link to="/tutor/dashboard" className="flex items-center gap-3 px-4 py-2 rounded hover:bg-white/20">
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link to="/tutor/classes" className="flex items-center gap-3 px-4 py-2 rounded hover:bg-white/20">
            <BookOpen size={18} /> Classes
          </Link>
          <Link to="/tutor/settings" className="flex items-center gap-3 px-4 py-2 rounded hover:bg-white/20">
            <Settings size={18} /> Settings
          </Link>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">

        {/* TOPBAR */}
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Tutor Panel</h1>

          <div className="flex items-center gap-4">
            <img
              src="https://i.pravatar.cc/40"
              alt="Tutor"
              className="w-10 h-10 rounded-full"
            />

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-medium text-red-600 hover:underline"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default TutorLayout;
