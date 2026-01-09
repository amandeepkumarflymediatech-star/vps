"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Mail,
  Star,
  BookOpen,
  Clock,
  Award,
  ShieldCheck,
  Calendar,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

/* ---------------- MOCK API DATA ---------------- */
const MOCK_TUTORS = [
  {
    id: "1",
    name: "Dr. Sarah Jenkins",
    subject: "Advanced Mathematics",
    rating: 4.9,
    reviews: 128,
    experience: "10+ Years",
    bio: "Dedicated mathematics educator specializing in calculus and linear algebra. Passionate about making complex concepts accessible to every student.",
    email: "sarah.j@example.com",
    education: "Ph.D. in Mathematics, Stanford University",
    specialties: ["Calculus", "Linear Algebra", "SAT Math", "Statistics"],
    availability: "Today",
    responseTime: "< 2 hours",
  },
  {
    id: "2",
    name: "Rahul Mehta",
    subject: "Physics",
    rating: 4.7,
    reviews: 94,
    experience: "7+ Years",
    bio: "Physics tutor with strong fundamentals and real-world examples to simplify learning.",
    email: "rahul.m@example.com",
    education: "M.Sc Physics, IIT Delhi",
    specialties: ["Mechanics", "Electromagnetism", "JEE Physics"],
    availability: "Tomorrow",
    responseTime: "< 3 hours",
  },
];

const TutorDetailsView = () => {
  const { id } = useParams();
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    // 🔁 Replace this with real API later
    setTimeout(() => {
      const foundTutor = MOCK_TUTORS.find((t) => t.id === id);
      setTutor(foundTutor || null);
      setLoading(false);
    }, 600);
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="text-center py-20 text-gray-500">
        Tutor not found
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      {/* Back */}
      <Link
        href="/student/tutors"
        className="flex items-center text-gray-500 hover:text-blue-600 mb-6"
      >
        <ArrowLeft size={18} className="mr-2" /> Back to Tutors
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT CONTENT */}
        <div className="lg:col-span-2 space-y-8">
          {/* Profile Header */}
          <div className="bg-white rounded-3xl p-8 border shadow-sm flex gap-6">
            <div className="relative">
              <div className="w-28 h-28 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl flex items-center justify-center text-white text-4xl font-bold">
                {tutor.name.charAt(0)}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-green-500 w-7 h-7 rounded-full border-4 border-white"></div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-extrabold">{tutor.name}</h1>
                <span className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                  <ShieldCheck size={14} className="mr-1" /> Verified
                </span>
              </div>

              <p className="text-lg text-blue-600 font-medium mb-3">
                {tutor.subject}
              </p>

              <div className="flex flex-wrap gap-6 text-gray-600">
                <div className="flex items-center">
                  <Star size={18} className="text-yellow-400 fill-current mr-1" />
                  <strong>{tutor.rating}</strong>
                  <span className="ml-1">
                    ({tutor.reviews} reviews)
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock size={18} className="mr-1 text-gray-400" />
                  {tutor.experience}
                </div>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="bg-white rounded-3xl p-8 border shadow-sm">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <BookOpen size={22} className="mr-2 text-blue-600" />
              About Me
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              {tutor.bio}
            </p>

            <h3 className="text-sm font-bold uppercase mb-3 text-gray-700">
              Specialties
            </h3>
            <div className="flex flex-wrap gap-2">
              {tutor.specialties.map((s, i) => (
                <span
                  key={i}
                  className="bg-gray-100 px-4 py-2 rounded-xl text-sm"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="bg-white rounded-3xl p-8 border shadow-sm">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Award size={22} className="mr-2 text-blue-600" />
              Education
            </h2>
            <p className="text-gray-700 font-medium">
              {tutor.education}
            </p>
          </div>
        </div>

        {/* RIGHT SIDEBAR (NO PRICE) */}
        <div>
          <div className="bg-white rounded-3xl p-6 border shadow-xl sticky top-8">
            <div className="space-y-4 mb-6">
              <div className="flex justify-between p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center text-gray-600">
                  <Calendar size={18} className="mr-2" />
                  Next Available
                </div>
                <span className="font-bold">
                  {tutor.availability}
                </span>
              </div>

              <div className="flex justify-between p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center text-gray-600">
                  <Mail size={18} className="mr-2" />
                  Response Time
                </div>
                <span className="font-bold">
                  {tutor.responseTime}
                </span>
              </div>
            </div>

            <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 mb-4">
              Book a Lesson
            </button>

            <button className="w-full border-2 border-blue-600 text-blue-600 py-4 rounded-2xl font-bold hover:bg-blue-50">
              Send Message
            </button>

            <p className="text-center text-gray-400 text-xs mt-5">
              No payment required to contact the tutor
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorDetailsView;
