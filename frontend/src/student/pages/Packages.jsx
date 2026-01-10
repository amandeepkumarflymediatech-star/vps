"use client";

import { useEffect, useState } from "react";
import { getStudentPackages } from "@/api/student.api";
import { BookOpen, Loader2 } from "lucide-react";

const StudentPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await getStudentPackages();
        setPackages(res.data.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load packages");
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-[#0852A1]" />
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-red-500 text-sm font-medium">{error}</div>;
  }

  if (!packages.length) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-black mb-2">Packages</h1>
        <p className="text-gray-500 text-sm">No packages available yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-black text-gray-900">
          Packages
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg._id}
            className="bg-white rounded-2xl border shadow-sm p-5 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0852A1] uppercase tracking-wide">
                <BookOpen size={14} />
                {pkg.category || "English Package"}
              </div>
              <h2 className="text-lg font-black text-gray-900 line-clamp-2">
                {pkg.title}
              </h2>
              {pkg.description && (
                <p className="text-sm text-gray-600 line-clamp-3">
                  {pkg.description}
                </p>
              )}
              {pkg.level && (
                <p className="text-xs inline-flex px-2 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold mt-1">
                  {pkg.level}
                </p>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
              <div>
                <div className="text-xl font-black text-[#0852A1]">
                  ₹{pkg.price}
                </div>
                {pkg.discountPrice && (
                  <div className="text-xs text-gray-400 line-through">
                    ₹{pkg.discountPrice}
                  </div>
                )}
              </div>

              <button
                className="px-4 py-2 rounded-xl bg-[#0852A1] text-white text-sm font-bold hover:bg-blue-700 transition"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentPackages;
