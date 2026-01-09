"use client";

import React, { useState } from "react";
import { Clock, Star, Search, X, ShieldCheck } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const BookSession = () => {
  const [activeDate, setActiveDate] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Filters
  const [selectedTime, setSelectedTime] = useState("");
  const [searchName, setSearchName] = useState("");
  const [applyFilter, setApplyFilter] = useState(false);

  // Modal state
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState(null);

  /* ---------------- DATES ---------------- */
  const dates = [
    { day: "Fri", date: 9 },
    { day: "Sat", date: 10 },
    { day: "Sun", date: 11 },
    { day: "Mon", date: 12 },
    { day: "Tue", date: 13 },
    { day: "Wed", date: 14 },
    { day: "Thu", date: 15 },
  ];

  /* ---------------- TIME OPTIONS ---------------- */
  const timeWindows = [
    "09:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "12:00 PM - 01:00 PM",
    "01:00 PM - 02:00 PM",
    "02:00 PM - 03:00 PM",
    "03:00 PM - 04:00 PM",
    "04:00 PM - 05:00 PM",
    "05:00 PM - 06:00 PM",
    "06:00 PM - 07:00 PM",
    "07:00 PM - 08:00 PM",
    "08:00 PM - 09:00 PM",
    "09:00 PM - 10:00 PM",
  ];

  /* ---------------- TUTORS ---------------- */
 const tutors = [
  {
    id: 1,
    name: "Gaurav",
    rating: 4.7,
    sessions: 1200,
    image: "https://i.pravatar.cc/150?img=12",
    slots: ["06:00 PM - 07:00 PM", "07:00 PM - 08:00 PM"],
  },
  {
    id: 2,
    name: "Madhav",
    rating: 4.6,
    sessions: 980,
    image: "https://i.pravatar.cc/150?img=15",
    slots: ["05:00 PM - 06:00 PM", "Reserved"],
  },
  {
    id: 3,
    name: "Anitha",
    rating: 4.8,
    sessions: 1500,
    image: "https://i.pravatar.cc/150?img=47",
    slots: ["01:00 PM - 02:00 PM", "04:00 PM - 05:00 PM"],
  },
  {
    id: 4,
    name: "Mamta",
    rating: 4.9,
    sessions: 1800,
    image: "https://i.pravatar.cc/150?img=32",
    slots: ["09:00 AM - 10:00 AM", "10:00 AM - 11:00 AM"],
  },
  {
    id: 5,
    name: "Rahul",
    rating: 4.5,
    sessions: 760,
    image: "https://i.pravatar.cc/150?img=18",
    slots: ["11:00 AM - 12:00 PM", "Reserved"],
  },
  {
    id: 6,
    name: "Neha",
    rating: 4.8,
    sessions: 1340,
    image: "https://i.pravatar.cc/150?img=25",
    slots: ["02:00 PM - 03:00 PM", "03:00 PM - 04:00 PM"],
  },
  {
    id: 7,
    name: "Suresh",
    rating: 4.4,
    sessions: 620,
    image: "https://i.pravatar.cc/150?img=40",
    slots: ["04:00 PM - 05:00 PM", "05:00 PM - 06:00 PM"],
  },
  {
    id: 8,
    name: "Pooja",
    rating: 4.9,
    sessions: 2000,
    image: "https://i.pravatar.cc/150?img=48",
    slots: ["06:00 PM - 07:00 PM", "Reserved"],
  },
  {
    id: 9,
    name: "Amit",
    rating: 4.6,
    sessions: 890,
    image: "https://i.pravatar.cc/150?img=11",
    slots: ["07:00 PM - 08:00 PM", "08:00 PM - 09:00 PM"],
  }
];


  /* ---------------- FILTER ---------------- */
  const filteredTutors = tutors.filter((tutor) => {
    if (!applyFilter) return true;

    const matchName = tutor.name
      .toLowerCase()
      .includes(searchName.toLowerCase());

    const matchTime = selectedTime
      ? tutor.slots.includes(selectedTime)
      : true;

    return matchName && matchTime;
  });

  /* ---------------- BOOK CLICK ---------------- */
const handleBookNow = (tutor) => {
    if (!selectedSlot || selectedSlot.tutorId !== tutor.id) {
      toast.error("Please select a time slot first", {
        position: "top-right", // This moves it to the top-left corner
      });
      return;
    }
    setSelectedTutor(tutor);
    setShowConfirm(true);
  };

  /* ---------------- RAZORPAY REDIRECT ---------------- */
  const handleConfirmBooking = () => {
    setShowConfirm(false);

    // 👉 Replace with your real Razorpay checkout URL
    window.location.href =
      ""; // demo Razorpay link
  };

  return (
    <div className="space-y-8 p-6 bg-white relative">
      <Toaster />

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Book a Session</h1>
        <p className="text-gray-500">Search & book available tutors</p>
      </div>

      {/* DATE FILTER */}
      <div className="flex gap-3 overflow-x-auto">
        {dates.map((d, index) => (
          <button
            key={index}
            onClick={() => {
              setActiveDate(index);
              setSelectedSlot(null);
            }}
            className={`min-w-[70px] rounded-xl px-4 py-3 font-semibold
              ${
                activeDate === index
                  ? "bg-[#6335F8] text-white"
                  : "bg-purple-50 text-[#6335F8]"
              }`}
          >
            <div className="text-xs">{d.day}</div>
            <div className="text-lg">{d.date}</div>
          </button>
        ))}
      </div>

      {/* SEARCH */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          placeholder="Tutor name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="border rounded-xl px-4 py-2"
        />

        <div className="flex items-center gap-2 border rounded-xl px-4 py-2">
          <Clock size={16} />
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="bg-transparent w-full outline-none"
          >
            <option value="">All Times</option>
            {timeWindows.map((t, i) => (
              <option key={i}>{t}</option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setApplyFilter(true)}
          className="bg-[#6335F8] text-white rounded-xl flex items-center justify-center gap-2"
        >
          <Search size={16} /> Search
        </button>
      </div>

      {/* TUTORS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTutors.map((tutor) => (
          <div
            key={tutor.id}
            className="border rounded-2xl p-5 hover:shadow-lg"
          >
            <div className="flex justify-between mb-4">
              <div>
                <h3 className="font-bold">{tutor.name}</h3>
                <p className="text-sm text-gray-500 flex gap-1 items-center">
                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                  {tutor.rating} | {tutor.sessions}+ sessions
                </p>
              </div>
              <img
                src={tutor.image}
                className="w-14 h-14 rounded-full"
              />
            </div>

            <div className="flex gap-2 flex-wrap mb-4">
              {tutor.slots.map((slot, i) => (
                <button
                  key={i}
                  disabled={slot === "Reserved"}
                  onClick={() =>
                    setSelectedSlot({ tutorId: tutor.id, slotIndex: i })
                  }
                  className={`px-3 py-2 text-xs rounded-lg border
                    ${
                      slot === "Reserved"
                        ? "bg-gray-100 text-gray-300"
                        : selectedSlot?.tutorId === tutor.id &&
                          selectedSlot?.slotIndex === i
                        ? "bg-[#6335F8] text-white"
                        : "hover:border-[#6335F8]"
                    }`}
                >
                  {slot}
                </button>
              ))}
            </div>

            <button
              onClick={() => handleBookNow(tutor)}
              className="w-full py-3 rounded-xl bg-[#6335F8] text-white font-bold"
            >
              Book Now
            </button>
          </div>
        ))}
      </div>

      {/* ================= CONFIRM MODAL ================= */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 relative border border-purple-200">
            <button
              onClick={() => setShowConfirm(false)}
              className="absolute top-4 right-4"
            >
              <X />
            </button>

            <div className="flex flex-col items-center text-center">
              <img
                src={selectedTutor.image}
                className="w-20 h-20 rounded-full mb-4"
              />

              <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg flex gap-2 items-center text-sm mb-4">
                <ShieldCheck size={16} />
                Try another tutor for free or get a refund if not satisfied
              </div>

              <button
                onClick={handleConfirmBooking}
                className="w-full bg-[#6335F8] text-white py-3 rounded-full font-bold mb-3"
              >
                Yes, I want to book this session
              </button>

              <button
                onClick={() => setShowConfirm(false)}
                className="w-full py-3 rounded-full bg-gray-100 text-gray-700"
              >
                No, I want to book another slot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookSession;
