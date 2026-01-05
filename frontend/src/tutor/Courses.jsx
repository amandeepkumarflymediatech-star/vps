import { useState } from "react";
import { Plus, Edit, Trash2, BookOpen } from "lucide-react";

const Courses = () => {
  const [showModal, setShowModal] = useState(false);
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: "Spoken English Mastery",
      students: 120,
      duration: "3 Months",
      price: "₹2999",
      status: "Published",
    },
    {
      id: 2,
      title: "IELTS Preparation Course",
      students: 85,
      duration: "2 Months",
      price: "₹4999",
      status: "Draft",
    },
  ]);

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Courses</h2>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#0852A1] text-white px-5 py-2.5 rounded-lg hover:bg-[#387DC6] transition"
        >
          <Plus size={18} />
          Create Course
        </button>
      </div>

      {/* EMPTY STATE */}
      {courses.length === 0 && (
        <div className="bg-white rounded-xl shadow p-10 text-center">
          <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-500 mb-4">
            You haven't created any courses yet.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-[#0852A1] text-white px-5 py-2 rounded-lg"
          >
            Create Your First Course
          </button>
        </div>
      )}

      {/* COURSES GRID */}
      {courses.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-xl shadow p-5 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold">
                  {course.title}
                </h3>

                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    course.status === "Published"
                      ? "bg-green-100 text-green-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {course.status}
                </span>
              </div>

              <div className="space-y-1 text-sm text-gray-600">
                <p>👨‍🎓 Students Enrolled: {course.students}</p>
                <p>⏱ Duration: {course.duration}</p>
                <p>💰 Price: {course.price}</p>
              </div>

              <div className="flex justify-between items-center mt-5">
                <button className="flex items-center gap-1 text-blue-600 hover:underline">
                  <Edit size={16} />
                  Edit
                </button>

                <button className="flex items-center gap-1 text-red-600 hover:underline">
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE COURSE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-semibold mb-4">
              Create New Course
            </h3>

            <form className="space-y-4">
              <input
                type="text"
                placeholder="Course Title"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0852A1]"
              />

              <input
                type="text"
                placeholder="Duration (e.g. 3 Months)"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0852A1]"
              />

              <input
                type="number"
                placeholder="Price"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0852A1]"
              />

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#0852A1] text-white"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Courses;
