"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import {
  Mail,
  Star as StarIcon,
  BookOpen,
  Clock,
  Award,
  ShieldCheck,
  Calendar,
  ArrowLeft,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { getTutorById } from "@/api/tutorApi";
import { getStudentClasses, checkPaymentStatus, saveSelectedSlot } from "@/api/student.api";
import { getAvailabilityByTutorId } from "@/api/tutorAvailability.api";
import { addReview, getTutorReviews } from "@/api/review.api";
import BookSession from "./myClass";
import Rating from "@/components/Rating";
import Swal from "sweetalert2";

// Helper: build next 7 days (today + 6)
const buildDates = () => {
  const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const result = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    result.push({
      dateObj: d,
      day: names[d.getDay()],
      date: d.getDate(),
    });
  }

  return result;
};

// Helper: check if a calendar date is within class start/end
const isDateInClassRange = (cls, d) => {
  if (!cls.startDate || !cls.endDate) return true;
  const start = new Date(cls.startDate);
  const end = new Date(cls.endDate);
  const dayOnly = new Date(d);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  dayOnly.setHours(0, 0, 0, 0);
  return dayOnly >= start && dayOnly <= end;
};

// Helper: HH:MM (24h) -> h:MM AM/PM
const formatTime = (time24) => {
  if (!time24) return "";
  const [hStr, mStr] = time24.split(":");
  let h = parseInt(hStr || "0", 10);
  const m = mStr || "00";
  const suffix = h >= 12 ? "PM" : "AM";
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${m} ${suffix}`;
};

const TutorDetailsView = ({ id: propId }) => {
  const params = useParams();
  const routeId = params?.id;
  const id = propId || routeId;

  const [tutor, setTutor] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("about");
  const [activeDateIndex, setActiveDateIndex] = useState(0);
  const [selectedSlotKey, setSelectedSlotKey] = useState(null);
  const [tutorAvailability, setTutorAvailability] = useState(null);

  // Review states
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [user, setUser] = useState(null);

  const dates = useMemo(buildDates, []);

  const fetchAvailability = async () => {
    try {
      const today = new Date();
      const weekStartDate = new Date(Date.UTC(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      )).toISOString().split("T")[0];

      const res = await getAvailabilityByTutorId(id, weekStartDate);
      if (res.data?.data) {
        setTutorAvailability(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load tutor availability:", err);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userRaw = localStorage.getItem("user");
      if (userRaw) setUser(JSON.parse(userRaw));
    }
  }, []);

  useEffect(() => {
    if (!id) return;

    const fetchTutor = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getTutorById(id);
        const t = res.data?.data;
        if (!t) {
          setTutor(null);
        } else {
          // Try to compute next availability from upcoming classes for this tutor
          let nextAvailability = t.availability || "Today";
          try {
            const classesRes = await getStudentClasses({ tutorId: t._id });
            const cls = classesRes.data?.data || classesRes.data || [];
            setClasses(Array.isArray(cls) ? cls : []);

            if (Array.isArray(cls) && cls.length > 0) {
              // pick earliest class by startDate, then earliest slot within that class
              const sortedClasses = [...cls].sort(
                (a, b) => new Date(a.startDate) - new Date(b.startDate),
              );
              const firstClass = sortedClasses[0];
              const schedule = Array.isArray(firstClass.schedule)
                ? firstClass.schedule
                : [];

              if (schedule.length > 0) {
                const sortedSlots = [...schedule].sort((a, b) => {
                  const ta = a.startTime || "";
                  const tb = b.startTime || "";
                  return ta.localeCompare(tb);
                });
                const slot = sortedSlots.length <= 1 ? [] : sortedSlots[0];

                const dayPart = slot.day || "";
                const timePart =
                  slot.startTime && slot.endTime
                    ? `${slot.startTime} - ${slot.endTime}`
                    : "";
                const datePart = firstClass.startDate
                  ? new Date(firstClass.startDate).toLocaleDateString()
                  : "";

                const pieces = [dayPart, timePart, datePart].filter(Boolean);
                if (pieces.length) {
                  nextAvailability = pieces.join(", ");
                } else {
                  nextAvailability = "Upcoming slot";
                }
              }
            }
          } catch (e) {
            console.error("Failed to load tutor classes for availability", e);
          }

          // Map API tutor to view model, prefer backend values and fall back to placeholders
          setTutor({
            id: t._id,
            name: t.name,
            avatar: t.avatar,
            subject: t.expertise || "Spoken English & Communication",
            rating: typeof t.rating === "number" && t.rating > 0 ? t.rating.toFixed(1) : "5.0",
            reviews: t.reviewsCount || 0,
            enrollments: t.enrollmentCount || 0,
            experience: t.experience || "5+ Years",
            bio: t.description || "Passionate English tutor focused on helping students gain real-world speaking confidence.",
            email: t.email,
            education: t.education || "Certified English Trainer",
            specialties:
              Array.isArray(t.specialties) && t.specialties.length > 0
                ? t.specialties
                : [t.expertise],
            availability: nextAvailability,
            responseTime: t.responseTime || "< 2 hours",
            verified: !!t.isVerified,
            status: t.status || "INACTIVE",
            joinedDate: t.createdAt
              ? new Date(t.createdAt).toLocaleDateString()
              : null,
            joinedYear: t.createdAt
              ? new Date(t.createdAt).getFullYear()
              : "--",
          });
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load tutor details");
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await getTutorReviews(id);
        if (res.data?.success) {
          setReviews(res.data.data);
        }
      } catch (err) {
        console.error("Failed to load reviews:", err);
      }
    };

    console.log("Fetching data for tutor ID:", id);

    fetchTutor();
    fetchAvailability();
    fetchReviews();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newRating) {
      Swal.fire("Error", "Please select a rating", "error");
      return;
    }

    try {
      setSubmittingReview(true);
      const res = await addReview({
        tutorId: id,
        rating: newRating,
        comment: newComment,
      });

      if (res.data?.success) {
        Swal.fire("Success", "Review submitted successfully!", "success");
        setNewComment("");
        setNewRating(5);
        // Refresh reviews
        const reviewsRes = await getTutorReviews(id);
        if (reviewsRes.data?.success) {
          setReviews(reviewsRes.data.data);
        }
        // Refresh tutor score
        const tutorRes = await getTutorById(id);
        if (tutorRes.data?.data) {
          const t = tutorRes.data.data;
          setTutor(prev => ({
            ...prev,
            rating: typeof t.rating === "number" && t.rating > 0 ? t.rating.toFixed(1) : "5.0",
            reviews: t.reviewsCount || 0,
          }));
        }
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.response?.data?.message || "Failed to submit review", "error");
    } finally {
      setSubmittingReview(false);
    }
  };

  const todayStr = new Date().toISOString().slice(0, 10);
  const now = new Date();
  const currentHHMM = `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes(),
  ).padStart(2, "0")}`;

  // Slots for selected date - now using tutor availability array from backend
  const slotsForSelectedDay = useMemo(() => {
    if (!dates[activeDateIndex] || !tutorAvailability || !Array.isArray(tutorAvailability)) return [];

    const d = dates[activeDateIndex].dateObj;
    const dateStr = d.toISOString().slice(0, 10);
    // Find the availability document for this specific date
    const dayDoc = tutorAvailability.find((doc) => {
      const docDate = new Date(doc.date).toISOString().slice(0, 10);
      return docDate === dateStr;
    });

    if (!dayDoc || !dayDoc.availability) return [];

    const items = [];
    const isToday = dateStr === todayStr;

    // Get only available slots from the day's availability array
    dayDoc.availability.forEach((slot) => {
      if (!slot.isAvailable || slot.isBooked) return; // Skip unavailable or booked slots
      const key = `${dateStr}-${slot.startTime}`;
      const isPastToday = isToday && slot.endTime <= currentHHMM;

      items.push({
        _id: slot._id,
        key,
        startTime: slot.startTime, // 24h format
        endTime: slot.endTime,     // 24h format
        label: `${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`,
        isPast: isPastToday,
      });
    });

    // Sort by start time
    return items.sort((a, b) => a.label.localeCompare(b.label));
  }, [activeDateIndex, tutorAvailability, dates, currentHHMM, todayStr]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-500 text-sm font-medium">
        {error}
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="text-center py-20 text-gray-500">Tutor not found</div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5FF] pt-15 md:pt-4 pb-10">
      {/* Top gradient banner */}
      <div className="bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 text-white py-6 md:py-8 px-4 md:px-12">
        <div className="max-w-6xl mx-auto">
          {/* Tutor avatar + name */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-6">
            <div className="relative flex-shrink-0">
              {tutor.avatar ? (
                <img
                  src={
                    tutor.avatar.startsWith("http")
                      ? tutor.avatar
                      : `http://localhost:8000/${tutor.avatar}`
                  }
                  alt={tutor.name}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-white/20"
                />
              ) : (
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/20 flex items-center justify-center text-3xl md:text-4xl font-bold border-4 border-white/20">
                  {tutor.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-2xl md:text-3xl font-bold mb-1">
                {tutor.name}
              </h1>
              <p className="text-sm md:text-base opacity-80">{tutor.subject}</p>
            </div>
          </div>

          {/* Stats cards */}
          <div className="flex flex-wrap justify-center sm:justify-start gap-3 md:gap-4 mb-6">
            <div className="bg-white text-indigo-700 rounded-2xl px-4 py-2 md:px-6 md:py-3 text-center text-sm shadow-lg min-w-[120px] md:min-w-[130px]">
              <div className="text-xl md:text-2xl font-bold">
                {tutor.joinedYear}
              </div>
              <div className="opacity-70 text-xs md:text-sm">Tutor since</div>
            </div>
            <div className="bg-white text-indigo-700 rounded-2xl px-4 py-2 md:px-6 md:py-3 text-center text-sm shadow-lg min-w-[120px] md:min-w-[130px]">
              <div className="text-xl md:text-2xl font-bold">
                {tutor.enrollments}
              </div>
              <div className="opacity-70 text-xs md:text-sm">Session taken</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/20 text-sm overflow-x-auto">
            <button
              onClick={() => setActiveTab("about")}
              className={`px-4 md:px-6 pb-2 transition whitespace-nowrap ${activeTab === "about"
                ? "font-semibold border-b-2 border-white"
                : "text-white/80 hover:text-white"
                }`}
            >
              About
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`px-4 md:px-6 pb-2 transition whitespace-nowrap ${activeTab === "reviews"
                ? "font-semibold border-b-2 border-white"
                : "text-white/80 hover:text-white"
                }`}
            >
              Reviews ({tutor.reviews})
            </button>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="max-w-6xl mx-auto mt-6 md:mt-8 px-4 md:px-8">
        {/* Back */}
        <Link
          href="/student/allTutors"
          className="flex items-center text-gray-500 hover:text-blue-600 mb-4 md:mb-6 text-sm"
        >
          <ArrowLeft size={18} className="mr-2" /> Back to Tutors
        </Link>

        {/* Tab Contents */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* LEFT CONTENT */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            {activeTab === "about" ? (
              <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 border shadow-sm">
                <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4 flex items-center">
                  <BookOpen size={20} className="mr-2 text-blue-600" />
                  About Me
                </h2>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-4 md:mb-6">
                  {tutor.bio}
                </p>

                <h3 className="text-xs md:text-sm font-bold uppercase mb-2 md:mb-3 text-gray-700">
                  Specialties
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tutor.specialties.map((s, i) => (
                    <span
                      key={i}
                      className="bg-gray-100 px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-xs md:text-sm"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Submit Review Form */}
                {user?.role === "STUDENT" && (
                  <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 border shadow-sm">
                    <h2 className="text-lg md:text-xl font-bold mb-4 flex items-center">
                      <MessageSquare size={20} className="mr-2 text-blue-600" />
                      Write a Review
                    </h2>
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Your Rating
                        </label>
                        <Rating value={newRating} onChange={setNewRating} size={24} />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Your Comment
                        </label>
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none min-h-[100px]"
                          placeholder="Tell us about your experience with this tutor..."
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={submittingReview}
                        className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {submittingReview ? "Submitting..." : "Submit Review"}
                      </button>
                    </form>
                  </div>
                )}

                {/* Reviews List */}
                <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 border shadow-sm">
                  <h2 className="text-lg md:text-xl font-bold mb-6">
                    Student Reviews
                  </h2>
                  {reviews.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
                  ) : (
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div key={review._id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                              {review.studentId?.avatar ? (
                                <img src={review.studentId.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                              ) : (
                                review.studentId?.name?.charAt(0) || "S"
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-sm">{review.studentId?.name || "Student"}</p>
                              <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="ml-auto">
                              <Rating value={review.rating} readonly size={14} />
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {review.comment}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-6 border shadow-xl lg:sticky lg:top-8">
              {tutor.verified && (
                <div className="flex items-center justify-center gap-2 p-3 md:p-4 bg-blue-50 rounded-xl md:rounded-2xl mb-6">
                  <ShieldCheck size={16} className="text-blue-700" />
                  <span className="text-blue-700 font-semibold text-xs md:text-sm">
                    Verified Tutor
                  </span>
                </div>
              )}

              {/* Booking Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 p-3 md:p-4 bg-gray-50 rounded-xl md:rounded-2xl">
                  <StarIcon size={16} className="text-yellow-400 fill-current" />
                  <strong className="text-xs md:text-sm">
                    {tutor.rating}
                  </strong>
                  <span className="text-gray-600 text-xs md:text-sm">
                    ({tutor.reviews} reviews)
                  </span>
                </div>

                <div className="flex items-center gap-2 p-3 md:p-4 bg-gray-50 rounded-xl md:rounded-2xl">
                  <Clock size={16} className="text-gray-400" />
                  <span className="text-gray-600 text-xs md:text-sm">
                    {tutor.experience}
                  </span>
                </div>

                <div className="mt-8">
                  <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center">
                    <Calendar size={18} className="mr-2 text-blue-600" />
                    Select Date & Time
                  </h3>

                  {/* Date Picker */}
                  <div className="flex gap-2 overflow-x-auto pb-2 mb-4 no-scrollbar">
                    {dates.map((d, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveDateIndex(i)}
                        className={`flex flex-col items-center justify-center min-w-[50px] h-14 rounded-xl transition-all ${activeDateIndex === i
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                          : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                          }`}
                      >
                        <span className="text-[10px] font-bold uppercase">{d.day}</span>
                        <span className="text-sm font-black">{d.date}</span>
                      </button>
                    ))}
                  </div>

                  {/* Slots Grid */}
                  <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1 no-scrollbar mb-6">
                    {slotsForSelectedDay.length > 0 ? (
                      slotsForSelectedDay.map((slot) => (
                        <button
                          key={slot.key}
                          disabled={slot.isPast}
                          onClick={() => setSelectedSlotKey(slot.key)}
                          className={`w-full p-3 rounded-xl text-xs font-bold transition-all border ${selectedSlotKey === slot.key
                            ? "bg-blue-600 text-white border-blue-600"
                            : slot.isPast
                              ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed"
                              : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"
                            }`}
                        >
                          {slot.label}
                        </button>
                      ))
                    ) : (
                      <div className="text-center py-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <p className="text-[10px] text-gray-400 font-medium">No slots available for this date</p>
                      </div>
                    )}
                  </div>

                  <button
                    disabled={!selectedSlotKey}
                    onClick={async () => {
                      if (!user) {
                        Swal.fire("Login Required", "Please login as a student to book a session.", "info");
                        return;
                      }
                      if (user.role !== "STUDENT") {
                        Swal.fire("Restricted", "Only students can book sessions.", "warning");
                        return;
                      }

                      try {
                        const res = await checkPaymentStatus(id);
                        if (res.data?.paid && res.data?.status === "SUCCESS") {
                          const originalDate = dates[activeDateIndex].dateObj;
                          // Normalize to start of day in UTC
                          const dateObj = new Date(Date.UTC(
                            originalDate.getFullYear(),
                            originalDate.getMonth(),
                            originalDate.getDate()
                          ));
                          const dateStr = dateObj.toISOString();
                          
                          const slot = slotsForSelectedDay.find(s => s.key === selectedSlotKey);
                          const { startTime, endTime, _id } = slot;
                          
                          await saveSelectedSlot({
                            tutorId: id,
                            date: dateStr,
                            slot: { _id, startTime, endTime }
                          });

                          Swal.fire("Booked!", "Your session has been successfully booked.", "success");
                          setSelectedSlotKey(null);
                          // Refresh availability to remove booked slot
                          fetchAvailability();
                        } else {
                          // Redirect to pricing
                          window.location.href = `/CoursesPricing?tutorId=${id}`;
                        }
                      } catch (err) {
                        console.error(err);
                        Swal.fire("Error", err.response?.data?.message || err.message, "error");
                      }
                    }}
                    className={`w-full py-4 rounded-2xl font-bold text-sm transition-all ${selectedSlotKey
                      ? "bg-blue-600 text-white shadow-xl shadow-blue-200 hover:bg-blue-700 font-black"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                  >
                    Book Session Now
                  </button>
                </div>
              </div>

              <div className="text-center text-gray-500 text-xs space-y-1 mt-6 pt-6 border-t border-gray-50">
                <p>No payment required to contact the tutor</p>
                <p className="flex items-center justify-center gap-1 break-all">
                  <Mail size={12} className="flex-shrink-0" /> {tutor.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorDetailsView;



