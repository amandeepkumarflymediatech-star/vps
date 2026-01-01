// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { forgotPassword } from "@/api/auth.api";


// const ForgotPassword = () => {
//   const [email, setEmail] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState("");
//   const [error, setError] = useState("");

//   const navigate = useNavigate();

//   const handleSendOtp = async (e) => {
//     e.preventDefault();

//     setError("");
//     setSuccess("");

//     if (!email) {
//       setError("Email is required");
//       return;
//     }

//     try {
//       setLoading(true);

//       // Call forgot-password API which sends OTP
//       await forgotPassword(email);

//       setSuccess("OTP has been sent to your email");

//       // Redirect to OTP verification page with email
//       setTimeout(() => {
//         navigate("/verify-otp", { state: { email, purpose: 'forgot' } });
//       }, 800);

//     } catch (err) {
//       setError(
//         err?.response?.data?.message || "Failed to send OTP. Try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#F8F3F3] px-4">
//       <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

//         <h2 className="text-2xl font-bold text-center mb-2">
//           Forgot Password 🔐
//         </h2>
//         <p className="text-center text-sm text-gray-500 mb-6">
//           Enter your email to receive OTP
//         </p>

//         {error && (
//           <p className="mb-3 text-sm text-red-600 text-center">{error}</p>
//         )}
//         {success && (
//           <p className="mb-3 text-sm text-green-600 text-center">{success}</p>
//         )}

//         <form onSubmit={handleSendOtp} className="space-y-4">
//           <div>
//             <label className="text-sm font-medium">Email</label>
//             <input
//               type="email"
//               required
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Enter your email"
//               className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0852A1] outline-none"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-[#1e293b] cursor-pointer text-white py-2 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-60"
//           >
//             {loading ? "Sending OTP..." : "Send OTP"}
//           </button>
//         </form>

//         <p className="text-center text-sm mt-6">
//           Remember password?{" "}
//           <Link to="/login" className="text-[#0852A1] font-medium">
//             Login
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default ForgotPassword;





import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword } from "@/api/auth.api";
 
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
 
  const navigate = useNavigate();
 
  const handleSendOtp = async (e) => {
    e.preventDefault();
 
    setError("");
    setSuccess("");
 
    if (!email) {
      setError("Email is required");
      return;
    }
 
    try {
      setLoading(true);
      await forgotPassword(email);
 
      setSuccess("OTP has been sent to your email");
 
      setTimeout(() => {
        navigate("/verify-otp", { state: { email, purpose: "forgot" } });
      }, 800);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to send OTP. Try again."
      );
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-neutral-50">
 
      {/* LEFT PANEL (Brand / Trust) */}
      <div className="hidden lg:flex flex-col justify-center px-16  bg-[#0852A1] text-white">
        <h1 className="text-4xl font-semibold leading-tight">
          Secure access to <br /> your account
        </h1>
        <p className="text-neutral-400 mt-4 max-w-md">
          Reset your password securely using a one-time verification code sent
          directly to your registered email address.
        </p>
 
        <div className="mt-10 space-y-4 text-sm text-neutral-300">
          <div>✔ Encrypted verification</div>
          <div>✔ No password stored</div>
          <div>✔ Secure OTP validation</div>
        </div>
      </div>
 
      {/* RIGHT PANEL (Form) */}
      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white rounded-xl border border-neutral-200 shadow-lg px-8 py-9">
 
          <h2 className="text-2xl font-semibold text-neutral-900">
            Forgot password
          </h2>
          <p className="text-sm text-neutral-500 mt-1">
            Enter your email to receive a verification code
          </p>
 
          {/* Alerts */}
          {error && (
            <div className="mt-5 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
              {error}
            </div>
          )}
 
          {success && (
            <div className="mt-5 rounded-md border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-600">
              {success}
            </div>
          )}
 
          {/* Form */}
          <form onSubmit={handleSendOtp} className="mt-7 space-y-5">
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
                           rounded-md border border-neutral-300
                           focus:outline-none focus:ring-2 focus:ring-neutral-900
                           focus:border-neutral-900"
              />
            </div>
 
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-md text-sm font-semibold
                         bg-[#0852A1] text-white
                         hover:bg-[#0f172a] transition
                         disabled:opacity-60 disabled:cursor-pointer"
            >
              {loading ? "Sending OTP..." : "Send verification code"}
            </button>
          </form>
 
          <p className="text-sm text-neutral-600 mt-6 text-center">
            Remember your password?{" "}
            <Link
              to="/login"
              className="text-neutral-900 font-medium hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
 
export default ForgotPassword;