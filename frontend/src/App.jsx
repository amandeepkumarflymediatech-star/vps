
// import { Routes, Route } from "react-router-dom";

// import MainLayout from "./components/MainLayout";
// import AuthLayout from "./components/AuthLayout";
// import ScrollToTop from "./common/ScrollToTop";

// /* ================= PUBLIC PAGES ================= */
// import Home from "./pages/Home";   // ✅ FIXED
// import Tutors from "./pages/Tutors";
// import BecomeTutor from "./pages/BecomeTutor";
// import Organizations from "./pages/Organizations";

// /* ================= AUTH PAGES ================= */
// import Login from "./authentication/Login";
// import Register from "./authentication/Register";
// import ForgotPassword from "./authentication/ForgotPassword";
// import VerifyOtp from "./authentication/VerifyOtp";
// import ResetPassword from "./authentication/ResetPassword";
// import RegisterOtp from "./authentication/Registerotp";

// /* TUTOR */
// import TutorLogin from "@/tutor/pages/TutorLogin";



// // ================= admin =================
// import AdminLayout from "./layouts/AdminLayout";
// import ProtectedRoute from "./common/ProtectedRoute";


// const App = () => {
//   return (
//     <>
//       <ScrollToTop />
//       <Routes>  {/* ✅ Sirf Routes - NO BrowserRouter */}
//         {/* 🌐 PUBLIC PAGES (Header + Footer) */}
//         <Route element={<MainLayout />}>
//           <Route path="/" element={<Home />} />
//           <Route path="/tutors" element={<Tutors />} />
//           <Route path="/become-tutor" element={<BecomeTutor />} />
//           <Route path="/organizations" element={<Organizations />} />
//         </Route>

//         {/* 🔐 AUTH PAGES (NO Header / Footer) */}
//         <Route element={<AuthLayout />}>
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/register-otp" element={<RegisterOtp />} />
//           <Route path="/forgot-password" element={<ForgotPassword />} />
//           <Route path="/verify-Otp" element={<VerifyOtp />} />
//           <Route path="/reset-password" element={<ResetPassword />} />
//         </Route>



//       {/* TUTOR */}
//       <Route path="/tutor/login" element={<TutorLogin />} />

//         <Route
//           path="/admin*"
//           element={
//             <ProtectedRoute role="admin">
//               <AdminLayout />
//             </ProtectedRoute>
//           }
//         />

//       </Routes>
//     </>
//   );
// };

// export default App;







// import { Routes, Route } from "react-router-dom";

// import MainLayout from "./components/MainLayout";
// import AuthLayout from "./components/AuthLayout";
// import ScrollToTop from "./common/ScrollToTop";

// /* ================= PUBLIC PAGES ================= */
// import Home from "./pages/Home";
// import Tutors from "./pages/Tutors";
// import BecomeTutor from "./pages/BecomeTutor";
// import Organizations from "./pages/Organizations";
// import contact from "./pages/contact";
// import demo from "./pages/demo";
// /* ================= AUTH PAGES ================= */
// import Login from "./authentication/Login";
// import Register from "./authentication/Register";
// import ForgotPassword from "./authentication/ForgotPassword";
// import VerifyOtp from "./authentication/VerifyOtp";
// import ResetPassword from "./authentication/ResetPassword";
// import RegisterOtp from "./authentication/Registerotp";

// /* TUTOR */
// import TutorLogin from "@/tutor/pages/TutorLogin";

// import DashboardRedirect from "./pages/DashboardRedirect";




// /* ADMIN */
// import AdminLayout from "./layouts/AdminLayout";
// import ProtectedRoute from "./common/ProtectedRoute";

// const App = () => {
//   return (
//     <>
//       <ScrollToTop />
//       <Routes>
//         {/* 🌐 PUBLIC */}
//         <Route element={<MainLayout />}>
//           <Route path="/" element={<Home />} />
//           <Route path="/tutors" element={<Tutors />} />
//           <Route path="/become-tutor" element={<BecomeTutor />} />
//           <Route path="/organizations" element={<Organizations />} />
//           <Route path="/contact" element={<contact />} />
//           <Route path="/demo" element={<demo />} />
//         </Route>

//         {/* 🔐 AUTH */}
//         <Route element={<AuthLayout />}>
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/register-otp" element={<RegisterOtp />} />
//           <Route path="/forgot-password" element={<ForgotPassword />} />
//           <Route path="/verify-otp" element={<VerifyOtp />} />
//           <Route path="/reset-password" element={<ResetPassword />} />
//         </Route>


//   {/* DASHBOARD REDIRECT */}
//   <Route path="/dashboard" element={<DashboardRedirect />} />

//   {/* DASHBOARD REDIRECT */}
//         {/* 👨‍🏫 TUTOR */}
//         <Route path="/tutor/login" element={<TutorLogin />} />

//         {/* 🛡️ ADMIN */}
//         <Route
//           path="/admin/*"
//           element={
//             <ProtectedRoute role="admin">
//               <AdminLayout />
//             </ProtectedRoute>
//           }
//         />
//       </Routes>
//     </>
//   );
// };

// export default App;




import { Routes, Route } from "react-router-dom";

import MainLayout from "./components/MainLayout";
import AuthLayout from "./components/AuthLayout";
import ScrollToTop from "./common/ScrollToTop";

/* ================= PUBLIC PAGES ================= */
import Home from "./pages/Home";
import Tutors from "./pages/Tutors";
import BecomeTutor from "./pages/BecomeTutor";
import Organizations from "./pages/Organizations";
import Contact from "./pages/contact";
import Demo from "./pages/demo";

/* ================= AUTH PAGES ================= */
import Login from "./authentication/Login";
import Register from "./authentication/Register";
import ForgotPassword from "./authentication/ForgotPassword";
import VerifyOtp from "./authentication/VerifyOtp";
import ResetPassword from "./authentication/ResetPassword";
import RegisterOtp from "./authentication/Registerotp";

/* ================= TUTOR ================= */
import TutorLogin from "@/tutor/pages/TutorLogin";

/* ================= DASHBOARD ================= */
import DashboardRedirect from "./pages/DashboardRedirect";

/* ================= ADMIN ================= */
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./common/ProtectedRoute";

const App = () => {
  return (
    <>
      <ScrollToTop />

      <Routes>
        {/* 🌐 PUBLIC ROUTES */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/tutors" element={<Tutors />} />
          <Route path="/become-tutor" element={<BecomeTutor />} />
          <Route path="/organizations" element={<Organizations />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/demo" element={<Demo />} />
        </Route>

        {/* 🔐 AUTH ROUTES */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register-otp" element={<RegisterOtp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* 🔁 DASHBOARD REDIRECT */}
        <Route path="/dashboard" element={<DashboardRedirect />} />

        {/* 👨‍🏫 TUTOR */}
        <Route path="/tutor/login" element={<TutorLogin />} />

        {/* 🛡️ ADMIN */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
