// import { Link, useNavigate } from "react-router-dom";
// import { useState } from "react";
// import { GoogleLogin } from "@react-oauth/google";
// import { jwtDecode } from "jwt-decode";
// import { loginUser, googleLogin } from "../api/auth.api";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import { isGoogleAuthEnabled } from "../utils/googleAuth";

// const Login = () => {
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);

//   /* ================= EMAIL LOGIN ================= */
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const res = await loginUser({ email, password });

//       // save token
//       localStorage.setItem("token", res.data.token);

//       // redirect to dashboard
//       navigate("/dashboard");
//     } catch (err) {
//       alert(err.response?.data?.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= GOOGLE LOGIN ================= */
//   const handleGoogleLogin = async (credentialResponse) => {
//     try {
//       const user = jwtDecode(credentialResponse.credential);

//       const res = await googleLogin({
//         name: user.name,
//         email: user.email,
//         picture: user.picture,
//         googleId: user.sub,
//       });

//       localStorage.setItem("token", res.data.token);

//       navigate("/dashboard");
//     } catch (error) {
//       console.error("Google Login Failed", error);
//       alert("Google login failed");
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

//         {/* ================= LOGIN FORM ================= */}
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
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-3 top-9 text-gray-500"
//             >
//               {showPassword ? <FaEyeSlash /> : <FaEye />}
//             </button>

//             {/* ✅ FORGOT PASSWORD */}
//             <div className="text-right mt-1">
//               <Link
//                 to="/forgot-password"
//                 className="text-sm text-[#0852A1] hover:underline"
//               >
//                 Forgot password?
//               </Link>
//             </div>
//           </div>

//           {/* LOGIN BUTTON */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-[#0852A1] text-white py-2 rounded-lg font-semibold hover:bg-[#063F7C]"
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>

//         {/* ================= GOOGLE LOGIN (if enabled) ================= */}
//         {isGoogleAuthEnabled() && (
//           <>
//             <div className="flex items-center gap-3 my-6">
//               <div className="flex-1 h-px bg-gray-200" />
//               <span className="text-sm text-gray-400">OR</span>
//               <div className="flex-1 h-px bg-gray-200" />
//             </div>

//             <div className="flex justify-center">
//               <GoogleLogin
//                 onSuccess={handleGoogleLogin}
//                 onError={() => alert("Google Login Failed")}
//               />
//             </div>
//           </>
//         )}

//         {/* ================= REGISTER ================= */}
//         <p className="text-center text-sm mt-6">
//           Don’t have an account?{" "}
//           <Link to="/register" className="text-[#0852A1] font-medium hover:underline">
//             Register
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;



import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { loginUser, googleLogin } from "../api/auth.api";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { isGoogleAuthEnabled } from "../utils/googleAuth";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ================= EMAIL LOGIN ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await loginUser({ email, password });

      if (!res.data?.token) {
        throw new Error("Token not received");
      }

      // save token
      localStorage.setItem("token", res.data.token);

      // ensure token is saved before redirect
      setTimeout(() => {
        navigate("/dashboard");
      }, 100);
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= GOOGLE LOGIN ================= */
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const user = jwtDecode(credentialResponse.credential);

      console.log("Google user:", user);

      const res = await googleLogin({
        name: user.name,
        email: user.email,
        picture: user.picture,
        googleId: user.sub,
      });

      console.log("Backend response:", res.data);

      if (!res.data?.token) {
        throw new Error("Token not received from backend");
      }

      localStorage.setItem("token", res.data.token);

      // small delay to avoid auth guard issue
      setTimeout(() => {
        navigate("/dashboard");
      }, 100);
    } catch (error) {
      console.error("Google Login Failed", error);
      alert("Google login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F3F3] px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

        <h2 className="text-2xl font-bold text-center mb-2">
          Welcome Back
        </h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          Login to continue learning
        </p>

        {/* ================= LOGIN FORM ================= */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* EMAIL */}
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded-lg"
            />
          </div>

          {/* PASSWORD */}
          <div className="relative">
            <label className="text-sm font-medium">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded-lg pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>

            {/* FORGOT PASSWORD */}
            <div className="text-right mt-1">
              <Link
                to="/forgot-password"
                className="text-sm text-[#0852A1] hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0852A1] text-white py-2 rounded-lg font-semibold hover:bg-[#063F7C]"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* ================= GOOGLE LOGIN ================= */}
        {isGoogleAuthEnabled() && (
          <>
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-sm text-gray-400">OR</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => alert("Google Login Failed")}
              />
            </div>
          </>
        )}

        {/* REGISTER */}
        <p className="text-center text-sm mt-6">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-[#0852A1] font-medium hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
