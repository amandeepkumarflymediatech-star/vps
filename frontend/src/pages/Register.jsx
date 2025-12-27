// import { Link, useNavigate } from "react-router-dom";
// import { GoogleLogin } from "@react-oauth/google";
// import { jwtDecode } from "jwt-decode";
// import { useState } from "react";
// import { FiEye, FiEyeOff } from "react-icons/fi";
// import { registerUser } from "../api/auth.api";
// import { sendOtp } from "../api/otp.api";
// import { isGoogleAuthEnabled } from "../utils/googleAuth";

// const Register = () => {
//   const navigate = useNavigate();
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     password: "",
//   });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       // 1️⃣ Register User
//       const res = await registerUser(form);

//       // 2️⃣ If success → Send OTP
//       if (res.data?.message === "Registered successfully") {
//         await sendOtp({ email: form.email });

//         // 3️⃣ Redirect to OTP page
//         navigate("/register-otp", {
//           state: { email: form.email },
//         });
//       }
//     } catch (err) {
//       alert(err.response?.data?.message || "Registration failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleRegister = (credentialResponse) => {
//     const user = jwtDecode(credentialResponse.credential);
//     console.log("Google user:", user);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#F8F3F3] px-4">
//       <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

//         <h2 className="text-3xl font-bold text-center mb-2">
//           Create Account
//         </h2>
//         <p className="text-center text-md text-gray-600 mb-6">
//           Start your journey to fluent English
//         </p>

//         <form onSubmit={handleSubmit} className="space-y-4">

//           <div>
//             <label className="text-sm font-medium">Full Name</label>
//             <input
//               name="name"
//               required
//               value={form.name}
//               onChange={handleChange}
//               type="text"
//               className="w-full mt-1 px-4 py-2 border rounded-lg"
//             />
//           </div>

//           <div>
//             <label className="text-sm font-medium">Email</label>
//             <input
//               name="email"
//               required
//               value={form.email}
//               onChange={handleChange}
//               type="email"
//               className="w-full mt-1 px-4 py-2 border rounded-lg"
//             />
//           </div>

//           <div>
//             <label className="text-sm font-medium">Phone</label>
//             <input
//               name="phone"
//               required
//               pattern="^[0-9]{10,15}$"
//               maxLength={15}
//               value={form.phone}
//               onChange={handleChange}
//               type="tel"
//               className="w-full mt-1 px-4 py-2 border rounded-lg"
//             />
//           </div>

//           <div>
//             <label className="text-sm font-medium">Password</label>
//             <div className="relative">
//               <input
//                 name="password"
//                 required
//                 value={form.password}
//                 onChange={handleChange}
//                 type={showPassword ? "text" : "password"}
//                 className="w-full mt-1 px-4 py-2 border rounded-lg pr-10"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-1/2 -translate-y-1/2"
//               >
//                 {showPassword ? <FiEyeOff /> : <FiEye />}
//               </button>
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-[#0852A1] text-white py-2 rounded-lg"
//           >
//             {loading ? "Sending OTP..." : "Register"}
//           </button>
//         </form>

//         {/* ================= GOOGLE REGISTER (if enabled) ================= */}
//         {isGoogleAuthEnabled() && (
//           <>
//             <div className="my-6 text-center">OR</div>
//             <div className="flex justify-center">
//               <GoogleLogin
//                 onSuccess={handleGoogleRegister}
//                 onError={() => console.log("Google Register Failed")}
//               />
//             </div>
//           </>
//         )}

//         <p className="text-center text-sm mt-6">
//           Already have an account?{" "}
//           <Link to="/login" className="text-[#0852A1]">
//             Login
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Register;



import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { registerUser, googleLogin } from "../api/auth.api";
import { sendOtp } from "../api/otp.api";
import { isGoogleAuthEnabled } from "../utils/googleAuth";

const Register = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  /* ================= HANDLE INPUT ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= EMAIL REGISTER ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1️⃣ Register user
      const res = await registerUser(form);

      if (!res.data?.message) {
        throw new Error("Registration failed");
      }

      // 2️⃣ Send OTP
      await sendOtp({ email: form.email });

      // 3️⃣ Redirect to OTP verification
      navigate("/register-otp", {
        state: { email: form.email },
      });
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= GOOGLE REGISTER ================= */
  const handleGoogleRegister = async (credentialResponse) => {
    try {
      const user = jwtDecode(credentialResponse.credential);

      console.log("Google user:", user);

      const res = await googleLogin({
        name: user.name,
        email: user.email,
        picture: user.picture,
        googleId: user.sub,
      });

      if (!res.data?.token) {
        throw new Error("Token not received");
      }

      localStorage.setItem("token", res.data.token);

      // small delay for auth guard
      setTimeout(() => {
        navigate("/dashboard");
      }, 100);
    } catch (error) {
      console.error("Google Register Failed", error);
      alert("Google registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F3F3] px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

        <h2 className="text-3xl font-bold text-center mb-2">
          Create Account
        </h2>
        <p className="text-center text-md text-gray-600 mb-6">
          Start your journey to fluent English
        </p>

        {/* ================= REGISTER FORM ================= */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* NAME */}
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <input
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              type="text"
              className="w-full mt-1 px-4 py-2 border rounded-lg"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              type="email"
              className="w-full mt-1 px-4 py-2 border rounded-lg"
            />
          </div>

          {/* PHONE */}
          <div>
            <label className="text-sm font-medium">Phone</label>
            <input
              name="phone"
              required
              pattern="^[0-9]{10,15}$"
              maxLength={15}
              value={form.phone}
              onChange={handleChange}
              type="tel"
              className="w-full mt-1 px-4 py-2 border rounded-lg"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm font-medium">Password</label>
            <div className="relative">
              <input
                name="password"
                required
                value={form.password}
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                className="w-full mt-1 px-4 py-2 border rounded-lg pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0852A1] text-white py-2 rounded-lg font-semibold hover:bg-[#063F7C]"
          >
            {loading ? "Sending OTP..." : "Register"}
          </button>
        </form>

        {/* ================= GOOGLE REGISTER ================= */}
        {isGoogleAuthEnabled() && (
          <>
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-sm text-gray-400">OR</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleRegister}
                onError={() => alert("Google Register Failed")}
              />
            </div>
          </>
        )}

        {/* LOGIN LINK */}
        <p className="text-center text-sm mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#0852A1] font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
