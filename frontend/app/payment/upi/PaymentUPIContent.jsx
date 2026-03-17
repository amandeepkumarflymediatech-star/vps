"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Loader2, Smartphone, CreditCard, CheckCircle } from "lucide-react";
import { initiatePhonePeUpiPayment, checkUpiPaymentStatus } from "@/api/payment.api";
import toast from "react-hot-toast";

export default function PaymentUPIContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const amount = searchParams.get("amount");
  const lessons = searchParams.get("lessons");
  const packageId = searchParams.get("packageId");
  const tutorId = searchParams.get("tutorId");

  const [ready, setReady] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("upi"); // 'upi' or 'card'
  const [upiId, setUpiId] = useState("");
  const [processing, setProcessing] = useState(false);
  const [polling, setPolling] = useState(false);
  const [merchantTransactionId, setMerchantTransactionId] = useState(null);

  useEffect(() => {
    if (!amount || !lessons) {
      router.replace("/courses-pricing");
      return;
    }
    setReady(true);
  }, [amount, lessons, router]);

  if (!ready) return null;

  const planName = `${lessons} Lessons Package`;
  const amountFormatted = Number(amount).toFixed(2);

  // Handle UPI payment
  const handleUpiPayment = async () => {
    if (!upiId.trim()) {
      toast.error("Please enter your UPI ID");
      return;
    }

    // Validate UPI format
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;
    if (!upiRegex.test(upiId.trim())) {
      toast.error("Please enter a valid UPI ID (e.g., mobilenumber@upi)");
      return;
    }

    try {
      setProcessing(true);

      const res = await initiatePhonePeUpiPayment({
        amount: Number(amountFormatted),
        lessons: Number(lessons),
        packageId,
        tutorId,
        upiId: upiId.trim(),
      });

      if (res.success) {
        // Store transaction ID for status checking
        setMerchantTransactionId(res.merchantTransactionId);
        
        // Start polling for payment status
        toast.success("Payment request sent! Please approve on your UPI app.");
        startPolling(res.merchantTransactionId);
      } else {
        toast.error(res.message || "Failed to initiate UPI payment");
        setProcessing(false);
      }
    } catch (err) {
      console.error("UPI payment error:", err);
      toast.error(err.response?.data?.message || "Payment initiation failed");
      setProcessing(false);
    }
  };

  // Poll for payment status
  const startPolling = async (transactionId) => {
    setPolling(true);
    const maxAttempts = 30; // 30 attempts * 2 seconds = 60 seconds
    let attempts = 0;

    const poll = async () => {
      try {
        const statusRes = await checkUpiPaymentStatus(transactionId);

        if (statusRes.status === "SUCCESS") {
          toast.success("Payment successful!");
          setPolling(false);
          router.push(`/payment-success?txnId=${transactionId}`);
          return;
        } else if (statusRes.status === "FAILED") {
          toast.error("Payment failed. Please try again.");
          setPolling(false);
          setProcessing(false);
          setMerchantTransactionId(null);
          return;
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 2000);
        } else {
          toast.error("Payment timeout. Please check your UPI app.");
          setPolling(false);
          setProcessing(false);
          setMerchantTransactionId(null);
        }
      } catch (err) {
        console.error("Status check error:", err);
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 2000);
        } else {
          setPolling(false);
          setProcessing(false);
          setMerchantTransactionId(null);
        }
      }
    };

    poll();
  };

  // Handle card/netbanking payment (existing PhonePe flow)
  const handleCardPayment = async () => {
    try {
      setProcessing(true);
      
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      
      if (!token) {
        toast.error("Please login to make payment");
        setProcessing(false);
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/payment/phonepe/initiate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: Number(amountFormatted),
          lessons: Number(lessons),
          packageId,
          tutorId,
        }),
      });
      
      const data = await res.json();

      if (data.success && data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        toast.error(data.message || "Failed to initiate payment");
        setProcessing(false);
      }
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Payment initiation failed");
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FBFCFF] px-4 py-8 text-black font-medium">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-md w-full border border-gray-100"
      >
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center text-purple-600">
            <ShieldCheck size={32} />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-1">Secure Checkout</h1>
        <p className="text-gray-500 text-sm mb-6">{planName}</p>

        <div className="bg-gray-50 rounded-2xl p-4 mb-6 text-center">
          <span className="text-gray-600 block text-xs uppercase font-bold tracking-wider mb-1">Total Amount</span>
          <span className="text-3xl font-black text-gray-900">₹{amountFormatted}</span>
        </div>

        {/* Payment Method Selection */}
        <div className="mb-6">
          <p className="text-left text-sm font-semibold text-gray-700 mb-3">Select Payment Method</p>
          <div className="flex gap-3">
            <button
              onClick={() => setPaymentMethod("upi")}
              className={`flex-1 py-3 px-4 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${
                paymentMethod === "upi"
                  ? "border-[#6739B7] bg-purple-50 text-[#6739B7]"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              <Smartphone size={18} />
              <span className="font-semibold text-sm">UPI</span>
            </button>
            <button
              onClick={() => setPaymentMethod("card")}
              className={`flex-1 py-3 px-4 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${
                paymentMethod === "card"
                  ? "border-[#6739B7] bg-purple-50 text-[#6739B7]"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              <CreditCard size={18} />
              <span className="font-semibold text-sm">Card/Netbanking</span>
            </button>
          </div>
        </div>

        {/* UPI Payment Form */}
        {paymentMethod === "upi" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-6"
          >
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-4 border border-purple-100">
              <label className="block text-left text-sm font-semibold text-gray-700 mb-2">
                Enter Your UPI ID
              </label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="yourname@upi"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#6739B7] focus:ring-2 focus:ring-purple-100 outline-none transition-all text-center font-mono text-lg"
                disabled={polling}
              />
              <p className="text-xs text-gray-500 mt-2 text-left">
                Example: 9876543210@upi, name@bankname
              </p>
            </div>

            {polling && (
              <div className="mt-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                <div className="flex items-center justify-center gap-2 text-yellow-800">
                  <Loader2 className="animate-spin" size={20} />
                  <span className="font-semibold">Waiting for payment approval...</span>
                </div>
                <p className="text-xs text-yellow-700 mt-2">
                  Please check your UPI app and approve the payment request
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Payment Button */}
        <button
          onClick={paymentMethod === "upi" ? handleUpiPayment : handleCardPayment}
          disabled={processing || (paymentMethod === "upi" && polling)}
          className="w-full py-4 rounded-2xl bg-[#6739B7] text-white font-bold shadow-xl hover:bg-[#5a32a3] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {processing || polling ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              {polling ? "Waiting for approval..." : "Processing..."}
            </>
          ) : (
            <>
              <img
                src="https://www.phonepe.com/webstatic/8215/static/3fa91176b05299092497645f7b3c2c54/f9ca4/phonepe-logo-icon.png"
                alt=""
                className="w-6 h-6 invert brightness-0"
              />
              {paymentMethod === "upi" ? "Pay via UPI" : "Pay via PhonePe"}
            </>
          )}
        </button>

        <p className="mt-6 text-[11px] text-gray-400 leading-relaxed uppercase tracking-widest font-bold">
          {paymentMethod === "upi" 
            ? "Pay using any UPI app (Google Pay, PhonePe, Paytm, etc.)" 
            : "Pay via UPI, Cards, or NetBanking"}
        </p>
        
        <div className="mt-4 flex items-center justify-center gap-4 opacity-50 grayscale">
           <span className="text-[10px] font-bold">PHONEPE SECURE</span>
        </div>
      </motion.div>
    </div>
  );
}
