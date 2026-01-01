// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";

// /* ================= DATA ================= */

// const stats = [
//   // { value: "500+", label: "Corporate Clients" },
//   // { value: "25,000+", label: "Professionals Trained" },
//   { value: "95%", label: "Improvement Rate" },
//   { value: "10+ Years", label: "Training Experience" },
// ];

// const programs = [

//   {
//     title: "Leadership & Interview Skills",
//     desc: "Executive presence, negotiations & leadership communication.",
//     img: "https://images.unsplash.com/photo-1552664730-d307ca884978",
//   },
//   {
//     title: "Customer Support Training",
//     desc: "Voice & accent, empathy and international customer handling.",
//     img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf",
//   },
// ];

// const steps = [
//   {
//     title: "Needs Assessment",
//     desc: "We analyze employee skill gaps, roles & communication challenges.",
//     icon: "📊",
//   },
//   {
//     title: "Custom Program Design",
//     desc: "Industry-specific curriculum aligned with business goals.",
//     icon: "🧩",
//   },
//   {
//     title: "Live Training Sessions",
//     desc: "Interactive 1-on-1 or group sessions with expert trainers.",
//     icon: "🎯",
//   },
//   {
//     title: "Progress Evaluation",
//     desc: "Measurable improvement reports & performance insights.",
//     icon: "📈",
//   },
// ];



// /* ================= COMPONENT ================= */

// const Organizations = () => {
//   const navigate = useNavigate();
  

//   return (
//     <div className="w-full overflow-hidden">

//       {/* ================= HERO ================= */}
//       <section className="bg-gradient-to-r from-[#0B3C66] to-[#0852A1] text-white">
//         <div className="max-w-7xl mx-auto px-6 py-28 grid lg:grid-cols-2 gap-12 items-center">

//           <motion.div
//             initial={{ opacity: 0, y: 40 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//           >
//             <h1 className="text-4xl md:text-5xl font-bold leading-tight">
//               English Training for <br />
//               <span className="text-[#FFD166]">Organizations & Enterprises</span>
//             </h1>

//             <p className="mt-6 text-lg text-gray-200 max-w-xl">
//               We partner with organizations to transform employee communication,
//               leadership presence and global workplace confidence.
//             </p>

//             <div className="mt-8 flex gap-4">
//               <button
//                 onClick={() => navigate("/login")}
//                 className="bg-white text-[#0852A1] px-6 py-3 rounded-full font-semibold hover:scale-105 transition"
//               >
//                 Request Corporate Demo
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
//               Why Organizations Trust Us
//             </h3>
//             <ul className="space-y-3 text-gray-200">
//               <li>✔ Tailored corporate programs</li>
//               <li>✔ Certified & industry-expert trainers</li>
//               <li>✔ ROI-driven learning outcomes</li>
//               <li>✔ Scalable training for teams</li>
//             </ul>
//           </motion.div>

//         </div>
//       </section>

//       {/* ================= STATS ================= */}
//       <section className="bg-gray-50 py-20">
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

//       {/* ================= PROGRAMS WITH IMAGES ================= */}
//       <section className="py-24">
//         <div className="max-w-7xl mx-auto px-6">
//           <h2 className="text-3xl font-bold text-center mb-14">
//             Corporate Training Programs
//           </h2>

//           <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
//             {programs.map((p, i) => (
//               <motion.div
//                 key={i}
//                 whileHover={{ y: -10 }}
//                 className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition"
//               >
//                 <img
//                   src={p.img}
//                   alt={p.title}
//                   className="h-44 w-full object-cover"
//                 />
//                 <div className="p-6">
//                   <h3 className="text-lg font-semibold text-[#0852A1]">
//                     {p.title}
//                   </h3>
//                   <p className="text-sm text-gray-600 mt-3">
//                     {p.desc}
//                   </p>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ================= HOW IT WORKS (ANIMATED) ================= */}
//       <section className="bg-[#F8F3F3] py-24">
//         <div className="max-w-7xl mx-auto px-6">
//           <h2 className="text-3xl font-bold text-center mb-14">
//             How Our Corporate Training Works
//           </h2>

//           <div className="grid md:grid-cols-4 gap-8">
//             {steps.map((step, i) => (
//               <motion.div
//                 key={i}
//                 initial={{ opacity: 0, y: 40 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: i * 0.15 }}
//                 className="bg-white rounded-xl p-6 text-center shadow"
//               >
//                 <div className="text-4xl mb-4">
//                   {step.icon}
//                 </div>
//                 <h4 className="font-semibold mb-2">
//                   {step.title}
//                 </h4>
//                 <p className="text-sm text-gray-600">
//                   {step.desc}
//                 </p>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ================= TESTIMONIAL ================= */}
//       <section className="py-24 bg-white">
//         <div className="max-w-4xl mx-auto px-6 text-center">
//           <motion.blockquote
//             initial={{ opacity: 0, scale: 0.9 }}
//             whileInView={{ opacity: 1, scale: 1 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.6 }}
//             className="text-xl font-medium text-gray-700"
//           >
//             “The English Raj transformed our leadership communication.
//             Our teams are now confident, professional and globally effective.”
//           </motion.blockquote>

