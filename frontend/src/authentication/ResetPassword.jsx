// import { useState } from "react";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import { useNavigate, useLocation } from "react-router-dom";
// import { resetPassword } from "@/api/auth.api";


// const ResetPassword = () => {
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const navigate = useNavigate();
//   const { state } = useLocation();
//   const email = state?.email;
//   const otp = state?.otp;

//   const handleReset = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     if (!email || !otp) {
//       setError("Session expired. Please start over.");
//       setTimeout(() => navigate("/forgot-password"), 2000);
//       return;
//     }

//     if (password.length < 6) {
//       setError("Password must be at least 6 characters");
//       return;
//     }

//     if (password !== confirmPassword) {
//       setError("Passwords do not match");
//       return;
//     }

//     try {
//       setLoading(true);

//       // Send email, otp, and newPassword to backend
//       await resetPassword({ email, otp, newPassword: password });

//       setSuccess("Password updated successfully. Redirecting to login...");

//       setPassword("");
//       setConfirmPassword("");

//       // Redirect to login after 2 seconds
//       setTimeout(() => {
//         navigate("/login");
//       }, 2000);

//     } catch (err) {
//       setError(err?.response?.data?.message || "Failed to reset password");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#F8F3F3] px-4">
//       <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

//         <h2 className="text-2xl font-bold text-center mb-2">
//           Reset Password 🔑
//         </h2>
//         <p className="text-center text-sm text-gray-500 mb-6">
//           Create a new secure password
//         </p>

//         {error && (
//           <p className="text-red-600 text-sm text-center mb-4">{error}</p>
//         )}
//         {success && (
//           <p className="text-green-600 text-sm text-center mb-4">{success}</p>
//         )}

//         <form onSubmit={handleReset} className="space-y-4">

//           {/* New Password */}
//           <div className="relative">
//             <label className="text-sm font-medium">New Password</label>
//             <input
//               type={showPassword ? "text" : "password"}
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Enter new password"
//               className="w-full mt-1 px-4 py-2 border rounded-lg pr-10"
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-3 top-9 text-gray-500"
//             >
//               {showPassword ? <FaEyeSlash /> : <FaEye />}
//             </button>
//           </div>

//           {/* Confirm Password */}
//           <div>
//             <label className="text-sm font-medium">Confirm Password</label>
//             <input
//               type={showPassword ? "text" : "password"}
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               placeholder="Confirm new password"
//               className="w-full mt-1 px-4 py-2 border rounded-lg"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-[#1e293b] text-white py-2 rounded-lg"
//           >
//             {loading ? "Updating..." : "Update Password"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ResetPassword;


import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { resetPassword } from "@/api/auth.api";
 
const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
 
  const navigate = useNavigate();
  const { state } = useLocation();
  const email = state?.email;
  const otp = state?.otp;
 
  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
 
    if (!email || !otp) {
      setError("Session expired. Please start over.");
      setTimeout(() => navigate("/forgot-password"), 2000);
      return;
    }
 
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
 
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
 
    try {
      setLoading(true);
      await resetPassword({ email, otp, newPassword: password });
      setSuccess("Password updated successfully. Redirecting to login...");
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-neutral-50">
 
      {/* LEFT INFO PANEL */}
      <div className="hidden lg:flex flex-col justify-center px-16 bg-[#0852A1] text-white">
        <h1 className="text-4xl font-semibold leading-tight">
          Reset your password
        </h1>
        <p className="mt-4  max-w-md text-white">
          Create a strong new password to secure your account. Make sure it
          contains at least 6 characters.
        </p>
 
        <div className="mt-10 space-y-3 text-sm text-white">
          <div>✔ Secure authentication</div>
          <div>✔ Protected account</div>
          <div>✔ Easy login again</div>
        </div>
      </div>
 
      {/* RIGHT FORM PANEL */}
      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white border border-neutral-200 rounded-xl shadow-xl px-8 py-9">
 
          {/* HEADER */}
          <h2 className="text-2xl font-semibold text-neutral-900">
            Update Password
          </h2>
          <p className="text-sm text-neutral-500 mt-1 mb-5">
            Enter your new password below
          </p>
 
          {/* ERROR / SUCCESS */}
          {error && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 rounded-md border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-600">
              {success}
            </div>
          )}
 
          {/* FORM */}
          <form onSubmit={handleReset} className="space-y-5">
 
            {/* NEW PASSWORD */}
            <div className="relative">
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                New Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full h-12 px-4 pr-10 text-sm border border-neutral-300 rounded-full
 
                           shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:shadow-md"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-3/ text-neutral-500 hover:text-neutral-800"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
 
            {/* CONFIRM PASSWORD */}
            <div className="relative">
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full h-12 px-4 text-sm border border-neutral-300 rounded-full
 
                           shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:shadow-md"
              />
            </div>
 
            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-full
 bg-[#0852A1] text-white font-semibold
                         hover:bg-[#387DC6] transition disabled:opacity-60 cursor-pointer"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
 
          {/* BACK TO LOGIN */}
          <p className="text-center text-sm text-neutral-600 mt-6">
            Remembered your password?{" "}
            <button
              onClick={() => navigate("/login")}
              className="font-medium text-neutral-900 hover:underline"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
 
export default ResetPassword;