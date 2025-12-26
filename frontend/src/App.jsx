


import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./components/MainLayout";
import AuthLayout from "./components/AuthLayout";
import ScrollToTop from "./common/ScrollToTop";



// Public Pages
import Home from "./Home/Home";
import Tutors from "./pages/Tutors";

// Auth Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOtp from "./pages/VerifyOtp";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import BecomeTutor from "./pages/BecomeTutor";
import Organizations from "./pages/Organizations";




const App = () => {
  return (
    <BrowserRouter>
          <ScrollToTop />

      <Routes>

        {/* 🌐 Public Pages (Header + Footer) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/tutors" element={<Tutors />} />
            <Route path="/become-tutor" element={<BecomeTutor />} />
            <Route path="/organizations" element={<Organizations />} />


        </Route>

        {/* 🔐 Auth Pages (NO Header / Footer) */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          



        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default App;


