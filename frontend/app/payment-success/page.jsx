"use client";

import { useEffect, useState, Suspense } from "react";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

function PaymentStatusContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const [message, setMessage] = useState("We are verifying your payment status...");

  useEffect(() => {
    if (!status) {
      setMessage("No transaction ID found in URL. Verification impossible.");
      return;
    }
    // Check if phonepe status is COMPLETED
    if (status === "success") {
      setMessage("Your payment has been successfully completed and recorded 🎉");
    } else {
      setMessage(`Payment status is ${status || "UNKNOWN"}. Please try again later.`);
    }
  }, []);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full border border-gray-100 relative overflow-hidden">
      {status === "loading" && (
        <div className="flex flex-col items-center">
          <Loader2 className="w-16 h-16 text-blue-500 mx-auto mb-6 animate-spin" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Verifying Payment...</h1>
          <p className="text-gray-500 mb-6">{message}</p>
        </div>
      )}

      {status === "success" && (
        <div className="flex flex-col items-center">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6 animate-pulse" />
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-8 px-4 leading-relaxed">{message}</p>

          <button
            onClick={() => router.push("/student/dashboard")}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-lg hover:from-green-600 hover:to-green-700 shadow-lg transform hover:-translate-y-1 transition-all duration-200"
          >
            Go to Dashboard
          </button>
        </div>
      )}

      {status === "failed" && (
        <div className="flex flex-col items-center">
          <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Payment Failed</h1>
          <p className="text-gray-600 mb-8 px-4 leading-relaxed">{message}</p>

          <button
            onClick={() => router.push("/")}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-bold text-lg hover:from-red-600 hover:to-red-700 shadow-lg transform hover:-translate-y-1 transition-all duration-200"
          >
            Return Home
          </button>
        </div>
      )}
    </div>
  );
}

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-50 to-gray-100">
      <Suspense fallback={
        <div className="text-xl font-medium text-gray-600 animate-pulse">
          Loading your payment status window...
        </div>
      }>
        <PaymentStatusContent />
      </Suspense>
    </div>
  );
}
