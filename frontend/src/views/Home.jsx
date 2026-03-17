import heroBg from "../assets/home-bg/englsih-raj.jpg";
import { getLatestReviews } from "@/api/review.api";
import Rating from "@/components/Rating";
import { useRouter } from "next/navigation";
import { useState,useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const Home = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [latestReviews, setLatestReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
    
    const fetchReviews = async () => {
      try {
        setLoadingReviews(true);
        const res = await getLatestReviews();
        if (res.data?.success) {
          setLatestReviews(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch latest reviews:", err);
      } finally {
        setLoadingReviews(false);
      }
    };
    fetchReviews();
  }, []);

  const handleActivate = () => {
// ... (rest of handleActivate remains same)
    if (!isLoggedIn) {
      router.push("/register");
      return;
    }
    router.push("/CoursesPricing");
  };

  return (
    <div className="w-full overflow-hidden">
      {/* ================= HERO SECTION ================= */}
      <section
        className="relative min-h-screen flex items-center"
        style={{
          backgroundImage: `url(${heroBg.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.8 }}
            className="bg-white/40 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10 max-w-full lg:max-w-2xl"
          >
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">The English Raj</h1>
            <h2 className="mt-1 text-base sm:text-md lg:text-lg font-semibold text-[#0852A1]">Conquer the world with your English</h2>
            <h3 className="mt-3 text-lg sm:text-xl font-bold text-gray-900">About Us</h3>
            <p className="mt-1 text-gray-800 text-sm sm:text-base leading-relaxed">Our students continue to carve their niche in diverse fields, supported by our adept team of professionals.</p>
            <p className="mt-2 text-gray-800 text-sm sm:text-base leading-relaxed">Whether you are a working professional, a beginner, a student aspiring to study abroad, or a graduate preparing for interviews — <span className="font-semibold text-[#0852A1]">your progress begins here.</span></p>
            <h3 className="mt-2 text-base sm:text-lg font-bold text-gray-900">Our Expertise</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {["IELTS Preparation", "English Phonetics", "Public Speaking", "Grammatical Accuracy", "Interview Preparation", "Business English", "Creative Writing"].map((skill, index) => (
                <span key={index} className="px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm rounded-full bg-blue-100 text-[#0852A1] font-medium">{skill}</span>
              ))}
            </div>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleActivate} className="mt-8 w-full sm:w-auto bg-[#0852A1] hover:bg-[#063F7C] text-white px-8 py-3 rounded-full text-sm font-semibold">BOOK NOW</motion.button>
          </motion.div>
        </div>
      </section>

      {/* ================= LATEST REVIEWS SECTION ================= */}
      {/* {latestReviews.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Latest Student Reviews</h2>
              <p className="text-gray-600 max-w-2xl mx-auto italic">"Listen to what our community has to say about their learning journey."</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestReviews.map((review) => (
                <motion.div
                  key={review._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white p-8 rounded-3xl shadow-xl shadow-blue-900/5 border border-gray-100 flex flex-col h-full"
                >
                  <div className="mb-6">
                    <Rating value={review.rating} readonly size={18} />
                  </div>
                  
                  <blockquote className="text-gray-700 text-lg mb-8 flex-1 italic">
                    "{review.comment}"
                  </blockquote>
                  
                  <div className="flex items-center gap-4 pt-6 border-t border-gray-50">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 overflow-hidden shadow-inner">
                      {review.studentId?.avatar ? (
                        <img src={review.studentId.avatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        review.studentId?.name?.charAt(0) || "S"
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{review.studentId?.name}</h4>
                      <p className="text-xs text-blue-600 font-semibold tracking-wide uppercase">Student</p>
                    </div>
                  </div>
                  
                  {review.tutorId && (
                    <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                      <span>Reviewed:</span>
                      <span className="font-medium text-gray-600">{review.tutorId.name}</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
            
            <div className="mt-16 text-center">
              <Link href="/tutors" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700 transition-colors">
                Find your perfect tutor <span>&rarr;</span>
              </Link>
            </div>
          </div>
        </section>
      )} */}

      {/* ================= STATS SECTION ================= */}
      <section className="bg-gradient-to-r from-[#0B3C66] to-[#0852A1] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[
            { value: "1,000+", label: "Successful Learners", icon: "🎯" },
            { value: "95%", label: "Satisfaction Rate", icon: "⭐" },
            { value: "3x Faster", label: "Speaking Improvement", icon: "🚀" },
          ].map((stat, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.15 }} viewport={{ once: true }} className="bg-white rounded-xl p-5 shadow-lg flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-2xl">{stat.icon}</div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{stat.value}</h3>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;

