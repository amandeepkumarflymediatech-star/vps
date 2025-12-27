// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";

// const stats = [
//   { value: "500+", label: "Corporate Clients" },
//   { value: "25,000+", label: "Professionals Trained" },
//   { value: "95%", label: "Improvement Rate" },
//   { value: "10+ Years", label: "Training Experience" },
// ];

// const programs = [
//   {
//     title: "Corporate Spoken English",
//     desc: "Improve fluency, confidence & workplace communication.",
//   },
//   {
//     title: "Business Communication",
//     desc: "Emails, meetings, presentations & client handling.",
//   },
//   {
//     title: "Interview & Leadership Skills",
//     desc: "Managerial speaking, negotiations & leadership presence.",
//   },
//   {
//     title: "Customer Support Training",
//     desc: "Voice & accent, empathy, global customer handling.",
//   },
// ];

// const Organizations = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="w-full overflow-hidden">

//       {/* ================= HERO ================= */}
//       <section className="bg-gradient-to-r from-[#0B3C66] to-[#0852A1] text-white">
//         <div className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
//           <motion.div
//             initial={{ opacity: 0, y: 40 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//           >
//             <h1 className="text-4xl md:text-5xl font-bold leading-tight">
//               English Training for <br />
//               <span className="text-[#FFD166]">Organizations & Teams</span>
//             </h1>

//             <p className="mt-6 text-lg text-gray-200 max-w-xl">
//               The English Raj partners with organizations to deliver
//               result-oriented English communication programs for employees,
//               leaders & customer-facing teams.
//             </p>

//             <div className="mt-8 flex gap-4">
//               <button
//                 onClick={() => navigate("/contact")}
//                 className="bg-white text-[#0852A1] px-6 py-3 rounded-full font-semibold hover:scale-105 transition"
//               >
//                 Request Demo
//               </button>

//               <button
//                 onClick={() => navigate("/become-tutor")}
//                 className="border border-white px-6 py-3 rounded-full hover:bg-white hover:text-[#0852A1] transition"
//               >
//                 Partner With Us
//               </button>
//             </div>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0, x: 60 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.8 }}
//             className="bg-white/10 backdrop-blur rounded-3xl p-8 shadow-xl"
//           >
//             <h3 className="text-xl font-semibold mb-4">
//               Why Organizations Choose Us
//             </h3>
//             <ul className="space-y-3 text-gray-200">
//               <li>✔ Customized Training Modules</li>
//               <li>✔ Live 1-on-1 & Group Sessions</li>
//               <li>✔ Industry-Specific Curriculum</li>
//               <li>✔ Measurable Progress Reports</li>
//             </ul>
//           </motion.div>

//         </div>
//       </section>

//       {/* ================= STATS ================= */}
//       <section className="bg-gray-50 py-16">
//         <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
//           {stats.map((stat, i) => (
//             <motion.div
//               key={i}
//               initial={{ opacity: 0, y: 30 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ delay: i * 0.1 }}
//               className="bg-white rounded-xl p-6 text-center shadow-md"
//             >
//               <h3 className="text-3xl font-bold text-[#0852A1]">
//                 {stat.value}
//               </h3>
//               <p className="text-gray-600 mt-1 text-sm">
//                 {stat.label}
//               </p>
//             </motion.div>
//           ))}
//         </div>
//       </section>

//       {/* ================= PROGRAMS ================= */}
//       <section className="py-20">
//         <div className="max-w-7xl mx-auto px-6">
//           <h2 className="text-3xl font-bold text-center mb-12">
//             Corporate Training Programs
//           </h2>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
//             {programs.map((p, i) => (
//               <motion.div
//                 key={i}
//                 whileHover={{ y: -8 }}
//                 className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition"
//               >
//                 <h3 className="text-lg font-semibold text-[#0852A1]">
//                   {p.title}
//                 </h3>
//                 <p className="text-sm text-gray-600 mt-3">
//                   {p.desc}
//                 </p>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ================= PROCESS ================= */}
//       <section className="bg-[#F8F3F3] py-20">
//         <div className="max-w-7xl mx-auto px-6">
//           <h2 className="text-3xl font-bold text-center mb-12">
//             How It Works
//           </h2>

//           <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//             {[
//               "Needs Assessment",
//               "Custom Program Design",
//               "Live Training Sessions",
//               "Progress Evaluation",
//             ].map((step, i) => (
//               <div
//                 key={i}
//                 className="bg-white rounded-xl p-6 text-center shadow"
//               >
//                 <div className="w-10 h-10 mx-auto rounded-full bg-[#0852A1] text-white flex items-center justify-center font-bold mb-3">
//                   {i + 1}
//                 </div>
//                 <p className="font-medium">{step}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ================= CTA ================= */}
//       <section className="bg-[#0852A1] py-20 text-white text-center">
//         <h2 className="text-3xl font-bold">
//           Upskill Your Workforce with Confidence
//         </h2>
//         <p className="mt-4 text-gray-200 max-w-2xl mx-auto">
//           Partner with The English Raj to build confident, fluent and
//           globally competitive teams.
//         </p>

