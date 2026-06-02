"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle,
  XCircle,
  Calendar,
  Clock,
  User,
  TrendingUp,
  AlertCircle,
  Mail,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getStudentClassStats } from "@/api/enrollments.api";

const ITEMS_PER_PAGE = 8;

/* ─────────────────────────────────────────
   Status badge helper
───────────────────────────────────────── */
const StatusBadge = ({ status }) => {
  const map = {
    COMPLETED: {
      bg: "bg-emerald-100",
      text: "text-emerald-700",
      border: "border-emerald-200",
      dot: "bg-emerald-500",
    },
    UPCOMING: {
      bg: "bg-blue-100",
      text: "text-blue-700",
      border: "border-blue-200",
      dot: "bg-blue-500",
    },
    MISSED: {
      bg: "bg-rose-100",
      text: "text-rose-700",
      border: "border-rose-200",
      dot: "bg-rose-500",
    },
    ONGOING: {
      bg: "bg-amber-100",
      text: "text-amber-700",
      border: "border-amber-200",
      dot: "bg-amber-500",
    },
    CANCELLED: {
      bg: "bg-slate-100",
      text: "text-slate-600",
      border: "border-slate-200",
      dot: "bg-slate-400",
    },
  };
  const s = map[status] || map["UPCOMING"];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${s.bg} ${s.text} ${s.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
};

/* ─────────────────────────────────────────
   Stat Card
───────────────────────────────────────── */
const StatCard = ({ icon, label, value, gradient, iconBg, iconColor, subtitle }) => (
  <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300 group">
    <div className="flex items-start justify-between mb-4">
      <div
        className={`p-3 rounded-xl ${iconBg} ${iconColor} group-hover:scale-110 transition-transform duration-300`}
      >
        {icon}
      </div>
      <div
        className={`w-2 h-10 rounded-full bg-gradient-to-b ${gradient} opacity-60`}
      />
    </div>
    <p className="text-xs uppercase text-slate-500 font-bold tracking-wider mb-1">
      {label}
    </p>
    <h3 className="text-4xl font-black text-slate-900">{value}</h3>
    {subtitle && (
      <p className="text-xs text-slate-400 mt-1 font-medium">{subtitle}</p>
    )}
  </div>
);

/* ─────────────────────────────────────────
   Pagination Controls
───────────────────────────────────────── */
const Pagination = ({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }) => {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Build page numbers with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="px-6 py-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Info */}
      <p className="text-sm text-slate-500 font-medium">
        Showing{" "}
        <span className="font-bold text-slate-700">{startItem}–{endItem}</span>{" "}
        of{" "}
        <span className="font-bold text-slate-700">{totalItems}</span> sessions
      </p>

      {/* Controls */}
      <div className="flex items-center gap-1">
        {/* Prev */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft size={16} />
          <span className="hidden sm:inline">Prev</span>
        </button>

        {/* Page numbers */}
        {getPageNumbers().map((page, i) =>
          page === "..." ? (
            <span
              key={`ellipsis-${i}`}
              className="px-3 py-2 text-sm text-slate-400 font-bold select-none"
            >
              …
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${
                page === currentPage
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {page}
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   Main Page
───────────────────────────────────────── */
export default function StudentClassDetail() {
  const params = useParams();
  const router = useRouter();
  const studentId = params?.studentId;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!studentId) return;

    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await getStudentClassStats(studentId);
        if (res?.data?.success) {
          setData(res.data.data);
        } else {
          setError("Failed to load student data.");
        }
      } catch (err) {
        console.error("StudentClassDetail fetch error:", err);
        setError("Could not load student details.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [studentId]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll table into view smoothly
    document
      .getElementById("session-history-table")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-blue-200 border-t-blue-600" />
          <p className="text-slate-500 font-medium">Loading student details…</p>
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-10 shadow-lg text-center max-w-sm w-full">
          <AlertCircle size={48} className="text-rose-400 mx-auto mb-4" />
          <h2 className="text-xl font-black text-slate-900 mb-2">Oops!</h2>
          <p className="text-slate-500 mb-6">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const { student, stats, enrollments = [] } = data || {};
  const {
    totalClasses = 0,
    completedClasses = 0,
    missedClasses = 0,
    upcomingClasses = 0,
  } = stats || {};

  // Pagination calculations
  const totalPages = Math.ceil(enrollments.length / ITEMS_PER_PAGE);
  const paginatedEnrollments = enrollments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Completion % = completed ÷ total package classes (or total enrolled sessions as fallback, naturally capped 0–100%)
  const totalEnrolled = enrollments.length;
  const completionPct =
    totalClasses > 0
      ? Math.min(100, Math.round((completedClasses / totalClasses) * 100))
      : totalEnrolled > 0
      ? Math.min(100, Math.round((completedClasses / totalEnrolled) * 100))
      : 0;

  const statCards = [
    {
      icon: <BookOpen size={22} />,
      label: "Total Classes",
      value: totalClasses,
      gradient: "from-blue-400 to-blue-600",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      subtitle: "Classes assigned in package",
    },
    {
      icon: <CheckCircle size={22} />,
      label: "Completed",
      value: completedClasses,
      gradient: "from-emerald-400 to-emerald-600",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      subtitle: `${completionPct}% completion rate`,
    },
    {
      icon: <XCircle size={22} />,
      label: "Missed",
      value: missedClasses,
      gradient: "from-rose-400 to-rose-600",
      iconBg: "bg-rose-100",
      iconColor: "text-rose-600",
      subtitle: "No-shows or unattended",
    },
    {
      icon: <Calendar size={22} />,
      label: "Upcoming",
      value: upcomingClasses,
      gradient: "from-purple-400 to-purple-600",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      subtitle: "Scheduled sessions",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 pt-2 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* ── Back Button ── */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-semibold transition-colors group"
        >
          <ArrowLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Dashboard
        </button>

        {/* ── Student Header Card ── */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-4xl font-black shadow-lg flex-shrink-0">
              {student?.name?.charAt(0)?.toUpperCase() || "S"}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-black mb-1">
                {student?.name || "Student"}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-blue-100">
                {student?.email && (
                  <span className="flex items-center gap-1.5 text-sm font-medium">
                    <Mail size={14} />
                    {student.email}
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-sm font-medium">
                  <User size={14} />
                  Student
                </span>
              </div>
            </div>

            {/* Quick Completion */}
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 text-center min-w-[120px]">
              <p className="text-4xl font-black">{completionPct}%</p>
              <p className="text-blue-100 text-xs font-bold uppercase tracking-wider mt-1">
                Completion
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm font-semibold text-blue-100 mb-2">
              <span>Progress</span>
              <span>
                {completedClasses} / {totalClasses} classes
              </span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div
                className="bg-white h-3 rounded-full transition-all duration-700"
                style={{ width: `${completionPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* ── Stats Cards Grid ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {statCards.map((card, i) => (
            <StatCard key={i} {...card} />
          ))}
        </div>

        {/* ── Session History Table ── */}
        <div
          id="session-history-table"
          className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden"
        >
          {/* Table Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <TrendingUp size={20} className="text-blue-600" />
              Session History
            </h2>
            <span className="text-sm text-slate-500 font-semibold bg-slate-100 px-3 py-1 rounded-full">
              {enrollments.length} sessions
            </span>
          </div>

          {/* Table Body */}
          {enrollments.length > 0 ? (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        #
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Time
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Meeting
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {paginatedEnrollments.map((en, idx) => {
                      const globalIdx = (currentPage - 1) * ITEMS_PER_PAGE + idx;
                      const date = en.slot?.date
                        ? new Date(en.slot.date).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—";
                      return (
                        <tr
                          key={en._id || idx}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm text-slate-400 font-bold">
                            {globalIdx + 1}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
                              <Calendar size={14} className="text-blue-500" />
                              {date}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
                              <Clock size={14} className="text-purple-500" />
                              {en.slot?.startTime} — {en.slot?.endTime}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge
                              status={en.computedStatus || en.status}
                            />
                          </td>
                          <td className="px-6 py-4">
                            {en.meetingLink ? (
                              <a
                                href={en.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 font-semibold text-sm hover:underline"
                              >
                                Join →
                              </a>
                            ) : (
                              <span className="text-slate-300 text-sm">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-slate-100">
                {paginatedEnrollments.map((en, idx) => {
                  const globalIdx = (currentPage - 1) * ITEMS_PER_PAGE + idx;
                  const date = en.slot?.date
                    ? new Date(en.slot.date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "—";
                  return (
                    <div key={en._id || idx} className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400 font-bold">
                          Session {globalIdx + 1}
                        </span>
                        <StatusBadge status={en.computedStatus || en.status} />
                      </div>
                      <div className="flex items-center gap-2 text-slate-700 text-sm font-semibold">
                        <Calendar size={14} className="text-blue-500" />
                        {date}
                      </div>
                      <div className="flex items-center gap-2 text-slate-600 text-sm">
                        <Clock size={14} className="text-purple-500" />
                        {en.slot?.startTime} — {en.slot?.endTime}
                      </div>
                      {en.meetingLink && (
                        <a
                          href={en.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 font-semibold text-sm hover:underline"
                        >
                          Join Meeting →
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* ── Pagination ── */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={enrollments.length}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            /* Empty State */
            <div className="py-20 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen size={36} className="text-slate-300" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">
                No sessions yet
              </h3>
              <p className="text-slate-500 text-sm">
                This student has no scheduled sessions with you.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
