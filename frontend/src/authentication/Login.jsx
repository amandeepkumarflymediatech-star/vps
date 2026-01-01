// import { Link, useNavigate } from "react-router-dom";
// import { useState } from "react";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import { loginUser } from "@/api/auth.api";

// const Login = () => {
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);

//   /* ================= USER LOGIN ================= */
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const res = await loginUser({ email, password });

//       if (!res.data?.token) {
//         throw new Error("Token not received");
//       }

//       localStorage.setItem("token", res.data.token);

//       setTimeout(() => {
//         navigate("/");
//       }, 100);
//     } catch (err) {
//       if (
//         err.response?.status === 401 &&
//         err.response?.data?.message === "Please verify your email first"
//       ) {
//         navigate("/register-otp", {
//           state: { email },
//         });
//         return;
//       }

//       alert(err.response?.data?.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#F8F3F3] px-4">
//       <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

//         <h2 className="text-2xl font-bold text-center mb-2">
//           Welcome Back
//         </h2>
//         <p className="text-center text-sm text-gray-500 mb-6">
//           Login to continue learning
//         </p>

//         {/* ================= USER LOGIN FORM ================= */}
//         <form onSubmit={handleSubmit} className="space-y-4">

//           {/* EMAIL */}
//           <div>
//             <label className="text-sm font-medium">Email</label>
//             <input
//               type="email"
//               required
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full mt-1 px-4 py-2 border rounded-lg"
//             />
//           </div>

//           {/* PASSWORD */}
//           <div className="relative">
//             <label className="text-sm font-medium">Password</label>
//             <input
//               type={showPassword ? "text" : "password"}
//               required
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full mt-1 px-4 py-2 border rounded-lg pr-10"
//             />
//             <button
//               type="button"
//               className="absolute right-3 top-9 text-gray-500"
//               onClick={() => setShowPassword(!showPassword)}
//             >
//               {showPassword ? <FaEyeSlash /> : <FaEye />}
//             </button>
//           </div>

//           <div className="text-right">
//             <Link
//               to="/forgot-password"
//               className="text-sm text-blue-600 hover:underline"
//             >
//               Forgot Password?
//             </Link>
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-[#1e293b] text-white py-2 rounded-lg hover:bg-[#0f172a] transition disabled:opacity-50"
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>


//         {/* ================= DIVIDER ================= */}
//         <div className="flex items-center my-6">
//           <div className="flex-1 h-px bg-gray-300" />
//           <span className="px-3 text-sm text-gray-400">OR</span>
//           <div className="flex-1 h-px bg-gray-300" />
//         </div>

//         {/* ================= LOGIN AS TUTOR ================= */}
//         <button
//           onClick={() => navigate("/tutor/login")}
//           className="w-full border border-[#1e293b] text-[#1e293b] py-2 rounded-lg cursor-pointer font-semibold hover:bg-[#1e293b] hover:text-white transition"
//         >
//           Login as Tutor
//         </button>

//         <p className="text-center text-sm mt-6">
//           Don't have an account?{" "}
//           <Link to="/register" className="text-blue-600 hover:underline">
//             Sign up
//           </Link>
//         </p>

//       </div>
//     </div>
//   );
// };

// export default Login;




import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { loginUser } from "@/api/auth.api";
 
const Login = () => {
  const navigate = useNavigate();
 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
 
    try {
      const res = await loginUser({ email, password });

            /* ✅ VERY IMPORTANT */
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));  
 
      if (!res.data?.token) {
        throw new Error("Token not received");
      }
 
      localStorage.setItem("token", res.data.token);
 
      setTimeout(() => {
        navigate("/");
      }, 100);
    } catch (err) {
      if (
        err.response?.status === 401 &&
        err.response?.data?.message === "Please verify your email first"
      ) {
        navigate("/register-otp", { state: { email } });
        return;
      }
 
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-neutral-50">
 
      {/* LEFT BRAND PANEL */}
      <div className="hidden lg:flex flex-col justify-center px-16 bg-[#0852A1] text-white">
        <h1 className="text-4xl font-semibold leading-tight">
          Welcome back.
        </h1>
        <p className="mt-4 text-neutral-400 max-w-md text-white">
          Sign in to manage your account, track activity, and access your
          dashboard securely.
        </p>
 
        <div className="mt-10 space-y-3 text-lg text-neutral-500 text-white">
          <div>✔ Secure authentication</div>
          <div>✔ Encrypted credentials</div>
          <div>✔ Trusted by professionals</div>
        </div>
      </div>
 
      {/* RIGHT LOGIN PANEL */}
      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white border border-neutral-200 rounded-xl shadow-xl px-8 py-9">
 
          {/* HEADER */}
          <h2 className="text-2xl font-semibold text-neutral-900">
            Sign in
          </h2>
          <p className="text-sm text-neutral-500 mt-1">
            Enter your credentials to continue
          </p>
 
          {/* FORM */}
          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
 
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full h-12 px-4 text-sm
                           border border-neutral-300 rounded-md
                           focus:outline-none focus:ring-2 focus:ring-neutral-900
                           focus:border-neutral-900"
              />
            </div>
 
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
 
            <div className="flex justify-between items-center">
              <Link
                to="/forgot-password"
                className="text-sm text-neutral-600 hover:text-neutral-900"
              >
                Forgot password?
              </Link>
            </div>
 
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-md
                        bg-[#0852A1] text-white
                         hover:bg-[#387DC6] text-sm font-semibold
                         transition
                         disabled:opacity-60  cursor-pointer"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
 
          {/* FOOTER */}
          <p className="text-sm text-neutral-600 mt-6 text-center">
            Don’t have an account?{" "}
            <Link to="/register" className="font-medium text-neutral-900 hover:underline">
              Create account
            </Link>
          </p>
 
          <button
            onClick={() => navigate("/tutor/login")}
            className="block mx-auto mt-4 text-lg font-bold text-neutral-500 hover:text-neutral-900 cursor-pointer"
          >
            Login as Tutor
          </button>
        </div>
      </div>
    </div>
  );
};
 
export default Login;