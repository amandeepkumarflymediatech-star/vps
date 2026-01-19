"use client";

import { Suspense } from "react";
import Home from "@/views/Home";
import PixelTracker from "@/components/PixelTracker";

export default function Page() {
  return (
    <>
      <PixelTracker />
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        <Home />
      </Suspense>
    </>
  );
}
