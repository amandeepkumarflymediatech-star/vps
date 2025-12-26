import Header from "./Header";
import Footer from "./Footer";
import CoursesPricing from "./CoursesPricing";
import Testimonials from "../pages/Testimonials";

import { Outlet, useLocation } from "react-router-dom";

const MainLayout = () => {
  const location = useLocation();

  // 👉 Pricing section sirf Home page par
  const showPricing = location.pathname === "/";

  // 👉 Testimonials Home + Tutors page par
  const showTestimonials =
    location.pathname === "/" || location.pathname === "/tutors";

  return (
    <>
      <Header />

      <main className="min-h-[80vh]">
        <Outlet />
      </main>

      {/* 👉 Courses Pricing Section (Home page only) */}
      {showPricing && <CoursesPricing />}

       {/* 👉 Testimonials Section */}
      {showTestimonials && <Testimonials />}

      <Footer />
    </>
  );
};

export default MainLayout;
