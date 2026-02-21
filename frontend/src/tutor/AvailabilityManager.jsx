"use client";

import React, { useEffect, useState } from "react";
import {
  Calendar,
  Save,
  Loader2,
  CheckCircle2,
  Clock,
  ChevronRight,
  MousePointer2,
  Inbox,
  LayoutGrid,
} from "lucide-react";
import {
  getTutorAvailability,
  saveTutorAvailability,
} from "@/api/tutorAvailability.api";

/* =========================
   UTILITIES
========================= */
const generateTimeSlots = () => {
  const slots = [];
  let currentMinutes = 9 * 60; // 9:00 AM
  const endMinutes = 21 * 60; // 9:00 PM

  while (currentMinutes + 40 <= endMinutes) {
    const startHour = Math.floor(currentMinutes / 60);
    const startMin = currentMinutes % 60;

    const endTotal = currentMinutes + 40;
    const endHour = Math.floor(endTotal / 60);
    const endMin = endTotal % 60;

    const startTime = `${String(startHour).padStart(2, "0")}:${String(startMin).padStart(2, "0")}`;
    const endTime = `${String(endHour).padStart(2, "0")}:${String(endMin).padStart(2, "0")}`;

    const label = `${formatLabel(startHour, startMin)} - ${formatLabel(endHour, endMin)}`;

    slots.push({ startTime, endTime, label });

    currentMinutes += 40;
  }

  return slots;
};

const formatLabel = (hour, minute) => {
  const h = hour % 12 || 12;
  const ampm = hour < 12 ? "AM" : "PM";
  return `${h}:${String(minute).padStart(2, "0")} ${ampm}`;
};

const getNext7Days = () => {
  const days = [];
  const today = new Date();
  const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push({
      dateString: d.toLocaleDateString("en-CA"),
      day: names[d.getDay()],
      dateNum: d.getDate(),
      month: d.toLocaleString("default", { month: "short" }),
    });
  }
  return days;
};

