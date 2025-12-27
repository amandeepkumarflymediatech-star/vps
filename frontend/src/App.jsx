


// import { BrowserRouter, Routes, Route } from "react-router-dom";

// import MainLayout from "./components/MainLayout";
// import AuthLayout from "./components/AuthLayout";
// import ScrollToTop from "./common/ScrollToTop";



// // Public Pages
// import Home from "./Home/Home";
// import Tutors from "./pages/Tutors";

// // Auth Pages
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import ForgotPassword from "./pages/ForgotPassword";
// import VerifyOtp from "./pages/VerifyOtp"; {/* password reset */}
// import ResetPassword from "./pages/ResetPassword";
// import Dashboard from "./pages/Dashboard";
// import BecomeTutor from "./pages/BecomeTutor";
// import Organizations from "./pages/Organizations";
// import RegisterOtp from "./pages/Registerotp";




// const App = () => {
//   return (
//     <BrowserRouter>
//           <ScrollToTop />

//       <Routes>

//         {/* 🌐 Public Pages (Header + Footer) */}
//         <Route element={<MainLayout />}>
//           <Route path="/" element={<Home />} />
//           <Route path="/tutors" element={<Tutors />} />
//             <Route path="/become-tutor" element={<BecomeTutor />} />
//             <Route path="/organizations" element={<Organizations />} />


//         </Route>

//         {/* 🔐 Auth Pages (NO Header / Footer) */}
//         <Route element={<AuthLayout />}>
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/forgot-password" element={<ForgotPassword />} />
//           <Route path="/verify-otp" element={<VerifyOtp />} />
//           <Route path="/reset-password" element={<ResetPassword />} />
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/register-otp" element={<RegisterOtp />} />

          



//         </Route>

//       </Routes>
//     </BrowserRouter>
//   );
// };

// export default App;


import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./components/MainLayout";
import AuthLayout from "./components/AuthLayout";
import ScrollToTop from "./common/ScrollToTop";

/* ================= PUBLIC PAGES ================= */
import Home from "./Home/Home";
import Tutors from "./pages/Tutors";
import BecomeTutor from "./pages/BecomeTutor";
import Organizations from "./pages/Organizations";

/* ================= AUTH PAGES ================= */
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOtp from "./pages/VerifyOtp"; // password reset
import ResetPassword from "./pages/ResetPassword";
import RegisterOtp from "./pages/Registerotp";

/* ================= DASHBOARD ================= */
import DashboardLayout from "./dashboard/layout/DashboardLayout";
import DashboardHome from "./dashboard/pages/DashboardHome";
import Profile from "./dashboard/pages/Profile";
import BookNow from "./dashboard/pages/BookNow";
import TutorsDashboard from "./dashboard/pages/Tutors";
import TutorProfile from "./dashboard/pages/TutorProfile";
import Payments from "./dashboard/pages/Payments";
import Faq from "./dashboard/pages/Faq";

const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        {/* 🌐 PUBLIC PAGES (Header + Footer) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/tutors" element={<Tutors />} />
          <Route path="/become-tutor" element={<BecomeTutor />} />
          <Route path="/organizations" element={<Organizations />} />
        </Route>

        {/* 🔐 AUTH PAGES (NO Header / Footer) */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register-otp" element={<RegisterOtp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* 🚀 DASHBOARD (JWT PROTECTED) */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="profile" element={<Profile />} />
          <Route path="book" element={<BookNow />} />
          <Route path="tutors" element={<TutorsDashboard />} />
          <Route path="tutors/:id" element={<TutorProfile />} />
          <Route path="payments" element={<Payments />} />
          <Route path="faq" element={<Faq />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;


