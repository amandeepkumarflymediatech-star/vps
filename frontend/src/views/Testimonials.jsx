import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLatestReviews } from "../api/review.api";

gsap.registerPlugin(ScrollTrigger);
const testimonials = [
  {
    name: "Riya Sharma",
    role: "IELTS Student",
    feedback:
      "The English Raj completely transformed my confidence. The one-on-one sessions helped me score 7.5 in IELTS. Highly recommended!",
    rating: 5,
  },
  {
    name: "Amit Verma",
    role: "Working Professional",
    feedback:
      "I struggled with spoken English at work. Thanks to The English Raj, I now communicate confidently in meetings and interviews.",
    rating: 5,
  },
  {
    name: "Neha Kapoor",
    role: "College Student",
    feedback:
      "The tutors are extremely supportive and friendly. Live sessions, feedback, and structured lessons make learning enjoyable.",
    rating: 4,
  },
  {
    name: "Rahul Mehta",
    role: "Entrepreneur",
    feedback:
      "Business English sessions helped me pitch confidently to international clients. Best decision I made!",
    rating: 5,
  },
];

const Testimonials = () => {
  const sectionRef = useRef(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await getLatestReviews();
        if (response.data.success) {
          setReviews(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  useEffect(() => {
    if (!loading && reviews.length > 0) {
      gsap.fromTo(
        ".testimonial-card",
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        }
      );
    }
  }, [loading, reviews]);

  return (
    <section
      ref={sectionRef}
      className="max-w-9xl mx-auto px-4 py-15 bg-white text-black min-h-[60vh]"
    >
      {/* ===== HEADER ===== */}
      <div className="text-center mb-10 sm:mb-14 px-4">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-2xl sm:text-4xl font-bold "
        >
          What Our Learners Say
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-3 sm:mt-4 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed"
        >
          Trusted by learners across India and beyond. Discover how{" "}
          <span className="font-semibold text-[#0852A1]">The English Raj</span>{" "}
          is helping people speak English fluently with confidence.
        </motion.p>
      </div>

      {/* ===== TESTIMONIAL GRID ===== */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0852A1]"></div>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-20 text-gray-500">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {testimonials.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -8, scale: 1.03 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="testimonial-card bg-white rounded-xl shadow-md p-6 border hover:shadow-xl"
              >
                {/* Stars */}
                <div className="flex mb-3">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">
                      ★
                    </span>
                  ))}
                </div>

                <p className="text-gray-600 text-sm leading-relaxed mb-5">
                  “{item.feedback}”
                </p>

                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-800">
                    {item.name}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {item.role}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <div className=" bg-gray-50 px-4 sm:px-10 py-12">

          {/* Header */}
           

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((item, index) => (
              <motion.div
                key={item._id || index}
                whileHover={{ y: -8, scale: 1.03 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Top Content */}
                <div>
                  {/* Stars */}
                  <div className="flex mb-3 gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${i < item.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                          }`}
                      >
                        ★
                      </span>
                    ))}
                    <span className="text-sm text-gray-500 ml-2">
                      {item.rating.toFixed(1)}
                    </span>
                  </div>

                  {/* Comment */}
                  <p className="text-gray-600 text-sm leading-relaxed mb-5 italic">
                    “{item.comment}”
                  </p>
                </div>

                {/* Bottom Section */}
                <div className="border-t pt-4 mt-auto space-y-4">

                  {/* Student */}
                  <div className="flex items-center gap-3">
                    {item.studentId?.avatar ? (
                      <img
                        src={item.studentId.avatar}
                        alt={item.studentId.name}
                        className="w-10 h-10 rounded-full object-cover border"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[#0852A1] font-bold shadow-sm border">
                        {item.studentId?.name?.charAt(0) || "U"}
                      </div>
                    )}

                    <div>
                      <h4 className="font-semibold text-gray-800 text-sm">
                        {item.studentId?.name || "Student"}
                      </h4>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        {item.studentId?.profession || "Learner"}
                      </p>
                    </div>
                  </div>

                  {/* Tutor */}
                  {item.tutorId && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        Reviewed tutor:{" "}
                        <span className="text-gray-600 font-medium">
                          {item.tutorId.name}
                        </span>
                      </span>

                      {item.tutorId?.avatar ? (
                        <img
                          src={item.tutorId.avatar}
                          alt={item.tutorId.name}
                          className="w-8 h-8 rounded-full object-cover border"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-[#0852A1] font-bold">
                          {item.tutorId?.name?.charAt(0) || "T"}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default Testimonials;
