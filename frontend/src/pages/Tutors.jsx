import { useState } from "react";
import { Search } from "lucide-react";
import tutorImg from "../assets/tutor.png";
import { Link } from "react-router-dom";
import tutorheroImg from "../assets/tutorimg.jpg";


/* ================= TUTORS DATA ================= */
const tutorsData = [
  {
    id: 1,
    name: "Radhika Bansal",
    rating: "4.7",
    sessions: "2008 Sessions",
    image: "https://i.pravatar.cc/500?img=47",
    skills: ["Business English", "IELTS Speaking", "Interview Skills"],
  },
  {
    id: 2,
    name: "Niti",
    rating: "4.8",
    sessions: "2211 Sessions",
    image: "https://i.pravatar.cc/500?img=12",
    skills: ["Business English", "Interview Skills", "Vocabulary"],
  },
  {
    id: 3,
    name: "Aisha",
    rating: "4.8",
    sessions: "4044 Sessions",
    image: "https://i.pravatar.cc/500?img=32",
    skills: ["Public Speaking", "Business English", "Interview Skills"],
  },
];

/* ================= FAQ DATA ================= */
const faqs = [
  {
    question: "Who can become a tutor at The English Raj?",
    answer:
      "Anyone with strong English communication skills and teaching experience can apply.",
  },
  {
    question: "Can I choose my own tutor?",
    answer:
      "Yes, learners can browse tutor profiles and select the tutor they prefer.",
  },
  {
    question: "Are sessions really one-on-one?",
    answer:
      "Yes, all sessions are live, private, and fully personalized.",
  },
  {
    question: "Can tutors choose their teaching schedule?",
    answer:
      "Yes, tutors have complete flexibility to set their availability.",
  },
  {
    question: "Do tutors provide feedback after sessions?",
    answer:
      "Yes, learners receive structured feedback after every session.",
  },
];

const Tutors = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [search, setSearch] = useState("");

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredTutors = tutorsData.filter(
    (tutor) =>
      tutor.name.toLowerCase().includes(search.toLowerCase()) ||
      tutor.skills.join(" ").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full">

      {/* ================= HERO SECTION ================= */}
      <div className="relative bg-[#F8F3F3]">
        <div className="max-w-7xl mx-auto px-4 py-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

          {/* LEFT CONTENT */}
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
              Tutors that ensure,
              <br />
              <span className="text-[#0852A1]">
                you Speak English Fluently!
              </span>
            </h1>

            <ul className="mt-6 space-y-3 text-gray-600 text-lg">
              <li>✔ Live 1:1 Sessions</li>
              <li>✔ Learn at your convenience</li>
              <li>✔ Risk-Free Trial</li>
            </ul>

            
               <Link to="/login">
  <button className="mt-8 px-6 py-3 bg-[#0852A1] text-white rounded-lg font-semibold hover:bg-[#063F7C] transition">
    Book a Free Trial
  </button>
</Link>
          </div>


          {/* RIGHT IMAGE */}
          <div className="flex justify-center">
            <img
              src={tutorheroImg}
              alt="Tutors"
              className="max-w-md w-full shadow-xl border-round"
            />
          </div>
        </div>
      </div>

      {/* ================= TUTORS SECTION ================= */}
      <div className="max-w-7xl mx-auto px-4 py-20">

        {/* HEADER + SEARCH */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-14">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Our Friendly & Expert Tutors
            </h2>
            <p className="text-2xl font-bold text-purple-600 mt-2">
              Pick from 100+ Tutors
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by tutor name and skills"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full border focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* TUTOR CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredTutors.map((tutor) => (
            <div
              key={tutor.id}
              className="bg-white rounded-3xl shadow-md hover:shadow-xl transition overflow-hidden"
            >
              <div className="h-64 w-full overflow-hidden">
                <img
                  src={tutor.image}
                  alt={tutor.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 text-center">
                <h3 className="text-lg font-bold">{tutor.name}</h3>

                <div className="flex justify-center items-center gap-3 mt-2 text-sm">
                  <span className="text-orange-500 font-medium">
                    ⭐ {tutor.rating}
                  </span>
                  <span className="text-gray-500">| {tutor.sessions}</span>
                </div>

                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {tutor.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 border rounded-full text-xs text-gray-600"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
 <Link to="/login">
                <button className="mt-6 w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-full font-semibold transition">
                  Schedule Trial
                </button>
                </Link>

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= FAQ SECTION ================= */}
      <div className="bg-[#F8F3F3] py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12">
            Frequently Asked Questions
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 cursor-pointer bg-white shadow-sm"
                  onClick={() => toggleFAQ(index)}
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-gray-800">
                      {faq.question}
                    </h4>
                    <span className="text-xl text-[#0852A1]">
                      {openIndex === index ? "−" : "+"}
                    </span>
                  </div>

                  {openIndex === index && (
                    <p className="mt-3 text-gray-600 text-sm">
                      {faq.answer}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-center">
              <img
                src={tutorImg}
                alt="FAQ Tutor"
                className="rounded-xl shadow-lg max-w-md w-full"
              />
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};

export default Tutors;
