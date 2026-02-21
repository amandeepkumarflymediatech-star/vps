"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getStudentPackages } from "@/api/student.api";
import {
  BookOpen,
  Loader2,
  CheckCircle2,
  IndianRupee,
  ArrowLeft,
  Clock,
} from "lucide-react";

const PackageDetail = ({ id }) => {
  const router = useRouter();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const user = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const res = await getStudentPackages(); // reuse existing API
        const found = res.data.data.find((p) => p._id === id);
        if (!found) throw new Error("Package not found");
        found.description = found.description
          ? found.description.split("\n" || ",")
          : [];
        setPkg(found);
      } catch (err) {
        console.error(err);
        setError("Failed to load package details");
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [id]);

  // const handleEnroll = () => {
  //   // router.push(`/CoursesPricing?tutorId=${tutorId}&time=${slot.startTime}`);
  // };
  /* ---------- LOADING ---------- */
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#FBFCFF]">
        <Loader2 className="animate-spin text-[#6335F8]" size={40} />
      </div>
    );
  }

  /* ---------- ERROR ---------- */
  if (error) {
    return (
      <div className="pt-24 px-6 text-center text-red-600 font-bold">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FBFCFF] to-[#F3F4FF] pt-16 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* BACK BUTTON */}
        <button
          onClick={() => router.back()}
          className="group inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#6335F8]"
        >
          <span className="p-2 bg-white rounded-full shadow-sm group-hover:shadow-md transition">
            <ArrowLeft size={16} />
          </span>
          Back to Packages
        </button>

        {/* HEADER CARD */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* LEFT */}
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-black text-[#6335F8] uppercase tracking-widest bg-purple-50 px-4 py-2 rounded-full w-fit">
                <BookOpen size={14} />
                {pkg.title || "Learning Package"}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
                {pkg.lessons} Live Lessons
              </h1>

              <div className="space-y-3">
                <h2 className="text-lg font-black flex items-center gap-2">
                  <CheckCircle2 className="text-green-500" />
                  What’s Included
                </h2>

                {(pkg.description || []).length > 0 ? (
                  <ul className="space-y-2">
                    {pkg.description.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-sm text-gray-600"
                      >
                        <span className="mt-1 text-green-500">
                          <CheckCircle2 size={14} />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">
                    Detailed benefits will be shared after enrollment.
                  </p>
                )}
              </div>

              {/* TAGS */}
              <div className="flex flex-wrap gap-2 pt-2">
                {pkg.level && (
                  <span className="px-4 py-1.5 text-xs font-bold rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                    {pkg.level}
                  </span>
                )}
                {pkg.accessDurationDays && (
                  <span className="px-4 py-1.5 text-xs font-bold rounded-full bg-green-50 text-green-600 border border-green-100 flex items-center gap-1.5">
                    <Clock size={14} />
                    {pkg.accessDurationDays} Days Access
                  </span>
                )}
              </div>
            </div>

            {/* RIGHT – PRICE */}
            <div className="flex flex-col justify-between bg-gradient-to-br from-[#6335F8] to-[#7C5CFF] rounded-3xl p-6 sm:p-8 text-white">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider opacity-80">
                  Total Price
                </p>

                <div className="flex items-end gap-3 mt-2">
                  <span className="text-4xl font-black">₹{pkg.price}</span>
                  {pkg.discountPrice && (
                    <span className="text-lg font-bold line-through opacity-70">
                      ₹{pkg.discountPrice}
                    </span>
                  )}
                </div>
              </div>

              {/* <button
                onClick={handleEnroll}
                className="mt-6 w-full py-4 rounded-2xl bg-white text-[#6335F8] font-black shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition"
              >
                Enroll Now
              </button> */}
            </div>
          </div>
        </div>

        {/* MOBILE STICKY CTA */}
        <div className="fixed bottom-0 left-0 right-0 sm:hidden bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-500">Price</p>
            <p className="text-lg font-black text-gray-900">₹{pkg.price}</p>
          </div>

          {/* <button className="px-6 py-3 rounded-xl bg-[#6335F8] text-white font-black shadow-md active:scale-95">
            Enroll
          </button> */}
        </div>
      </div>
    </div>
    // <div className="min-h-screen bg-[#FBFCFF] pt-20 pb-10 px-4 sm:px-6 lg:px-8">
    //   <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
    //     {/* BACK BUTTON */}
    //     <button
    //       onClick={() => router.back()}
    //       className="group flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#6335F8] transition-colors"
    //     >
    //       <div className="p-2 bg-white rounded-full shadow-sm group-hover:shadow-md transition-all">
    //         <ArrowLeft size={16} />
    //       </div>
    //       Back to Packages
    //     </button>

    //     {/* HEADER */}
    //     <div className="bg-white rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-10 border border-gray-100 shadow-sm space-y-5">
    //       <div className="flex flex-wrap items-center justify-between gap-4">
    //         <div className="flex items-center gap-2 text-[10px] sm:text-xs font-black text-[#6335F8] uppercase tracking-widest bg-purple-50 px-3 py-1.5 rounded-full">
    //           <BookOpen size={14} />
    //           {pkg.category || "Learning Package"}
    //         </div>
    //       </div>

    //       <div className="space-y-3">
    //         <h1 className="text-2xl sm:text-4xl font-black text-gray-900 leading-tight">
    //           {pkg.title}
    //         </h1>

    //         <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
    //           {pkg.description}
    //         </p>
    //       </div>

    //       <div className="flex flex-wrap gap-3 pt-2">
    //         {pkg.level && (
    //           <span className="px-4 py-1.5 text-xs font-bold rounded-full bg-blue-50 text-blue-600 border border-blue-100">
    //             {pkg.level}
    //           </span>
    //         )}
    //         {pkg.validity && (
    //           <span className="px-4 py-1.5 text-xs font-bold rounded-full bg-green-50 text-green-600 border border-green-100 flex items-center gap-1.5">
    //             <Clock size={14} /> {pkg.validity}
    //           </span>
    //         )}
    //       </div>
    //     </div>

    //     {/* CONTENT LIST */}
    //     <div className="bg-white rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-10 border border-gray-100 shadow-sm">
    //       <h2 className="text-lg sm:text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
    //         <CheckCircle2 className="text-green-500" />
    //         What’s Included
    //       </h2>

    //       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    //         {(pkg.contents || []).map((item, idx) => (
    //           <div
    //             key={idx}
    //             className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100/50 hover:border-gray-200 transition-colors"
    //           >
    //             <div className="p-1.5 bg-white rounded-full shadow-sm text-green-600 mt-0.5">
    //               <CheckCircle2 size={16} />
    //             </div>
    //             <div className="flex-1">
    //               <h3 className="font-bold text-gray-900 text-sm sm:text-base">{item.title}</h3>
    //               {item.duration && (
    //                 <p className="text-xs font-medium text-gray-500 mt-1">
    //                   {item.duration}
    //                 </p>
    //               )}
    //             </div>
    //           </div>
    //         ))}

    //         {!pkg.contents?.length && (
    //           <div className="col-span-full p-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
    //             <p className="text-sm text-gray-500">
    //               Package content details will be available after enrollment.
    //             </p>
    //           </div>
    //         )}
    //       </div>
    //     </div>

    //     {/* PRICE & CTA */}
    //     <div className="sticky bottom-4 z-10 bg-white/80 backdrop-blur-md rounded-3xl p-5 sm:p-8 border border-gray-200/50 shadow-lg sm:shadow-sm sm:relative sm:bottom-0 sm:bg-white sm:border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
    //       <div className="text-center sm:text-left w-full sm:w-auto">
    //         <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1 sm:hidden">
    //           Total Price
    //         </p>
    //         <div className="flex items-baseline justify-center sm:justify-start gap-2">
    //           <span className="text-3xl sm:text-4xl font-black text-gray-900">
    //             ₹{pkg.price}
    //           </span>
    //           {pkg.discountPrice && (
    //             <span className="text-sm sm:text-lg text-gray-400 font-bold line-through">
    //               ₹{pkg.discountPrice}
    //             </span>
    //           )}
    //         </div>
    //       </div>

    //       {/* <button className="w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-[#6335F8] text-white font-black shadow-lg shadow-indigo-200 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all text-sm sm:text-base">
    //         Enroll Now
    //       </button> */}
    //     </div>
    //   </div>
    // </div>
  );
};

export default PackageDetail;
