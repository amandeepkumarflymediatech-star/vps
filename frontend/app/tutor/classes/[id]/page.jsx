"use client";

import { useParams } from "next/navigation";
import ClassDeatail from "@/student/pages/ClassDeatail";

export default function TutorClassDetailPage() {
  const { id } = useParams();
  return <ClassDeatail id={id} />;
}
