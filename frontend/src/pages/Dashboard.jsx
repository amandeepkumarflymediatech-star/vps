// import { useNavigate } from "react-router-dom";

// const Dashboard = () => {
//   const navigate = useNavigate();

//   const user = {
//     name: "Amandeep",
//     email: "user@email.com",
//     progress: 72,
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">

//       {/* ===== TOP BAR ===== */}
//       <div className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
//         <h1 className="text-xl font-bold text-[#0852A1]">
//           TheEnglishRaj Dashboard
//         </h1>

//         <button
//           onClick={handleLogout}
//           className="text-sm bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
//         >
//           Logout
//         </button>
//       </div>

//       {/* ===== MAIN CONTENT ===== */}
//       <div className="p-6 max-w-7xl mx-auto">

//         {/* ===== GREETING ===== */}
//         <div className="mb-6">
//           <h2 className="text-2xl font-bold text-gray-800">
//             👋 Welcome back, {user.name}
//           </h2>
//           <p className="text-gray-500">
//             Keep improving your English skills every day
//           </p>
//         </div>

//         {/* ===== STATS CARDS ===== */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

//           <StatCard
//             title="Courses Enrolled"
//             value="3"
//             color="bg-blue-500"
//           />
//           <StatCard
//             title="Lessons Completed"
//             value="28"
//             color="bg-green-500"
//           />
//           <StatCard
//             title="Practice Hours"
//             value="14h"
//             color="bg-purple-500"
//           />
//           <StatCard
//             title="Skill Level"
//             value="Intermediate"
//             color="bg-orange-500"
//           />

//         </div>

//         {/* ===== PROGRESS ===== */}
//         <div className="bg-white rounded-xl shadow p-6 mb-8">
//           <h3 className="font-semibold text-lg mb-4">
//             📈 Learning Progress
//           </h3>

//           <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
//             <div
//               className="bg-[#0852A1] h-full transition-all"
//               style={{ width: `${user.progress}%` }}
//             />
//           </div>

//           <p className="text-sm text-gray-500 mt-2">
//             {user.progress}% completed
//           </p>
//         </div>

//         {/* ===== RECENT ACTIVITY ===== */}
//         <div className="bg-white rounded-xl shadow p-6">
//           <h3 className="font-semibold text-lg mb-4">
//             🕒 Recent Activity
//           </h3>

//           <ul className="space-y-3 text-sm text-gray-600">
//             <li>✔ Completed “Basic Grammar” lesson</li>
//             <li>✔ Practiced speaking for 20 minutes</li>
//             <li>✔ Watched “Daily Conversation” video</li>
//             <li>✔ Attempted vocabulary quiz</li>
//           </ul>
//         </div>

//       </div>
//     </div>
//   );
// };

// /* ===== REUSABLE STAT CARD ===== */
// const StatCard = ({ title, value, color }) => {
//   return (
//     <div className="bg-white rounded-xl shadow p-5">
//       <div className={`w-10 h-10 rounded-full ${color} mb-3`} />
//       <p className="text-sm text-gray-500">{title}</p>
//       <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
//     </div>
//   );
// };

// export default Dashboard;
