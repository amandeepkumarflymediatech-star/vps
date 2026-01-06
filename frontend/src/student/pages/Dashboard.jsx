import React from 'react';
import { 
  BookOpen, 
  Clock, 
  Trophy, 
  Star, 
  Calendar, 
  ArrowUpRight 
} from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { label: "Completed", value: "12", icon: <BookOpen className="text-blue-600 w-5 h-5 md:w-6 md:h-6" />, bg: "bg-blue-50" },
    { label: "Hours", value: "128h", icon: <Clock className="text-orange-600 w-5 h-5 md:w-6 md:h-6" />, bg: "bg-orange-50" },
    { label: "Points", value: "2,450", icon: <Trophy className="text-yellow-600 w-5 h-5 md:w-6 md:h-6" />, bg: "bg-yellow-50" },
    { label: "Streak", value: "8 Days", icon: <Star className="text-purple-600 w-5 h-5 md:w-6 md:h-6" />, bg: "bg-purple-50" },
  ];

  return (
    // Max-width added for ultra-wide screens
    <div className="max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8 space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Welcome Header - Optimized Flex */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            Welcome, Rahul! 👋
          </h1>
          <p className="text-sm md:text-base text-slate-500 font-medium">
            You've reached <span className="text-[#0852A1] font-bold">85%</span> of your weekly goal.
          </p>
        </div>
        <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#0852A1] text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-blue-900/10 hover:bg-blue-700 active:scale-95 transition-all text-sm md:text-base">
          <Calendar size={18} /> 
          <span>View Schedule</span>
        </button>
      </div>

      {/* Stats Grid - Fluid Layout */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className={`w-10 h-10 md:w-14 md:h-14 ${stat.bg} rounded-xl md:rounded-2xl flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
            <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-400">{stat.label}</p>
            <h3 className="text-lg md:text-2xl font-black text-slate-800 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Content Sections - 2:1 Ratio on Desktop */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-10">
        
        {/* Left: Continue Learning (Takes 2 columns) */}
        <div className="xl:col-span-2 space-y-5 md:space-y-6">
          <div className="flex justify-between items-end px-1">
            <h2 className="text-lg md:text-2xl font-bold text-slate-800">Continue Learning</h2>
            <button className="text-[#0852A1] text-xs md:text-sm font-bold hover:underline underline-offset-4">See all courses</button>
          </div>
          
          <div className="bg-white p-4 md:p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-5 md:gap-8 items-center hover:border-blue-100 transition-colors">
            <div className="w-full md:w-48 h-32 md:h-32 bg-slate-50 rounded-2xl overflow-hidden shrink-0 relative">
               <img 
                 src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=400" 
                 alt="Course" 
                 className="w-full h-full object-cover"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent md:hidden" />
            </div>
            
            <div className="flex-1 w-full space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0852A1] bg-blue-50 px-2 py-1 rounded-md">Advanced English</span>
                <span className="text-xs font-bold text-slate-400">Lesson 4/10</span>
              </div>
              <h3 className="text-base md:text-xl font-bold text-slate-800 leading-snug">Mastering Business Communications</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                  <span>Progress</span>
                  <span>65%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 md:h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#0852A1] h-full w-[65%] rounded-full shadow-[0_0_12px_rgba(8,82,161,0.3)]" />
                </div>
              </div>
            </div>

            <button className="hidden md:flex p-4 bg-slate-50 rounded-2xl text-[#0852A1] hover:bg-[#0852A1] hover:text-white transition-all shadow-sm">
              <ArrowUpRight size={24} />
            </button>
          </div>
        </div>

        {/* Right: Upcoming Classes */}
        <div className="space-y-5 md:space-y-6">
          <h2 className="text-lg md:text-2xl font-bold text-slate-800 px-1">Live Sessions</h2>
          <div className="bg-white p-5 md:p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
            {[1, 2].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group cursor-pointer">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-50 rounded-2xl flex flex-col items-center justify-center text-[#0852A1] group-hover:bg-[#0852A1] group-hover:text-white transition-colors">
                  <span className="text-[10px] font-bold">JAN</span>
                  <span className="text-lg font-black leading-none">08</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-800 truncate">IELTS Speaking Mock</h4>
                  <p className="text-xs text-slate-400 mt-0.5 font-medium">04:30 PM • Sarah M.</p>
                </div>
              </div>
            ))}
            <button className="w-full py-4 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 text-xs md:text-sm font-bold hover:border-[#0852A1] hover:text-[#0852A1] hover:bg-blue-50 transition-all mt-2">
              + Browse All Sessions
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;