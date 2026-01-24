"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import logo from "@/assets/logo/logo.webp";

import {
  Home,
  BookOpen,
  Package,
  LogOut,
  CalendarCheck,
  Menu,
  X,
  GraduationCap,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const StudentSidebar = ({
  sidebarOpen,
  setSidebarOpen,
  isCollapsed,
  toggleCollapse,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem("user");
    setUser(raw ? JSON.parse(raw) : {});
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const menuItems = [
    { name: "Dashboard", path: "/student/dashboard", icon: <Home size={20} /> },
    {
      name: "My Courses",
      path: "/student/courses",
      icon: <BookOpen size={20} />,
    },
    {
      name: "Packages",
      path: "/student/packages",
      icon: <Package size={20} />,
    },
    {
      name: "Book a Trial",
      path: "/student/myClass",
      icon: <CalendarCheck size={20} />,
    },
    {
      name: "Tutors",
      path: "/student/allTutors",
      icon: <GraduationCap size={20} />,
    },
    { name: "Profile", path: "/student/profile", icon: <User size={20} /> },
  ];

  const baseStyle =
    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all mb-1 overflow-hidden whitespace-nowrap";
  const activeStyle =
    "bg-white/20 text-white font-bold border-l-4 border-white shadow-inner";
  const inactiveStyle = "text-white/70 hover:bg-white/10 hover:text-white";

  return (
    <>
      {/* ================= MOBILE HEADER ================= */}
      {/* Added 'top-0' and 'z-[60]' to stay above everything */}
      <div className="md:hidden fixed top-0 left-0 w-full z-[100] bg-gradient-to-r from-blue-600 to-purple-600 shadow-md">
        <div className="flex items-center justify-between p-3 px-5">
          <div className="flex items-center gap-3">
            <img
              src={logo.src}
              alt="Logo"
              className="w-8 h-8 bg-white p-1 rounded-lg object-contain"
            />
            <span className="text-sm font-black tracking-tight text-white uppercase">
              Student Hub
            </span>
          </div>

          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* ================= OVERLAY (MOBILE) ================= */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] md:hidden transition-opacity"
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-[120] 
        bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-700
        transform transition-all duration-300 ease-in-out shadow-2xl flex flex-col
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 
        ${isCollapsed ? "w-20" : "w-[280px] sm:w-[320px] md:w-72"}`}
      >
        {/* ---------- HEADER ---------- */}
        <div className="relative flex items-center justify-between p-6 flex-shrink-0">
          <Link
            href="/"
            className={`flex items-center gap-3 transition-opacity duration-300 ${isCollapsed ? "justify-center w-full" : ""
              }`}
            onClick={() => setSidebarOpen(false)}
          >
            <img
              src={logo.src}
              alt="Logo"
              className="w-10 h-10 bg-white p-1 rounded-lg shadow-md shrink-0"
            />
            {!isCollapsed && (
              <span className="text-xl font-black text-white tracking-tighter whitespace-nowrap overflow-hidden">
                STUDENT HUB
              </span>
            )}
          </Link>

          {/* DESKTOP COLLAPSE BUTTON */}
          <button
            onClick={toggleCollapse}
            className={`hidden md:flex absolute top-1/2 -translate-y-1/2
              items-center justify-center p-1.5 rounded-full 
              bg-white text-indigo-700 shadow-lg border border-indigo-100
              hover:bg-indigo-50 transition-all z-50
              ${isCollapsed ? "-right-3" : "right-4"}`}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>

          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-white/80 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* ---------- MENU (Scrollable) ---------- */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-2 custom-scrollbar space-y-1">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.path}
              onClick={() => setSidebarOpen(false)}
              title={isCollapsed ? item.name : ""}
              className={`${baseStyle} ${pathname === item.path ? activeStyle : inactiveStyle
                } ${isCollapsed ? "justify-center px-0" : ""}`}
            >
              <div className="shrink-0">{item.icon}</div>
              {!isCollapsed && (
                <span className="text-[15px] duration-200">{item.name}</span>
              )}
            </Link>
          ))}
        </nav>

        {/* ---------- PROFILE (Bottom) ---------- */}
        <div className="p-4 border-t border-white/10">
          <div
            className={`bg-white/10 rounded-2xl p-4 backdrop-blur-sm transition-all ${isCollapsed ? "flex flex-col items-center p-2" : ""
              }`}
          >
            {!isCollapsed ? (
              <>
                <div className="flex flex-col gap-1 mb-3">
                  <p className="text-sm font-bold text-white truncate">
                    {user?.name || "Student User"}
                  </p>
                  <p className="text-[10px] uppercase tracking-widest text-white/50">
                    {user?.role || "Student"}
                  </p>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5
                  rounded-xl bg-red-500 hover:bg-red-600 text-white
                  transition-all text-xs font-bold shadow-lg"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={handleLogout}
                title="Logout"
                className="p-2 rounded-xl bg-red-500 hover:bg-red-600 text-white shadow-lg"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default StudentSidebar;