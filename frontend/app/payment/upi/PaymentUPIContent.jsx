"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { CreditCard, ShieldCheck } from "lucide-react";
import { createRazorpayOrder, verifyRazorpaySignature } from "@/api/razorpay.api";
import toast from "react-hot-toast";

export default function PaymentUPIContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const amount = searchParams.get("amount");
  const lessons = searchParams.get("lessons");
  const packageId = searchParams.get("packageId");
  const tutorId = searchParams.get("tutorId");

  const [ready, setReady] = useState(false);
  const [uploading, setUploading] = useState(false);

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

  const handleRazorpayPayment = async () => {
    try {
      setUploading(true);
      
      // 1. Load Razorpay script
      const loadScript = () => {
        return new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });
      };

      const isLoaded = await loadScript();
      if (!isLoaded) {
        toast.error("Razorpay SDK failed to load. Are you online?");
        return;
      }

      // 2. Create Order
      const res = await createRazorpayOrder({
        amount: Number(amountFormatted),
        lessons: Number(lessons),
        packageId,
        tutorId,
      });

      if (!res.data?.success) {
        toast.error(res.data?.message || "Order creation failed");
        return;
      }

      const { orderId, amount: orderAmount, currency, key } = res.data;

      // 3. Open Checkout
      const options = {
        key,
        amount: orderAmount,
        currency,
        name: "The English Raj",
        description: planName,
        order_id: orderId,
        handler: async (response) => {
          try {
            setUploading(true);
            const verifyRes = await verifyRazorpaySignature({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data?.success) {
              toast.success("Payment successful!");
              router.push("/student/dashboard");
            } else {
              toast.error(verifyRes.data?.message || "Verification failed");
            }
          } catch (err) {
            console.error("Verification error:", err);
            toast.error("Signature verification failed");
          } finally {
            setUploading(false);
          }
        },
        prefill: {
          name: "", // Can be fetched from user context if available
          email: "",
          contact: "",
        },
        theme: {
          color: "#6739B7",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (err) {
      console.error("Razorpay error:", err);
      toast.error(err.response?.data?.message || "Razorpay initialization failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FBFCFF] px-4 py-8 text-black font-medium">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-sm w-full border border-gray-100"
      >
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
            <ShieldCheck size={32} />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-1">Secure Checkout</h1>
        <p className="text-gray-500 text-sm mb-6">{planName}</p>

        <div className="bg-gray-50 rounded-2xl p-4 mb-8">
          <span className="text-gray-600 block text-xs uppercase font-bold tracking-wider mb-1">Total Amount</span>
          <span className="text-3xl font-black text-gray-900">₹{amountFormatted}</span>
        </div>

        <button
          onClick={handleRazorpayPayment}
          disabled={uploading}
          className="w-full py-4 rounded-2xl bg-[#111827] text-white
                     font-bold shadow-xl hover:bg-black transition-all
                     flex items-center justify-center gap-3 disabled:opacity-50"
        >
          <CreditCard size={20} />
          {uploading ? "Preparing Checkout..." : "Pay with Razorpay"}
        </button>

        <p className="mt-8 text-[11px] text-gray-400 leading-relaxed uppercase tracking-widest font-bold">
          Pay via UPI, Cards, or NetBanking
        </p>
        
        <div className="mt-4 flex items-center justify-center gap-4 opacity-50 grayscale">
           {/* You can add small grey labels for payment partners here */}
           <span className="text-[10px] font-bold">RAZORPAY SECURE</span>
        </div>
      </motion.div>
    </div>
  );
}
