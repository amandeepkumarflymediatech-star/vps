// import Header from "./Header";
// import Footer from "./Footer";
// import CoursesPricing from "./CoursesPricing";
// import Testimonials from "../pages/Testimonials";
// import LearningGoal from "../components/LearningGoal";

// import { Outlet, useLocation } from "react-router-dom";

// const MainLayout = () => {
//   const location = useLocation();

//   // 👉 Pricing section sirf Home page par
//   const showPricing = location.pathname === "/";

//   // 👉 Testimonials Home + Tutors page par
//   const showTestimonials =
//     location.pathname === "/" || location.pathname === "/tutors";

//   return (
//     <>
//       <Header />

//       <main className="min-h-[80vh]">
//         <Outlet />
//       </main>

//       {/* 👉 Courses Pricing Section (Home page only) */}
      
//       {showPricing && <CoursesPricing />}
      
//       {LearningGoal && <LearningGoal />}

//        {/* 👉 Testimonials Section */}
//       {showTestimonials && <Testimonials />}

//       <Footer />
//     </>
//   );
// };

// export default MainLayout;


import Header from "./Header";
import Footer from "./Footer";
import CoursesPricing from "./CoursesPricing";
import Testimonials from "../pages/Testimonials";
import LearningGoal from "../components/LearningGoal"; // 👈 add this

import { Outlet, useLocation } from "react-router-dom";

const MainLayout = () => {
  const location = useLocation();

  // 👉 Home page only
  const isHome = location.pathname === "/";

  return (
    <>
      <Header />


      <main className="min-h-[80vh]">
        <Outlet />
      </main>

      {/* 👉 Courses Pricing ONLY on Home */}
      {isHome && <CoursesPricing />}


      {/* 👉 Learning Goal ONLY on Front Page */}
      {isHome && <LearningGoal />}

      {/* 👉 Testimonials Home + Tutors */}
      {(isHome || location.pathname === "/tutors") && <Testimonials />}

      <Footer />
    </>
  );
};

export default MainLayout;
