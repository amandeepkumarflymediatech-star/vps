"use client";

import TutorDetailsView from "@/student/pages/TutorDetailsView";

export default function StudentTutorDetailPage({ params }) {
  return <TutorDetailsView id={params.id} />;
}
