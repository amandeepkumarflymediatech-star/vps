import { useState, useEffect } from "react";
import Sidebar from "../components/layout/Sidebar";
// import Footer from "../components/layout/Footer"; // Add back if needed
import {
  BookOpen,
  Clock,
  Trophy,
  Star,
  Layout
} from "lucide-react";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // 1. DYNAMIC USER DATA
  const user = JSON.parse(localStorage.getItem("user")) || {};
  
  // 2. DYNAMIC STATS STATE (Initialize with 0 or null)
  const [userStats, setUserStats] = useState({
    completedCourses: "0",
    learningHours: "0h",
    points: "0",
    streak: "0 Days",
    weeklyProgress: 0
  });

  // 3. FETCH DATA (Simulated API call)
  useEffect(() => {
    // In a real app: const data = await api.getDashboardStats(user.id);
    // For now, setting some dynamic-looking data
    const timer = setTimeout(() => {
      setUserStats({
        completedCourses: "12",
        learningHours: "128h",
        points: "2,450",
        streak: "8 Days",
        weeklyProgress: 85
      });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const statsConfig = [
    { label: "Completed", value: userStats.completedCourses, icon: <BookOpen />, bg: "bg-blue-50 text-blue-600" },
    { label: "Hours", value: userStats.learningHours, icon: <Clock />, bg: "bg-orange-50 text-orange-600" },
    { label: "Points", value: userStats.points, icon: <Trophy />, bg: "bg-yellow-50 text-yellow-600" },
    { label: "Streak", value: userStats.streak, icon: <Star />, bg: "bg-purple-50 text-purple-600" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex w-full">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col min-h-screen">
        {/* Pass sidebar controls to Header */}


        <main className="p-4 md:p-8 space-y-8 flex-1">
          {/* Welcome Section */}
          <div className="animate-in fade-in slide-in-from-left duration-700">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              {/* REAL-TIME NAME */}
              Welcome, {user?.name?.split(' ')[0] || "Student"} 👋
            </h1>
            <p className="text-slate-500 mt-1 font-medium">
              You've reached <b className="text-[#0852A1] font-black">{userStats.weeklyProgress}%</b> of your weekly goal. Keep it up!
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {statsConfig.map((s, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all group active:scale-95"
              >
                <div className={`w-12 h-12 ${s.bg} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  {s.icon}
                </div>
                <p className="text-[10px] uppercase text-gray-400 font-black tracking-widest mb-1">
                  {s.label}
                </p>
                <h3 className="text-2xl font-black text-slate-800">
                  {s.value}
                </h3>
              </div>
            ))}
          </div>

          {/* Activity Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             <div className="lg:col-span-2 bg-white min-h-[300px] rounded-[2rem] border border-gray-100 shadow-sm p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-gray-800">Weekly Progress</h3>
                  <span className="text-xs text-[#0852A1] font-bold cursor-pointer">View Report</span>
                </div>
                {/* Placeholder for real chart */}
                <div className="h-48 w-full bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
                   <Layout size={32} className="mb-2 opacity-20" />
                   <p className="text-sm font-medium">Chart data will appear here</p>
                </div>
             </div>

             <div className="bg-white min-h-[300px] rounded-[2rem] border border-gray-100 shadow-sm p-8">
                <h3 className="font-bold text-gray-800 mb-6">Upcoming Classes</h3>
                <div className="space-y-4">
                  {/* Map through dynamic classes here */}
                  <div className="flex items-center gap-4 p-3 rounded-2xl bg-blue-50/50 border border-blue-100">
                    <div className="bg-white p-2 rounded-xl text-[#0852A1] font-bold text-xs text-center min-w-[50px]">
                      10:00<br/>AM
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">English Speaking</p>
                      <p className="text-[10px] text-gray-500">Live with Dr. Sarah</p>
                    </div>
                  </div>
                  
                  <p className="text-center text-xs text-gray-400 mt-4">No other classes scheduled for today.</p>
                </div>
             </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;