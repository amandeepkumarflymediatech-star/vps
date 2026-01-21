"use client";

import React, { useEffect, useState } from "react";
import { Calendar, Save, Loader2, CheckCircle2 } from "lucide-react";
import {
  getTutorAvailability,
  saveTutorAvailability,
} from "@/api/tutorAvailability.api";

/* =========================
   TIME SLOTS (9 AM - 10 PM)
========================= */
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 9; hour <= 21; hour++) {
    const startTime = `${String(hour).padStart(2, "0")}:00`;
    const endTime = `${String(hour + 1).padStart(2, "0")}:00`;

    let label;
    if (hour < 12) label = `${hour}:00 AM - ${hour + 1}:00 AM`;
    else if (hour === 12) label = `12:00 PM - 1:00 PM`;
    else label = `${hour - 12}:00 PM - ${hour - 11}:00 PM`;

    slots.push({ startTime, endTime, label });
  }
  return slots;
};

/* =========================
   NEXT 7 DAYS (LOCAL SAFE)
========================= */
const getNext7Days = () => {
  const days = [];
  const today = new Date();
  const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);

    days.push({
      date: d,
      dateString: d.toLocaleDateString("en-CA"), // YYYY-MM-DD
      day: names[d.getDay()],
      dateNum: d.getDate(),
    });
  }

  return days;
};

const AvailabilityManager = () => {
  const timeSlots = generateTimeSlots();
  const days = getNext7Days();

  const [availability, setAvailability] = useState({});
  const [selectedDate, setSelectedDate] = useState(
    new Date().toLocaleDateString("en-CA"),
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  /* =========================
     FETCH AVAILABILITY FOR A SPECIFIC DAY
  ========================= */
  const fetchAvailabilityForDate = async (dateStr) => {
    try {
      setLoading(true);
      const res = await getTutorAvailability({ date: dateStr });
      const dayAvailability = {};
      let availableslots = res?.data?.data;
      availableslots?.forEach((slot) => {
        slot?.availability.forEach((x) => {
          // Ensure keys match frontend time keys
          const timeKey = x.startTime.padStart(5, "0");
          dayAvailability[timeKey] = x.isAvailable;
        });
      });

      setAvailability((prev) => ({
        ...prev,
        [dateStr]: dayAvailability,
      }));
    } catch (err) {
      console.error("Fetch availability error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     LOAD INITIAL DATA
  ========================= */
  useEffect(() => {
    fetchAvailabilityForDate(selectedDate);
  }, []);

  /* =========================
     FETCH WHEN SELECTING ANOTHER DAY
  ========================= */
  useEffect(() => {
    if (!availability[selectedDate]) {
      fetchAvailabilityForDate(selectedDate);
    }
  }, [selectedDate]);

  /* =========================
     TOGGLE SLOT
  ========================= */
  const toggleSlot = (startTime) => {
    setAvailability((prev) => ({
      ...prev,
      [selectedDate]: {
        ...prev[selectedDate],
        [startTime]: !prev[selectedDate]?.[startTime],
      },
    }));
    setSaved(false);
  };

  /* =========================
     SAVE TO BACKEND
  ========================= */
  const handleSave = async () => {
    try {
      setSaving(true);

      const payload = timeSlots.map((slot) => ({
        startTime: slot.startTime,
        endTime: slot.endTime,
        isAvailable: availability[selectedDate]?.[slot.startTime] || false,
      }));

      await saveTutorAvailability({
        date: selectedDate,
        availability: payload,
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save availability");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-4xl mx-auto mt-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Calendar className="text-blue-600" />
          Manage Availability
        </h2>

        <button
          onClick={handleSave}
          disabled={saving || saved}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold ${
            saved
              ? "bg-green-500 text-white"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving...
            </>
          ) : saved ? (
            <>
              <CheckCircle2 className="w-5 h-5" />
              Saved
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save
            </>
          )}
        </button>
      </div>

      {/* Date Selector */}
      <div className="flex gap-3 overflow-x-auto mb-6">
        {days.map((d) => (
          <button
            key={d.dateString}
            onClick={() => setSelectedDate(d.dateString)}
            className={`min-w-[80px] px-4 py-3 rounded-xl font-semibold ${
              selectedDate === d.dateString
                ? "bg-[#6335F8] text-white"
                : "border border-gray-300"
            }`}
          >
            <div className="text-xs">{d.day}</div>
            <div className="text-lg">{d.dateNum}</div>
          </button>
        ))}
      </div>

      {/* Slots */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {timeSlots.map((slot) => {
          const active = availability[selectedDate]?.[slot.startTime];
          return (
            <button
              key={slot.startTime}
              onClick={() => toggleSlot(slot.startTime)}
              className={`px-4 py-3 rounded-xl border-2 text-left ${
                active
                  ? "bg-[#6335F8] border-[#6335F8] text-white"
                  : "border-gray-200"
              }`}
            >
              {slot.label}
            </button>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 bg-blue-50 p-4 rounded-xl">
        <p className="text-sm font-semibold text-blue-900">
          {
            Object.values(availability[selectedDate] || {}).filter(Boolean)
              .length
          }{" "}
          slots selected for {selectedDate}
        </p>
      </div>
    </div>
  );
};

export default AvailabilityManager;