//           <p className="mt-4 text-sm text-gray-500">
//             — HR Director, Global IT Company
//           </p>
//         </div>
//       </section>

//       {/* ================= FINAL CTA ================= */}
//       <section className="bg-[#0852A1] py-24 text-white text-center">
//         <h2 className="text-3xl font-bold">
//           Ready to Transform Your Workforce?
//         </h2>
//         <p className="mt-4 text-gray-200 max-w-2xl mx-auto">
//           Let’s design a corporate English training program tailored to your
//           organization’s goals and teams.
//         </p>

//         <button
//           onClick={() => navigate("/contact")}
//           className="mt-8 bg-white text-[#0852A1] px-8 py-4 rounded-full font-semibold hover:scale-105 transition"
//         >
//           Contact Corporate Training Team
//         </button>
//       </section>

//     </div>
//   );
// };

// export default Organizations;

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronRight, CheckCircle2, BarChart3, Users2, Award, Zap } from "lucide-react";

/* ================= DATA ================= */

const stats = [
  { value: "95%", label: "Improvement Rate", icon: <Zap className="w-5 h-5" /> },
  { value: "10+ Yrs", label: "Expertise", icon: <Award className="w-5 h-5" /> },
  { value: "50+", label: "Modules", icon: <BarChart3 className="w-5 h-5" /> },
  { value: "24/7", label: "Support", icon: <Users2 className="w-5 h-5" /> },
];

const programs = [
  {
    title: "Executive Presence & Leadership",
    desc: "Refine high-stakes negotiation skills, boardroom communication, and global leadership etiquette for your C-suite and management.",
    img: "https://images.unsplash.com/photo-1552664730-d307ca884978",
    tags: ["Leadership", "Public Speaking"],
  },
  {
    title: "Global Customer Excellence",
    desc: "Equip your frontline teams with voice & accent neutralization, cross-cultural empathy, and professional conflict resolution.",
    img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf",
    tags: ["Support", "Soft Skills"],
  },
];

const steps = [
  { title: "Audit", desc: "Deep dive into your team's communication gaps.", icon: "01" },
  { title: "Curate", desc: "Custom curriculum designed for your industry.", icon: "02" },
  { title: "Deploy", desc: "Live sessions led by world-class instructors.", icon: "03" },
  { title: "Measure", desc: "Data-backed ROI and performance reporting.", icon: "04" },
];

/* ================= COMPONENT ================= */

const Organizations = () => {
  const navigate = useNavigate();
  
  // 1. Check if user is logged in (Assuming token-based auth)
  const isLoggedIn = !!localStorage.getItem("token");

  // 2. Navigation Handler
  const handleDemoClick = () => {
    if (isLoggedIn) {
      // If logged in, go to the demo booking form or dashboard
      navigate("/contact"); 
    } else {
      // If not logged in, go to login
      navigate("/login");
    }
  };

  return (
    <div className="w-full bg-white text-slate-900 font-sans">
      
      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-slate-50">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#0852A1]/5 -skew-x-12 transform translate-x-1/4" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-700 text-sm font-bold tracking-wide uppercase mb-6">
                Enterprise Solutions
              </span>
              <h1 className="text-5xl md:text-5xl font-extrabold text-slate-900 leading-[1.1]">
                Empower Your Team with <span className="text-[#0852A1]">Global Fluency.</span>
              </h1>
              <p className="mt-8 text-xl text-slate-600 leading-relaxed">
                We bridge the communication gap for modern enterprises. From executive coaching to large-scale customer support training.
              </p>
              
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                {/* UPDATED BUTTON LOGIC */}
                <button
                  onClick={handleDemoClick}
                  className="flex items-center justify-center gap-2 bg-[#0852A1] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#063d7a] transition-all shadow-lg shadow-blue-900/20"
                >
                  Book Corporate Demo <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigate("/contact")}
                  className="flex items-center justify-center gap-2 border-2 border-slate-200 bg-white text-slate-700 px-8 py-4 rounded-xl font-bold hover:bg-slate-50 transition-all"
                >
                  View Case Studies
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" 
                  alt="Team Training" 
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
              </div>
              
              <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 hidden md:block">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-full text-green-600">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">100%</p>
                    <p className="text-sm text-slate-500">Curriculum Customization</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ... (Stats and Programs sections remain the same) ... */}

      {/* ================= CTA SECTION ================= */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-[#0852A1] rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">
                Ready to elevate your <br className="hidden md:block" /> organization's voice?
              </h2>
              <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
                Join 500+ forward-thinking companies already using our training to scale their global operations.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button onClick={() => navigate("/contact")} className="bg-white text-[#0852A1] px-10 py-4 rounded-2xl font-bold hover:shadow-xl transition-all">
                  Contact Sales Team
                </button>
                {/* UPDATED CTA BUTTON LOGIC */}
                <button onClick={() => navigate("/demo")} className="bg-blue-600/30 text-white backdrop-blur-sm border border-white/20 px-10 py-4 rounded-2xl font-bold hover:bg-blue-600/40 transition-all">
                  Request a Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Organizations;