

"use client";

import { useEffect, useState, useMemo } from "react";
import { getEnrollments, updateMeetingLink } from "@/api/enrollments.api";
import toast from "react-hot-toast";
import {
  Calendar,
  Clock,
  Video,
  Edit2,
  Search,
  User,
  Link as LinkIcon,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

// Standardized Status Options
const STATUS_OPTIONS = ["UPCOMING", "COMPLETED", "CANCELLED", "MISSED"];

const Enrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [meetingLink, setMeetingLink] = useState("");
  const [status, setStatus] = useState("UPCOMING");
  const [searchQuery, setSearchQuery] = useState("");

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user"))
      : null;
  /* =========================
     FETCH DATA
  ========================= */
  useEffect(() => {
    if (!user?.id) return;
    const fetchEnrollments = async () => {
      try {
        setLoading(true);
        const res = await getEnrollments({ tutorId: user.id });
        setEnrollments(res?.data?.data || []);
      } catch {
        toast.error("Failed to load enrollments");
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, [user?.id]);

  /* =========================
     FILTER
  ========================= */

  const filteredEnrollments = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return enrollments.filter(
      (e) =>
        e.student?.name?.toLowerCase().includes(q) ||
        e.package?.title?.toLowerCase().includes(q),
    );
  }, [enrollments, searchQuery]);

  const handleSave = async (id) => {
    if (!meetingLink.trim()) {
      toast.error("Meeting link is required");
      return;
    }
    try {
      await updateMeetingLink(id, { meetingLink, status });
      setEnrollments((prev) =>
        prev.map((e) =>
          e._id === id
            ? { ...e, meetingLink, status: status.toUpperCase() }
            : e,
        ),
      );
      toast.success("Class updated successfully");
      setEditingId(null);
    } catch {
      toast.error("Update failed");
    }
  };

  const getStatusBadge = (s) => {
    const statusKey = s?.toUpperCase();
    const styles = {
      UPCOMING: "bg-blue-100 text-blue-700 border-blue-200",
      COMPLETED: "bg-emerald-100 text-emerald-700 border-emerald-200",
      CANCELLED: "bg-rose-100 text-rose-700 border-rose-200",
      MISSED: "bg-amber-100 text-amber-700 border-amber-200",
    };
    return `px-2.5 py-1 rounded-md text-[10px] font-black tracking-wider border ${styles[statusKey] || styles.UPCOMING}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-white">
        <div className="animate-spin h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    // <div className="min-h-screen bg-gray-50/50 p-4 md:p-10 font-sans">
    //   <div className="max-w-7xl mx-auto space-y-6">
    //     {/* HEADER */}
    //     <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
    //       <div>
    //         <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
    //           Class Schedule
    //         </h1>
    //         <p className="text-gray-500 text-sm">
    //           Update links and session completion status
    //         </p>
    //       </div>

    //       <div className="relative group w-full md:w-80">
    //         <Search
    //           className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
    //           size={18}
    //         />
    //         <input
    //           value={searchQuery}
    //           onChange={(e) => setSearchQuery(e.target.value)}
    //           placeholder="Search students..."
    //           className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm"
    //         />
    //       </div>
    //     </div>




    //     {/* DATA CONTAINER */}
    //     <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
    //       <div className="hidden md:block overflow-x-auto">
    //         <table className="w-full text-left">
    //           <thead>
    //             <tr className="bg-gray-50 border-b border-gray-200 text-black text-[14px] font-bold uppercase  ">
    //               <th className="px-8 py-4">Student </th>
    //               <th className="px-6 py-4">Course</th>
    //               <th className="px-6 py-4">Schedule</th>
    //               <th className="px-6 py-4">Time</th>
    //               <th className="px-6 py-4">Meeting Link</th>
    //               <th className="px-6 py-4 text-center">Current Status</th>
    //               <th className="px-8 py-4 text-right">Action</th>
    //             </tr>
    //           </thead>
    //           <tbody className="divide-y divide-gray-100">
    //             {filteredEnrollments.map((e) => (
    //               <tr
    //                 key={e._id}
    //                 className="hover:bg-gray-50/50 transition-colors"
    //               >
    //                 <td className="px-8 py-5">
    //                   <div className="flex items-center gap-4">
    //                     <div className="h-10 w-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-indigo-100 group-hover:text-indigo-600">
    //                       <User size={20} />
    //                     </div>
    //                     <div>
    //                       <p className="font-bold text-gray-900">
    //                         {e.student?.name}
    //                       </p>
    //                       <p className="text-xs text-indigo-600 font-medium">
    //                         {e.package?.title}
    //                       </p>
    //                     </div>
    //                   </div>
    //                 </td>
    //                 <td className="px-6 py-5">
    //                   <div className="text-sm space-y-1">
    //                     <div className="flex items-center gap-2 font-bold text-black">
    //                       <Calendar size={14} className="text-black" />
    //                       {new Date(e.slot?.date).toLocaleDateString()}
    //                     </div>
    //                     <div className="flex items-center gap-2 text-indigo-600 text-xs">
    //                       <Clock size={14} />
    //                       {e.slot?.startTime} - {e.slot?.endTime}
    //                     </div>
    //                   </div>
    //                 </td>
    //                 <td className="px-6 py-5">
    //                   {editingId === e._id ? (
    //                     <div className="flex flex-col gap-1">
    //                       <label className="text-[10px] font-bold text-indigo-600 uppercase">
    //                         Meeting Link
    //                       </label>
    //                       <input
    //                         autoFocus
    //                         value={meetingLink}
    //                         onChange={(ev) => setMeetingLink(ev.target.value)}
    //                         className="w-64 bg-white border-2 border-indigo-500 rounded-lg px-3 py-2 text-sm outline-none shadow-indigo-100 shadow-lg"
    //                         placeholder="Paste Link Here..."
    //                       />
    //                     </div>
    //                   ) : e.meetingLink ? (
    //                     <a
    //                       href={e.meetingLink}
    //                       target="_blank"
    //                       className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
    //                     >
    //                       <Video size={14} /> JOIN SESSION
    //                     </a>
    //                   ) : (
    //                     <span className="flex items-center gap-2 text-gray-300 text-xs italic font-medium">
    //                       <AlertCircle size={14} /> Link missing
    //                     </span>
    //                   )}
    //                 </td>
    //                 <td className="px-6 py-5 text-center">
    //                   {editingId === e._id ? (
    //                     <div className="flex flex-col gap-1 items-center">
    //                       <label className="text-[10px] font-bold text-indigo-600 uppercase">
    //                         Set Status
    //                       </label>
    //                       <select
    //                         value={status}
    //                         onChange={(ev) => setStatus(ev.target.value)}
    //                         className="bg-white border-2 border-indigo-500 rounded-lg px-2 py-2 text-xs font-bold outline-none"
    //                       >
    //                         {STATUS_OPTIONS.map((opt) => (
    //                           <option key={opt} value={opt}>
    //                             {opt}
    //                           </option>
    //                         ))}
    //                       </select>
    //                     </div>
    //                   ) : (
    //                     <span className={getStatusBadge(e.status)}>
    //                       {e.status?.toUpperCase()}
    //                     </span>
    //                   )}
    //                 </td>
    //                 <td className="px-8 py-5 text-right">
    //                   {editingId === e._id ? (
    //                     <button
    //                       onClick={() => handleSave(e._id)}
    //                       className="bg-gray-900 text-white px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg"
    //                     >
    //                       Save
    //                     </button>
    //                   ) : (
    //                     <button
    //                       onClick={() => {
    //                         setEditingId(e._id);
    //                         setMeetingLink(e.meetingLink || "");
    //                         setStatus(e.status?.toUpperCase() || "UPCOMING");
    //                       }}
    //                       className="p-2.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
    //                     >
    //                       <Edit2 size={18} />
    //                     </button>
    //                   )}
    //                 </td>
    //               </tr>
    //             ))}
    //           </tbody>
    //         </table>
    //       </div>

    //       {/* MOBILE LIST */}
    //       <div className="md:hidden divide-y divide-gray-100">
    //         {filteredEnrollments.map((e) => (
    //           <div key={e._id} className="p-5 space-y-4">
    //             <div className="flex justify-between items-start">
    //               <div className="flex items-center gap-3">
    //                 <div className="h-10 w-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
    //                   <User size={20} />
    //                 </div>
    //                 <div>
    //                   <p className="font-bold text-gray-900 leading-none">
    //                     {e.student?.name}
    //                   </p>
    //                   <p className="text-[11px] text-gray-400 mt-1 uppercase font-bold tracking-tight">
    //                     {e.package?.title}
    //                   </p>
    //                 </div>
    //               </div>
    //               <span className={getStatusBadge(e.status)}>
    //                 {e.status?.toUpperCase()}
    //               </span>
    //             </div>

    //             <div className="flex gap-4 border-y border-gray-50 py-3">
    //               <div className="text-xs">
    //                 <p className="text-gray-400 font-bold uppercase text-[9px]">
    //                   Date
    //                 </p>
    //                 <p className="font-bold text-gray-700">
    //                   {new Date(e.slot?.date).toLocaleDateString()}
    //                 </p>
    //               </div>
    //               <div className="text-xs">
    //                 <p className="text-gray-400 font-bold uppercase text-[9px]">
    //                   Time
    //                 </p>
    //                 <p className="font-bold text-gray-700">
    //                   {e.slot?.startTime}
    //                 </p>
    //               </div>
    //             </div>

    //             {editingId === e._id ? (
    //               <div className="space-y-3 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
    //                 <div>
    //                   <label className="text-[10px] font-black text-indigo-600 uppercase">
    //                     Meeting Link
    //                   </label>
    //                   <input
    //                     value={meetingLink}
    //                     onChange={(ev) => setMeetingLink(ev.target.value)}
    //                     className="w-full mt-1 p-3 bg-white rounded-xl border-2 border-indigo-400 outline-none text-sm"
    //                     placeholder="Paste Zoom/Meet Link"
    //                   />
    //                 </div>
    //                 <div>
    //                   <label className="text-[10px] font-black text-indigo-600 uppercase">
    //                     Change Status
    //                   </label>
    //                   <select
    //                     value={status}
    //                     onChange={(ev) => setStatus(ev.target.value)}
    //                     className="w-full mt-1 p-3 bg-white rounded-xl border-2 border-indigo-400 outline-none text-sm font-bold"
    //                   >
    //                     {STATUS_OPTIONS.map((opt) => (
    //                       <option key={opt} value={opt}>
    //                         {opt}
    //                       </option>
    //                     ))}
    //                   </select>
    //                 </div>
    //                 <button
    //                   onClick={() => handleSave(e._id)}
    //                   className="w-full py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-200"
    //                 >
    //                   Update Class
    //                 </button>
    //               </div>
    //             ) : (
    //               <div className="flex gap-2">
    //                 <a
    //                   href={e.meetingLink}
    //                   className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${e.meetingLink ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "bg-gray-100 text-gray-300 pointer-events-none"}`}
    //                 >
    //                   <Video size={16} /> Join Class
    //                 </a>
    //                 <button
    //                   onClick={() => {
    //                     setEditingId(e._id);
    //                     setMeetingLink(e.meetingLink || "");
    //                     setStatus(e.status?.toUpperCase() || "UPCOMING");
    //                   }}
    //                   className="px-4 bg-gray-100 text-gray-600 rounded-xl"
    //                 >
    //                   <Edit2 size={18} />
    //                 </button>
    //               </div>
    //             )}
    //           </div>
    //         ))}
    //       </div>
    //     </div>
    //   </div>
    // </div>

    <div className="min-h-screen bg-gray-50/50 px-3 sm:px-4 md:px-8 lg:px-10 font-sans overflow-x-hidden">
  <div className="max-w-7xl mx-auto space-y-6 w-full">

    {/* HEADER */}
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-gray-900 uppercase tracking-tight">
          Class Schedule
        </h1>
        <p className="text-gray-500 text-xs sm:text-sm">
          Update links and session completion status
        </p>
      </div>

      <div className="relative group w-full sm:w-72 md:w-80">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search students..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm text-sm"
        />
      </div>
    </div>

    {/* DATA CONTAINER */}
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">

      {/* DESKTOP TABLE */}
      <div className="hidden lg:block w-full overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-black text-[14px] font-bold uppercase">
              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4">Course</th>
              <th className="px-6 py-4">Schedule</th>
              <th className="px-6 py-4">Time</th>
              <th className="px-6 py-4">Meeting Link</th>
              <th className="px-6 py-4 text-center">Current Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {filteredEnrollments.map((e) => (
              <tr key={e._id} className="hover:bg-gray-50/50 transition-colors">

                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{e.student?.name}</p>
                      <p className="text-xs text-indigo-600 font-medium">
                        {e.package?.title}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-5 text-sm font-medium text-gray-700">
                  {e.course?.title || "-"}
                </td>

                <td className="px-6 py-5 text-sm font-bold">
                  {new Date(e.slot?.date).toLocaleDateString()}
                </td>

                <td className="px-6 py-5 text-sm font-bold text-indigo-600">
                  {e.slot?.startTime} - {e.slot?.endTime}
                </td>

                <td className="px-6 py-5">
                  {editingId === e._id ? (
                    <input
                      autoFocus
                      value={meetingLink}
                      onChange={(ev) => setMeetingLink(ev.target.value)}
                      className="w-full max-w-xs bg-white border-2 border-indigo-500 rounded-lg px-3 py-2 text-sm outline-none"
                      placeholder="Paste Link..."
                    />
                  ) : e.meetingLink ? (
                    <a
                      href={e.meetingLink}
                      target="_blank"
                      className="inline-flex items-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all"
                    >
                      <Video size={14} /> JOIN SESSION
                    </a>
                  ) : (
                    <span className="text-gray-300 text-xs italic">
                      Link missing
                    </span>
                  )}
                </td>

                <td className="px-6 py-5 text-center">
                  {editingId === e._id ? (
                    <select
                      value={status}
                      onChange={(ev) => setStatus(ev.target.value)}
                      className="bg-white border-2 border-indigo-500 rounded-lg px-2 py-2 text-xs font-bold outline-none"
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className={getStatusBadge(e.status)}>
                      {e.status?.toUpperCase()}
                    </span>
                  )}
                </td>

                <td className="px-6 py-5 text-right">
                  {editingId === e._id ? (
                    <button
                      onClick={() => handleSave(e._id)}
                      className="bg-gray-900 text-white px-4 py-2 rounded-xl text-xs font-black uppercase hover:bg-indigo-600 transition-all"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingId(e._id);
                        setMeetingLink(e.meetingLink || "");
                        setStatus(e.status?.toUpperCase() || "UPCOMING");
                      }}
                      className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                    >
                      <Edit2 size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE + TABLET GRID CARDS */}
      <div className="block lg:hidden p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredEnrollments.map((e) => (
            <div key={e._id} className="p-4 bg-white rounded-2xl border shadow-sm space-y-3">

              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                    <User size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">
                      {e.student?.name}
                    </p>
                    <p className="text-[11px] text-gray-400 font-semibold">
                      {e.package?.title}
                    </p>
                  </div>
                </div>
                <span className={getStatusBadge(e.status)}>
                  {e.status?.toUpperCase()}
                </span>
              </div>

              <div className="flex justify-between text-xs font-semibold text-gray-600">
                <span>{new Date(e.slot?.date).toLocaleDateString()}</span>
                <span>{e.slot?.startTime}</span>
              </div>

              {editingId === e._id ? (
                <div className="space-y-2">
                  <input
                    value={meetingLink}
                    onChange={(ev) => setMeetingLink(ev.target.value)}
                    className="w-full p-2 border-2 border-indigo-400 rounded-xl text-sm outline-none"
                    placeholder="Meeting link..."
                  />
                  <select
                    value={status}
                    onChange={(ev) => setStatus(ev.target.value)}
                    className="w-full p-2 border-2 border-indigo-400 rounded-xl text-sm font-bold outline-none"
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleSave(e._id)}
                    className="w-full py-2 bg-indigo-600 text-white rounded-xl font-bold text-xs uppercase"
                  >
                    Update
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <a
                    href={e.meetingLink}
                    className={`flex-1 text-center py-2 rounded-xl text-xs font-bold ${
                      e.meetingLink
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-300 pointer-events-none"
                    }`}
                  >
                    Join
                  </a>
                  <button
                    onClick={() => {
                      setEditingId(e._id);
                      setMeetingLink(e.meetingLink || "");
                      setStatus(e.status?.toUpperCase() || "UPCOMING");
                    }}
                    className="px-3 bg-gray-100 rounded-xl text-gray-600"
                  >
                    <Edit2 size={16} />
                  </button>
                </div>
              )}

            </div>
          ))}
        </div>
      </div>

    </div>
  </div>
</div>


  );
};

export default Enrollments;
