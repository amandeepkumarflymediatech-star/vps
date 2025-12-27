import { useState } from "react";
import tutors from "../data/tutors";
import slots from "../data/slots";

const BookNow = () => {
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const handleBooking = () => {
    if (!selectedTutor || !selectedSlot) {
      alert("Please select tutor and time slot");
      return;
    }

    alert(
      `✅ Session Booked!\nTutor: ${selectedTutor.name}\nTime: ${selectedSlot}`
    );

    // 🔥 API CALL READY
    // bookingApi.create({ tutorId, slot })
  };

  return (
    <div>
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Book a Session</h1>
        <p className="text-sm text-gray-500">
          Choose a tutor & preferred time slot
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* 🧑‍🏫 TUTORS LIST */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow p-4">
          <h2 className="font-semibold text-gray-700 mb-4">Select Tutor</h2>

          <div className="space-y-3 max-h-[420px] overflow-y-auto">
            {tutors.map((tutor) => (
              <div
                key={tutor.id}
                onClick={() => {
                  setSelectedTutor(tutor);
                  setSelectedSlot(null);
                }}
                className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition
                ${
                  selectedTutor?.id === tutor.id
                    ? "border-[#0852A1] bg-blue-50"
                    : "hover:bg-gray-50"
                }`}
              >
                <img
                  src={tutor.avatar}
                  alt={tutor.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-medium">{tutor.name}</p>
                  <p className="text-xs text-gray-500">
                    ⭐ {tutor.rating} · {tutor.students}+ students
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 📅 TIME SLOTS */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow p-4">
          <h2 className="font-semibold text-gray-700 mb-4">
            Available Time Slots
          </h2>

          {!selectedTutor ? (
            <p className="text-gray-500 text-center mt-10">
              👈 Select a tutor to view slots
            </p>
          ) : (
            <>
              <p className="text-sm mb-4">
                Tutor:{" "}
                <span className="font-semibold">
                  {selectedTutor.name}
                </span>
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {slots.map((slot, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-2 text-sm rounded-lg border transition
                    ${
                      selectedSlot === slot
                        ? "bg-[#0852A1] text-white border-[#0852A1]"
                        : "hover:border-[#0852A1]"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* 📌 BOOKING SUMMARY */}
      {selectedTutor && selectedSlot && (
        <div className="mt-6 bg-white rounded-xl shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500">Booking Summary</p>
            <p className="font-semibold">
              {selectedTutor.name} · {selectedSlot}
            </p>
          </div>

          <button
            onClick={handleBooking}
            className="bg-[#0852A1] text-white px-6 py-2 rounded-lg hover:bg-[#063F7C]"
          >
            Confirm Booking
          </button>
        </div>
      )}
    </div>
  );
};

export default BookNow;
