"use client";

import { Suspense } from "react";
import VerifyOtp from "@/authentication/VerifyOtp";

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <VerifyOtp />
    </Suspense>
  );
}
