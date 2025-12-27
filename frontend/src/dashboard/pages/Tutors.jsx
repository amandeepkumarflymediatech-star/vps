// import React from 'react'

// const Tutors = () => {
//   return (
//     <div>Tutors</div>
//   )
// }

// export default Tutors


import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, Search } from "lucide-react";
import tutorsData from "../data/tutors";

const Tutors = () => {
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");

  const filteredTutors = tutorsData.filter((tutor) => {
    const matchesSearch = tutor.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesRating =
      ratingFilter === "all" || tutor.rating >= Number(ratingFilter);

    return matchesSearch && matchesRating;
  });

  return (
    <div>
      {/* 🔹 HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Our Tutors</h1>
          <p className="text-sm text-gray-500">
            Book sessions with expert English tutors
          </p>
        </div>

        {/* 🔍 SEARCH + FILTER */}
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search tutor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#0852A1]"
            />
          </div>

          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0852A1]"
          >
            <option value="all">All Ratings</option>
            <option value="4.5">4.5+</option>
            <option value="4.7">4.7+</option>
            <option value="4.9">4.9+</option>
          </select>
        </div>
      </div>

      {/* 🧑‍🏫 TUTOR GRID */}
      {filteredTutors.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          No tutors found 😔
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTutors.map((tutor) => (
            <div
              key={tutor.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition p-4"
            >
              {/* Avatar */}
              <div className="flex items-center gap-4 mb-3">
                <img
                  src={tutor.avatar}
                  alt={tutor.name}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {tutor.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {tutor.experience}+ yrs experience
                  </p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 text-sm mb-2">
                <Star size={16} className="text-yellow-400 fill-yellow-400" />
                <span className="font-medium">{tutor.rating}</span>
                <span className="text-gray-500">
                  · {tutor.students}+ students
                </span>
              </div>

              {/* Availability */}
              <p className="text-sm text-gray-600 mb-3">
                Next available:{" "}
                <span className="font-medium">{tutor.nextSlot}</span>
              </p>

              {/* Actions */}
              <div className="flex gap-2">
                <Link
                  to={`/dashboard/tutors/${tutor.id}`}
                  className="flex-1 text-center text-sm border border-[#0852A1] text-[#0852A1] py-2 rounded-lg hover:bg-[#0852A1] hover:text-white transition"
                >
                  View Profile
                </Link>

                <Link
                  to="/dashboard/book"
                  className="flex-1 text-center text-sm bg-[#0852A1] text-white py-2 rounded-lg hover:bg-[#063F7C]"
                >
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tutors;