const AvailabilityManager = () => {
  const timeSlots = generateTimeSlots();
  const days = getNext7Days();
  const todayStr = new Date().toLocaleDateString("en-CA");

  const getCurrentTimeHHMM = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes(),
    ).padStart(2, "0")}`;
  };

  const [availability, setAvailability] = useState({});
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const fetchAvailabilityForDate = async (dateStr) => {
    try {
      setLoading(true);
      const res = await getTutorAvailability({ date: dateStr });
      const newFetchedAvailability = {};

      if (Array.isArray(res?.data?.data)) {
        res.data.data.forEach((dayData) => {
          // Normalize date string (YYYY-MM-DD) to match frontend keys
          const d = new Date(dayData.date);
          const dStr = d.toISOString().split("T")[0];

          const daySlots = {};
          if (Array.isArray(dayData?.availability)) {
            dayData.availability.forEach((slot) => {
              if (!slot?.startTime) return;
              daySlots[slot.startTime.padStart(5, "0")] = {
                isAvailable: Boolean(slot.isAvailable),
                isBooked: slot.isBooked === true || slot.isBooked === "true",
              };
            });
          }
          newFetchedAvailability[dStr] = daySlots;
        });
      }
      setAvailability((prev) => ({ ...prev, ...newFetchedAvailability }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailabilityForDate(selectedDate);
  }, [selectedDate]);
  // useEffect(() => {
  //   fetchAvailabilityForDate(selectedDate);
  // }, []);
  // useEffect(() => {
  //   if (!availability[selectedDate]) fetchAvailabilityForDate(selectedDate);
  // }, [selectedDate]);

  const toggleSlot = (startTime) => {
    const slot = availability[selectedDate]?.[startTime];
    if (slot?.isBooked) return;
    setAvailability((prev) => ({
      ...prev,
      [selectedDate]: {
        ...prev[selectedDate],
        [startTime]: { isAvailable: !slot?.isAvailable, isBooked: false },
      },
    }));
    setSaved(false);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = timeSlots.map((slot) => {
        const state = availability[selectedDate]?.[slot.startTime] || {
          isAvailable: false,
          isBooked: false,
        };
        return {
          startTime: slot.startTime,
          endTime: slot.endTime,
          isAvailable: state.isAvailable,
          isBooked: state.isBooked,
        };
      });
      await saveTutorAvailability({
        date: selectedDate,
        availability: payload,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const countAvailable = Object.values(availability[selectedDate] || {}).filter(
    (s) => s?.isAvailable && !s?.isBooked,
  ).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 lg:p-12">
      <div className="max-w-6xl mx-auto">
        {/* TOP BAR */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-lg text-white">
                <LayoutGrid size={24} />
              </div>
              Scheduler
            </h1>
            <p className="text-slate-500 font-bold mt-1">
              Set your working hours for the week
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving || saved}
            className={`w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold transition-all active:scale-95 shadow-lg ${
              saved
                ? "bg-emerald-500 text-white shadow-emerald-200"
                : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200"
            }`}
          >
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : saved ? (
              <CheckCircle2 size={20} />
            ) : (
              <Save size={20} />
            )}
            {saving
              ? "Updating..."
              : saved
                ? "Changes Saved"
                : "Save Availability"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: DATE PICKER (Sidebar style) */}
          <div className="lg:col-span-3 space-y-3 flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible pb-4 lg:pb-0">
            {days.map((d) => {
              const isActive = selectedDate === d.dateString;
              return (
                <button
                  key={d.dateString}
                  onClick={() => setSelectedDate(d.dateString)}
                  className={`flex flex-col lg:flex-row items-center lg:justify-between min-w-[100px] lg:min-w-full p-4 rounded-2xl transition-all border-2 ${
                    isActive
                      ? "bg-white border-indigo-600 shadow-md ring-4 ring-indigo-50"
                      : "bg-transparent border-transparent text-slate-400 hover:bg-slate-100"
                  }`}
                >
                  <div className="text-center lg:text-left">
                    <p
                      className={`text-[10px] uppercase font-black tracking-widest ${isActive ? "text-indigo-600" : "text-slate-400"}`}
                    >
                      {d.day}
                    </p>
                    <p
                      className={`text-xl font-bold ${isActive ? "text-slate-900" : "text-slate-500"}`}
                    >
                      {d.dateNum} {d.month}
                    </p>
                  </div>
                  <ChevronRight
                    size={20}
                    className={`hidden lg:block transition-transform ${isActive ? "translate-x-1 text-indigo-600" : "opacity-0"}`}
                  />
                </button>
              );
            })}
          </div>

          {/* RIGHT: TIME SLOTS */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-6 md:p-10 relative overflow-hidden">
              {/* Background Decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 opacity-50" />

              <div className="flex justify-between items-center mb-8 relative z-10">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Clock size={20} className="text-indigo-600" />
                    Available Hours
                  </h3>
                  <p className="text-slate-400 text-sm font-medium">
                    {countAvailable} slots selected for this day
                  </p>
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-pulse">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-16 bg-slate-100 rounded-2xl" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {timeSlots
                    .filter((slot) =>
                      selectedDate === todayStr
                        ? slot.startTime > getCurrentTimeHHMM()
                        : true,
                    )
                    .map((slot) => {
                      const state =
                        availability[selectedDate]?.[slot.startTime];
                      const isAvailable = state?.isAvailable;
                      const isBooked = state?.isBooked;

                      return (
                        <button
                          key={slot.startTime}
                          disabled={isBooked}
                          onClick={() => toggleSlot(slot.startTime)}
                          className={`group relative flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                            isBooked
                              ? "bg-slate-50 border-slate-100 opacity-60 cursor-not-allowed"
                              : isAvailable
                                ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100 scale-[1.02]"
                                : "bg-white border-slate-100 text-slate-600 hover:border-indigo-200 hover:bg-indigo-50/30"
                          }`}
                        >
                          <div className="flex flex-col text-left">
                            <span
                              className={`text-xs font-black uppercase tracking-tighter ${isAvailable ? "text-indigo-100" : "text-slate-400"}`}
                            >
                              Session
                            </span>
                            <span className="font-bold text-sm md:text-base">
                              {slot.label}
                            </span>
                          </div>

                          {isBooked ? (
                            <div className="bg-slate-200 text-slate-500 px-2 py-1 rounded-md text-[10px] font-black uppercase">
                              Booked
                            </div>
                          ) : isAvailable ? (
                            <div className="bg-white/20 p-1.5 rounded-full">
                              <CheckCircle2 size={18} />
                            </div>
                          ) : (
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <MousePointer2
                                size={16}
                                className="text-indigo-400"
                              />
                            </div>
                          )}
                        </button>
                      );
                    })}
                </div>
              )}

              {/* Empty State Logic */}
              {!loading && timeSlots.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                  <Inbox size={48} strokeWidth={1} />
                  <p className="mt-4 font-medium">
                    No slots available for this time range.
                  </p>
                </div>
              )}
            </div>

            {/* Footer Summary Card */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between bg-indigo-900 text-white p-6 rounded-[2rem] shadow-2xl">
              <div className="flex items-center gap-4 mb-4 sm:mb-0">
                <div className="p-3 bg-white/10 rounded-2xl">
                  <Calendar className="text-indigo-300" />
                </div>
                <div>
                  <p className="text-indigo-200 text-xs font-black uppercase tracking-widest">
                    Selected Date
                  </p>
                  <p className="font-bold">
                    {new Date(selectedDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="text-center sm:text-right">
                <p className="text-4xl font-black">{countAvailable}</p>
                <p className="text-indigo-300 text-[10px] font-black uppercase tracking-[0.2em]">
                  Total Slots Active
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityManager;
