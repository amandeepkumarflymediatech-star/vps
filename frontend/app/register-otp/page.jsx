"use client";

import { Suspense } from "react";
import RegisterOtp from "@/authentication/Registerotp";

export default function RegisterOtpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <RegisterOtp />
    </Suspense>
  );
}
