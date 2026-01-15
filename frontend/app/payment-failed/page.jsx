"use client";

import { XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PaymentFailed() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md w-full">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Payment Failed ❌
        </h1>
        <p className="text-gray-600 mb-6">
          Something went wrong. Please try again.
        </p>

        <button
          onClick={() => router.push("/payment/upi")}
          className="w-full py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition"
        >
          Retry Payment
        </button>
      </div>
    </div>
  );
}