//         <button
//           onClick={() => navigate("/contact")}
//           className="mt-8 bg-white text-[#0852A1] px-8 py-4 rounded-full font-semibold hover:scale-105 transition"
//         >
//           Contact Our Corporate Team
//         </button>
//       </section>

//     </div>
//   );
// };

// export default Organizations;





import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

/* ================= DATA ================= */

const stats = [
  { value: "500+", label: "Corporate Clients" },
  { value: "25,000+", label: "Professionals Trained" },
  { value: "95%", label: "Improvement Rate" },
  { value: "10+ Years", label: "Training Experience" },
];

const programs = [
  {
    title: "Corporate Spoken English",
    desc: "Build fluency, confidence and workplace communication skills.",
    img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
  },
  {
    title: "Business Communication",
    desc: "Emails, meetings, presentations & global business etiquette.",
    img: "https://images.unsplash.com/photo-1551836022-d5d88e9218df",
  },
  {
    title: "Leadership & Interview Skills",
    desc: "Executive presence, negotiations & leadership communication.",
    img: "https://images.unsplash.com/photo-1552664730-d307ca884978",
  },
  {
    title: "Customer Support Training",
    desc: "Voice & accent, empathy and international customer handling.",
    img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf",
  },
];

const steps = [
  {
    title: "Needs Assessment",
    desc: "We analyze employee skill gaps, roles & communication challenges.",
    icon: "📊",
  },
  {
    title: "Custom Program Design",
    desc: "Industry-specific curriculum aligned with business goals.",
    icon: "🧩",
  },
  {
    title: "Live Training Sessions",
    desc: "Interactive 1-on-1 or group sessions with expert trainers.",
    icon: "🎯",
  },
  {
    title: "Progress Evaluation",
    desc: "Measurable improvement reports & performance insights.",
    icon: "📈",
  },
];



/* ================= COMPONENT ================= */

const Organizations = () => {
  const navigate = useNavigate();
  

  return (
    <div className="w-full overflow-hidden">

      {/* ================= HERO ================= */}
      <section className="bg-gradient-to-r from-[#0B3C66] to-[#0852A1] text-white">
        <div className="max-w-7xl mx-auto px-6 py-28 grid lg:grid-cols-2 gap-12 items-center">

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              English Training for <br />
              <span className="text-[#FFD166]">Organizations & Enterprises</span>
            </h1>

            <p className="mt-6 text-lg text-gray-200 max-w-xl">
              We partner with organizations to transform employee communication,
              leadership presence and global workplace confidence.
            </p>

            <div className="mt-8 flex gap-4">
              <button
                onClick={() => navigate("/login")}
                className="bg-white text-[#0852A1] px-6 py-3 rounded-full font-semibold hover:scale-105 transition"
              >
                Request Corporate Demo
              </button>

              <button
                onClick={() => navigate("/become-tutor")}
                className="border border-white px-6 py-3 rounded-full hover:bg-white hover:text-[#0852A1] transition"
              >
                Partner With Us
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white/10 backdrop-blur rounded-3xl p-8 shadow-xl"
          >
            <h3 className="text-xl font-semibold mb-4">
              Why Organizations Trust Us
            </h3>
            <ul className="space-y-3 text-gray-200">
              <li>✔ Tailored corporate programs</li>
              <li>✔ Certified & industry-expert trainers</li>
              <li>✔ ROI-driven learning outcomes</li>
              <li>✔ Scalable training for teams</li>
            </ul>
          </motion.div>

        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-xl p-6 text-center shadow-md"
            >
              <h3 className="text-3xl font-bold text-[#0852A1]">
                {stat.value}
              </h3>
              <p className="text-gray-600 mt-1 text-sm">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= PROGRAMS WITH IMAGES ================= */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-14">
            Corporate Training Programs
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {programs.map((p, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition"
              >
                <img
                  src={p.img}
                  alt={p.title}
                  className="h-44 w-full object-cover"
                />
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-[#0852A1]">
                    {p.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-3">
                    {p.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS (ANIMATED) ================= */}
      <section className="bg-[#F8F3F3] py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-14">
            How Our Corporate Training Works
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-white rounded-xl p-6 text-center shadow"
              >
                <div className="text-4xl mb-4">
                  {step.icon}
                </div>
                <h4 className="font-semibold mb-2">
                  {step.title}
                </h4>
                <p className="text-sm text-gray-600">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIAL ================= */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.blockquote
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-xl font-medium text-gray-700"
          >
            “The English Raj transformed our leadership communication.
            Our teams are now confident, professional and globally effective.”
          </motion.blockquote>

          <p className="mt-4 text-sm text-gray-500">
            — HR Director, Global IT Company
          </p>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="bg-[#0852A1] py-24 text-white text-center">
        <h2 className="text-3xl font-bold">
          Ready to Transform Your Workforce?
        </h2>
        <p className="mt-4 text-gray-200 max-w-2xl mx-auto">
          Let’s design a corporate English training program tailored to your
          organization’s goals and teams.
        </p>

        <button
          onClick={() => navigate("/contact")}
          className="mt-8 bg-white text-[#0852A1] px-8 py-4 rounded-full font-semibold hover:scale-105 transition"
        >
          Contact Corporate Training Team
        </button>
      </section>

    </div>
  );
};

export default Organizations;
