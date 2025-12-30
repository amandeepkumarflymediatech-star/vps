
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const slideRight = {
  hidden: { opacity: 0, x: 80 },
  visible: { opacity: 1, x: 0 },
};

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full overflow-hidden">

      {/* ===== HERO SECTION ===== */}
      <section
        className="relative min-h-[95vh] flex items-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1519389950473-47ba0277781c')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/30"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* ===== LEFT CONTENT ===== */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.8 }}
            className="backdrop-blur-md bg-white/80 rounded-2xl p-8 shadow-xl max-w-xl"
          >
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold text-gray-900 leading-tight"
            >
              Master English with <br />
              <span className="text-[#0852A1]">Live 1-on-1 Sessions</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-5 text-gray-700 leading-relaxed text-sm"
            >
              The English Raj offers personalized one-on-one English learning with expert tutors. Whether you’re preparing for interviews, office meetings, or public speaking, learn at your own pace, choose flexible time slots, and build real-life confidence through practical conversations that accelerate your growth.
            </motion.p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/register")}
              className="mt-6 bg-[#0852A1] hover:bg-[#063F7C] text-white px-6 py-3 rounded-full text-sm font-medium"
            >
              BOOK NOW →
            </motion.button>
          </motion.div> {/* ✅ FIX HERE */}

          {/* ===== RIGHT PRICING CARDS ===== */}
          <motion.div
            variants={slideRight}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col gap-4 items-end"
          >
            {[
              { lessons: "8 LESSONS", price: "2830 (including GST)", icon: "📘" },
              { lessons: "12 LESSONS", price: "3530 (including GST)", icon: "🏠" },
              { lessons: "16 LESSONS", price: "4720 (including GST)", icon: "👥" },
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -6, scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-white rounded-xl shadow-lg px-5 py-4 w-64 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-sm font-semibold">{item.lessons}</h4>
                  <p className="text-xs text-gray-500">{item.price}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* ===== STATS ===== */}
      {/* <section className="bg-gradient-to-r from-[#0B3C66] to-[#0852A1] py-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: "10,000+", label: "Successful Learners", icon: "🖥️" },
            { value: "500+", label: "Verified Tutors", icon: "👥" },
            { value: "95%", label: "Satisfaction Rate", icon: "🎓" },
            { value: "3x Faster", label: "Improvement", icon: "🧾" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-4 text-center shadow-md"
            >
              <div className="text-2xl mb-1">{stat.icon}</div>
              <h3 className="text-xl font-bold">{stat.value}</h3>
              <p className="text-xs text-gray-600">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section> */}


<section className="bg-gradient-to-r from-[#0B3C66] to-[#0852A1] py-10">
  <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
    {[
      {
        value: "10,000+",
        label: "Successful Learners",
        icon: "🖥️",
      },
      {
        value: "500+",
        label: "Verified Expert Tutors",
        icon: "👥",
      },
      {
        value: "95%",
        label: "Learner Satisfaction Rate",
        icon: "🎓",
      },
      {
        value: "3x Faster",
        label: "Speaking Improvement",
        icon: "🧾",
      },
    ].map((stat, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.15 }}
        viewport={{ once: true }}
        className="bg-white rounded-xl p-5 shadow-md flex items-center gap-4"
      >
        {/* LEFT ICON */}
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-2xl">
          {stat.icon}
        </div>

        {/* RIGHT TEXT */}
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            {stat.value}
          </h3>
          <p className="text-sm text-gray-600">
            {stat.label}
          </p>
        </div>
      </motion.div>
    ))}
  </div>
</section>

    </div>
  );
};

export default Home;
