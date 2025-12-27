import { Link } from "react-router-dom";



const courses = [
  
  {
    title: "Business English",
    price: "39.99",
    badge: false,
    features: [
      "Improve professional communication skills",
      "Learn office meeting vocabulary",
      "Master email and presentation skills",
      "Build confident workplace conversations",
      "Practice real business scenarios",
    ],
  },
  {
    title: "Interview Preparation",
    price: "39.99",
    badge: true, // ⭐ MOST POPULAR
    features: [
      "Ace job interviews confidently",
      "Practice common HR questions",
      "Improve fluency and clarity",
      "Receive expert feedback",
      "Boost career opportunities",
    ],
  },
  {
    title: "IELTS Speaking",
    price: "39.99",
    badge: false,
    features: [
      "Improve IELTS speaking scores",
      "Practice exam-style questions",
      "Learn structured answers",
      "Get pronunciation correction",
      "Build exam confidence",
    ],
  },
];

const CoursesPricing = () => {
  return (
    <div className="bg-[#F8F3F3] py-20">
      <div className="max-w-7xl mx-auto px-4">

        {/* ===== HEADER ===== */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Professional English Courses Designed <br />
            for Real Success.
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            The English Raj offers specialized English courses designed for
            personal, academic, and professional goals. Each course focuses on
            real-life communication, expert guidance, and measurable progress.
          </p>
        </div>

        {/* ===== PRICING CARDS ===== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl shadow-lg p-8 text-center border 
              ${course.badge ? "border-[#0852A1] scale-105" : "border-gray-200"}`}
            >
              {/* BADGE */}
              {course.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0852A1] text-white text-xs px-3 py-1 rounded-full font-semibold">
                  Most Popular
                </span>
              )}

              {/* TITLE */}
              <h3 className="text-xl font-bold text-gray-800 mb-6">
                {course.title}
              </h3>

              {/* PRICE */}
              <div className="mb-6">
                <span className="text-sm align-top">$</span>
                <span className="text-4xl font-bold">{course.price}</span>
                <span className="text-sm text-gray-500"> / monthly</span>
              </div>

              {/* FEATURES */}
              <ul className="space-y-3 text-sm text-gray-600 text-left mb-8">
                {course.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#0852A1] font-bold">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* BUTTON */}
              {/* <button className="w-full border border-[#0852A1] text-[#0852A1] py-2 rounded-full font-semibold hover:bg-[#0852A1] hover:text-white transition">
                Buy Now
              </button> */}

   <Link to="/login">
  <button className="w-full border border-[#0852A1] text-[#0852A1] py-2 rounded-full font-semibold hover:bg-[#0852A1] hover:text-white transition">
    Buy Now
  </button>
</Link>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default CoursesPricing;
