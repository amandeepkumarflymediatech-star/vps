"use client";

import { Suspense } from "react";
import CoursesPricing from "@/components/CoursesPricing";

export default function CoursesPage() {
  return (
    <Suspense fallback={<Loading />}>
      <CoursesPricing />
    </Suspense>
  );
}

const Loading = () => (
  <section className="py-20 text-center bg-[#F8F3F3]">
    <p className="text-gray-600">Loading pricing...</p>
  </section>
);
