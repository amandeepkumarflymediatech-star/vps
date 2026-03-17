"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { checkUpiPaymentStatus } from "../api/payment.api";
import { Loader2 } from "lucide-react";

export default function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState("processing");

  useEffect(() => {
    const statusParam = searchParams.get("status");
    const tutorId = searchParams.get("tutorId");
    const amountParam = searchParams.get("amount");
    const lessonsParam = searchParams.get("lessons");
    const packageId = searchParams.get("packageId");
    const txnId = searchParams.get("txnId"); // Transaction ID from PhonePe callback

    const amount = amountParam ? Number(amountParam) : undefined;
    const finalStatus =
      statusParam === "failed" || statusParam === "FAILED"
        ? "FAILED"
        : "SUCCESS";

    const logAndRedirect = async () => {
      try {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;

        // If we have a txnId, check the payment status first
        if (token && txnId) {
          try {
            const statusRes = await checkUpiPaymentStatus(txnId);
            if (statusRes.status === "SUCCESS") {
              setStatus("success");
              // Payment already processed, redirect to success
              setTimeout(() => router.replace("/payment-success"), 1500);
              return;
            } else if (statusRes.status === "PENDING") {
              // Still pending, wait and check again
              setStatus("pending");
              // Let it continue to log the payment
            } else {
              setStatus("failed");
              setTimeout(() => router.replace("/payment-failed"), 1500);
              return;
            }
          } catch (err) {
            console.error("Failed to check payment status:", err);
          }
        }

        if (token && amount) {
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/payment/upi/log`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                tutorId,
                amount,
                lessons: lessonsParam ? Number(lessonsParam) : undefined,
                status: finalStatus,
                packageId,
                clientPaymentId: txnId,
              }),
            },
          );
        }
      } catch (err) {
        console.error("Failed to log payment", err);
      } finally {
        if (finalStatus === "FAILED") {
          router.replace("/payment-failed");
        } else {
          router.replace("/payment-success");
        }
      }
    };

    logAndRedirect();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {status === "processing" && (
        <>
          <Loader2 className="w-8 h-8 animate-spin text-purple-600 mb-4" />
          <p className="text-gray-600">Processing payment result...</p>
        </>
      )}
      {status === "pending" && (
        <>
          <Loader2 className="w-8 h-8 animate-spin text-yellow-600 mb-4" />
          <p className="text-gray-600">Checking payment status...</p>
        </>
      )}
      {status === "success" && (
        <>
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-gray-800 font-semibold">Payment Successful!</p>
        </>
      )}
      {status === "failed" && (
        <>
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-gray-800 font-semibold">Payment Failed</p>
        </>
      )}
    </div>
  );
}
