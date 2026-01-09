"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  Clock,
  Trophy,
  Star,
  LayoutDashboard,
} from "lucide-react";

const Dashboard = () => {
  /* ---------------- STATE ---------------- */

  // Logged-in user data
  const [user, setUser] = useState(null);

  /* ---------------- EFFECTS ---------------- */

  // Fetch user from localStorage (client-side only)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const raw = localStorage.getItem("user");
    setUser(raw ? JSON.parse(raw) : null);
  }, []);

  /* ---------------- MOCK STATS (API READY) ---------------- */

  const userStats = {
    weeklyProgress: 72, // % progress
  };

  // Cards configuration
  const statsConfig = [
    {
      label: "Completed",
      value: "12",
      icon: <BookOpen />,
      bg: "bg-blue-50 text-blue-600",
    },
    {
      label: "Hours",
      value: "128h",
      icon: <Clock />,
      bg: "bg-orange-50 text-orange-600",
    },
    {
      label: "Points",
      value: "2,450",
      icon: <Trophy />,
      bg: "bg-yellow-50 text-yellow-600",
    },
    {
      label: "Streak",
      value: "8 Days",
      icon: <Star />,
      bg: "bg-purple-50 text-purple-600",
    },
  ];

  /* ---------------- UI ---------------- */

  return (
    // FULL WIDTH / NO EXTRA MARGINS
    <div className="w-full min-h-screen bg-gray-50">
      
      {/* MAIN CONTENT AREA */}
      <main className="w-full space-y-8">

        {/* ---------- WELCOME SECTION ---------- */}
        <div className="px-6 pt-6 animate-in fade-in slide-in-from-left duration-700">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Welcome, {user?.name || "Student"} 👋
          </h1>

          <p className="text-slate-500 mt-1 font-medium">
            You've reached{" "}
            <b className="text-[#0852A1] font-black">
              {userStats.weeklyProgress}%
            </b>{" "}
            of your weekly goal. Keep it up!
          </p>
        </div>

        {/* ---------- STATS GRID ---------- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-6">
          {statsConfig.map((s, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-3xl border border-gray-100
                         hover:shadow-md transition-all active:scale-95"
            >
              {/* Icon */}
              <div
                className={`w-12 h-12 ${s.bg} rounded-2xl flex items-center justify-center mb-4`}
              >
                {s.icon}
              </div>

              {/* Label */}
              <p className="text-[10px] uppercase text-gray-400 font-black tracking-widest mb-1">
                {s.label}
              </p>

              {/* Value */}
              <h3 className="text-2xl font-black text-slate-800">
                {s.value}
              </h3>
            </div>
          ))}
        </div>

        {/* ---------- ACTIVITY SECTION ---------- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-6 pb-6">

          {/* WEEKLY PROGRESS */}
          <div className="lg:col-span-2 bg-white rounded-[2rem] border border-gray-100 p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-800">Weekly Progress</h3>
              <span className="text-xs text-[#0852A1] font-bold cursor-pointer">
                View Report
              </span>
            </div>

            {/* Placeholder Chart */}
            <div className="h-48 w-full bg-gray-50 rounded-2xl border-2 border-dashed
                            border-gray-200 flex flex-col items-center justify-center text-gray-400">
              <LayoutDashboard size={32} className="mb-2 opacity-20" />
              <p className="text-sm font-medium">
                Chart data will appear here
              </p>
            </div>
          </div>

          {/* UPCOMING CLASSES */}
          <div className="bg-white rounded-[2rem] border border-gray-100 p-8">
            <h3 className="font-bold text-gray-800 mb-6">
              Upcoming Classes
            </h3>

            <div className="space-y-4">
              {/* Example class */}
              <div className="flex items-center gap-4 p-3 rounded-2xl bg-blue-50/50 border border-blue-100">
                <div className="bg-white p-2 rounded-xl text-[#0852A1] font-bold text-xs text-center min-w-[50px]">
                  10:00<br />AM
                </div>

                <div>
                  <p className="text-sm font-bold text-gray-800">
                    English Speaking
                  </p>
                  <p className="text-[10px] text-gray-500">
                    Live with Dr. Sarah
                  </p>
                </div>
              </div>

              {/* Empty note */}
              <p className="text-center text-xs text-gray-400">
                No other classes scheduled for today.
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
