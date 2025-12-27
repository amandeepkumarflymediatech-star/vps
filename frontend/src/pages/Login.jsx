import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { loginUser, googleLogin } from "../api/auth.api";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate(); // ✅ added

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  /* EMAIL LOGIN */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await loginUser({ email, password });

      localStorage.setItem("token", res.data.token);

      // ✅ redirect to dashboard
      navigate("/dashboard");

    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  /* GOOGLE LOGIN */
//   const handleGoogleLogin = async (credentialResponse) => {
//     const user = jwtDecode(credentialResponse.credential);

//     try {
//       const res = await googleLogin({
//         name: user.name,
//         email: user.email,
//         picture: user.picture,
//         googleId: user.sub,
//       });

//       localStorage.setItem("token", res.data.token);

//       // ✅ redirect to dashboard
//       navigate("/dashboard");

//     } catch (err) {
//       alert("Google login failed");
//     }
//   };


const handleGoogleLogin = async (credentialResponse) => {
  try {
    const user = jwtDecode(credentialResponse.credential);

    const res = await googleLogin({
      name: user.name,
      email: user.email,
      picture: user.picture,
      googleId: user.sub,
    });

    localStorage.setItem("token", res.data.token);

    // optional: redirect
    // navigate("/dashboard");

  } catch (error) {
    console.error("Google Login Failed", error);
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

        <form onSubmit={handleSubmit} className="space-y-4">
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
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0852A1] text-white py-2 rounded-lg"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-sm text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <div className="flex justify-center">
          <GoogleLogin onSuccess={handleGoogleLogin} />
        </div>

  
        

        <p className="text-center text-sm mt-6">
          Don’t have an account?{" "}
          <Link to="/register" className="text-[#0852A1] font-medium">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;


