// import { Link, useNavigate } from "react-router-dom";
// import { useState } from "react";
// import { FiEye, FiEyeOff } from "react-icons/fi";
// import { FcGoogle } from "react-icons/fc";
// import { registerUser } from "@/api/auth.api";

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

//   /* ================= HANDLE INPUT ================= */
//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   /* ================= EMAIL REGISTER ================= */
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       await registerUser(form);

//       navigate("/register-otp", {
//         state: { email: form.email },
//       });
//     } catch (err) {
//       alert(err.response?.data?.message || "Registration failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= GOOGLE REGISTER ================= */
//   const handleGoogleRegister = () => {
//     // Backend Google OAuth endpoint
//     window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
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

//         {/* ================= GOOGLE BUTTON ================= */}
//         {/* <button
//           onClick={handleGoogleRegister}
//           className="w-full flex items-center justify-center gap-3 border py-2 rounded-lg hover:bg-gray-50 transition mb-5"
//         >
//           <FcGoogle size={22} />
//           <span className="font-medium">Continue with Google</span>
//         </button>

//         <div className="flex items-center my-4">
//           <div className="flex-1 border-t"></div>
//           <span className="px-3 text-sm text-gray-400">OR</span>
//           <div className="flex-1 border-t"></div>
//         </div> */}

//         {/* ================= REGISTER FORM ================= */}
//         <form onSubmit={handleSubmit} className="space-y-4">

//           {/* NAME */}
//           <div>
//             <label className="text-sm font-medium">Full Name</label>
//             <input
//               type="text"
//               name="name"
//               required
//               value={form.name}
//               onChange={handleChange}
//               className="w-full mt-1 px-4 py-2 border rounded-lg"
//             />
//           </div>

//           {/* EMAIL */}
//           <div>
//             <label className="text-sm font-medium">Email</label>
//             <input
//               type="email"
//               name="email"
//               required
//               value={form.email}
//               onChange={handleChange}
//               className="w-full mt-1 px-4 py-2 border rounded-lg"
//             />
//           </div>

//           {/* PHONE */}
//           <div>
//             <label className="text-sm font-medium">Phone Number</label>
//             <input
//               type="tel"
//               name="phone"
//               required
//               value={form.phone}
//               onChange={handleChange}
//               className="w-full mt-1 px-4 py-2 border rounded-lg"
//             />
//           </div>

//           {/* PASSWORD */}
//           <div className="relative">
//             <label className="text-sm font-medium">Password</label>
//             <input
//               type={showPassword ? "text" : "password"}
//               name="password"
//               required
//               value={form.password}
//               onChange={handleChange}
//               className="w-full mt-1 px-4 py-2 border rounded-lg pr-10"
//             />
//             <button
//               type="button"
//               className="absolute right-3 top-9 text-gray-500"
//               onClick={() => setShowPassword(!showPassword)}
//             >
//               {showPassword ? <FiEyeOff /> : <FiEye />}
//             </button>
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-[#1e293b] text-white py-2 rounded-lg hover:bg-[#0f172a] transition disabled:opacity-50"
//           >
//             {loading ? "Creating Account..." : "Sign Up"}
//           </button>
//         </form>

//         <p className="text-center text-sm mt-6">
//           Already have an account?{" "}
//           <Link to="/login" className="text-blue-600 hover:underline">
//             Login
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Register;




import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { registerUser } from "@/api/auth.api";
 
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
 
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
 
    try {
      await registerUser(form);
 
      navigate("/register-otp", {
        state: { email: form.email },
      });
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-neutral-50">
 
      {/* LEFT BRAND PANEL */}
      <div className="hidden lg:flex flex-col justify-center px-16  bg-[#0852A1] text-white">
        <h1 className="text-4xl font-semibold leading-tight">
          Create your account
        </h1>
        <p className="mt-4 text-neutral-400 max-w-md text-white">
          Join thousands of learners improving their English with structured
          lessons, expert tutors, and real-world practice.
        </p>
 
        <div className="mt-10 space-y-3 text-lg text-neutral-300 text-white">
          <div>✔ Personalized learning path</div>
          <div>✔ Verified tutors</div>
          <div>✔ Progress tracking</div>
        </div>
      </div>
 
      {/* RIGHT REGISTER PANEL */}
      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white border border-neutral-200 rounded-xl shadow-xl px-8 py-9">
 
          {/* HEADER */}
          <h2 className="text-2xl font-semibold text-neutral-900">
            Sign up
          </h2>
          <p className="text-sm text-neutral-500 mt-1">
            Create an account to get started
          </p>
 
          {/* FORM */}
          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
 
            {/* NAME */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Full name
              </label>
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full h-12 px-4 text-sm
                           border border-neutral-300 rounded-md
                           focus:outline-none focus:ring-2 focus:ring-neutral-900
                           focus:border-neutral-900"
              />
            </div>
 
            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="you@company.com"
                className="w-full h-12 px-4 text-sm
                           border border-neutral-300 rounded-md
                           focus:outline-none focus:ring-2 focus:ring-neutral-900
                           focus:border-neutral-900"
              />
            </div>
 
            {/* PHONE */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Phone number
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={form.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full h-12 px-4 text-sm
                           border border-neutral-300 rounded-md
                           focus:outline-none focus:ring-2 focus:ring-neutral-900
                           focus:border-neutral-900"
              />
            </div>
 
            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full h-12 px-4 pr-12 text-sm
                             border border-neutral-300 rounded-md
                             focus:outline-none focus:ring-2 focus:ring-neutral-900
                             focus:border-neutral-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-800"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
 
            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-md
               bg-[#0852A1]  text-white text-sm font-semibold
                        hover:bg-[#387DC6] transition
                         disabled:opacity-60 cursor-pointer"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>
 
          {/* FOOTER */}
          <p className="text-sm text-neutral-600 mt-6 text-center">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-neutral-900 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
 
export default Register;