"use client"; // This is CORRECT here

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [txnId, setTxnId] = useState("");

  const tutorId = searchParams.get("tutorId");
  const amount = searchParams.get("amount");
  const status = searchParams.get("status");

  const handleSubmit = async () => {
    if (!txnId) return alert("Please enter transaction ID");

    try {
      const res = await fetch("/api/payment/upi/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: tutorId, amount, txnId }),
      });
      const data = await res.json();
      alert(data.message);
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Payment submission failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold text-green-700">
        Payment Status: {status}
      </h1>
      <p className="mt-2 text-gray-600">
        Enter your UPI Transaction ID to verify:
      </p>
      <input
        value={txnId}
        onChange={(e) => setTxnId(e.target.value)}
        placeholder="Transaction ID"
        className="mt-2 p-2 border rounded"
      />
      <button
        onClick={handleSubmit}
        className="mt-4 bg-[#0852A1] text-white px-4 py-2 rounded"
      >
        Submit
      </button>
    </div>
  );
}