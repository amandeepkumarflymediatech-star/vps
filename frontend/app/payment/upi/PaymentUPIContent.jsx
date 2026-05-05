"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Loader2, Smartphone, CreditCard } from "lucide-react";
import { initiatePhonePePayment, checkPhonePePaymentStatus } from "@/api/payment.api";
import { validateCoupon } from "@/api/coupon.api";
import toast from "react-hot-toast";

export default function PaymentUPIContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  console.log(searchParams, '-------')
  const amount = searchParams.get("amount");
  const lessons = searchParams.get("lessons");
  const packageId = searchParams.get("packageId");
  const tutorId = searchParams.get("tutorId");
  console.log(lessons, 'lesons',Number(lessons))
  const [ready, setReady] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [polling, setPolling] = useState(false)
  
  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  const handleCallback = (response, txnId) => {
    if (response === "USER_CANCEL") {
      setProcessing(false);
      return;
    }

    if (response === "CONCLUDED") {
      startPolling(txnId); // ✅ correct ID
    }
  };

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

  // Poll for payment status
  const startPolling = async (transactionId) => {
    setPolling(true);
    const maxAttempts = 30; // 30 attempts * 2 seconds = 60 seconds
    let attempts = 0;

    const poll = async () => {
      try {
        const statusRes = await checkPhonePePaymentStatus(transactionId);

        if (statusRes.state === "COMPLETED") {
          toast.success("Payment successful!");
          setPolling(false);
          router.push(`/payment-success?status=success`);
          return;
        } else if (statusRes.state === "FAILED") {
          toast.error("Payment failed. Please try again.");
          setPolling(false);
          setProcessing(false);

          return;
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 2000);
        } else {
          toast.error("Payment timeout. Please check your UPI app.");
          setPolling(false);
          setProcessing(false);

          router.push(`/payment-success?status=failed`);
        }
      } catch (err) {
        console.error("Status check error:", err);
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 2000);
        } else {
          setPolling(false);
          setProcessing(false);

        }
      }
    };

    poll();
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    try {
      setIsValidatingCoupon(true);
      const res = await validateCoupon(couponCode);
      if (res.data.success) {
        const { discountType, discountValue, code } = res.data;
        let discount = 0;
        const currentAmount = Number(amount);

        if (discountType === "PERCENTAGE") {
          discount = (currentAmount * discountValue) / 100;
        } else {
          discount = discountValue;
        }

        setDiscountAmount(discount);
        setAppliedCoupon({ code, discountType, discountValue });
        toast.success("Coupon applied successfully!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid coupon code");
      setAppliedCoupon(null);
      setDiscountAmount(0);
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const finalAmount = Math.max(0, Number(amount) - discountAmount).toFixed(2);

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

      const data = await initiatePhonePePayment({
        amount: Number(finalAmount),
        lessons: Number(lessons),
        packageId,
        tutorId,
        couponCode: appliedCoupon?.code,
      });


      if (data.success && data.redirectUrl) {
        const txnId = data.merchantTransactionId;
        window.PhonePeCheckout.transact({
          tokenUrl: data.redirectUrl,
          callback: (response) => handleCallback(response, txnId),
          type: "IFRAME"
        });;
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
          {discountAmount > 0 && (
            <span className="text-sm text-gray-400 line-through mr-2">₹{Number(amount).toFixed(2)}</span>
          )}
          <span className="text-3xl font-black text-gray-900">₹{finalAmount}</span>
        </div>

        {/* Coupon Section */}
        <div className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter Coupon Code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              disabled={appliedCoupon || processing}
              className="flex-1 px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-purple-500 uppercase text-sm"
            />
            {!appliedCoupon ? (
              <button
                onClick={handleApplyCoupon}
                disabled={!couponCode || isValidatingCoupon || processing}
                className="bg-purple-100 text-purple-700 px-4 py-2 rounded-xl font-bold text-sm hover:bg-purple-200 transition-colors disabled:opacity-50"
              >
                {isValidatingCoupon ? "..." : "Apply"}
              </button>
            ) : (
              <button
                onClick={() => {
                  setAppliedCoupon(null);
                  setDiscountAmount(0);
                  setCouponCode("");
                }}
                className="text-red-500 text-xs font-bold"
              >
                Remove
              </button>
            )}
          </div>
          {appliedCoupon && (
            <p className="text-green-600 text-[10px] font-bold mt-2 text-left uppercase">
              CODE: {appliedCoupon.code} APPLIED! (Saved ₹{discountAmount.toFixed(2)})
            </p>
          )}
        </div>


        {/* Payment Button */}
        <button
          onClick={handleCardPayment}
          disabled={processing || polling}
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
              Pay via PhonePe
            </>
          )}
        </button>

        <div className="mt-4 flex items-center justify-center gap-4 opacity-50 grayscale">
          <span className="text-[10px] font-bold">PHONEPE SECURE</span>
        </div>
      </motion.div>
    </div>
  );
}
