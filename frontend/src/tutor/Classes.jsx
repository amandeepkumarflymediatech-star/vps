import { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  BookOpen,
  Users,
  Clock,
  IndianRupee,
  X,
} from "lucide-react";

const Classes = () => {
  const [showModal, setShowModal] = useState(false);

  const [classes, setClasses] = useState([
    {
      id: 1,
      title: "Spoken English",
      students: 24,
      schedule: "Mon – Fri • 10:00 AM",
      duration: "3 Months",
      price: 999,
      status: "Active",
    },
    {
      id: 2,
      title: "IELTS Preparation",
      students: 18,
      schedule: "Tue – Thu • 6:00 PM",
      duration: "2 Months",
      price: 1999,
      status: "Draft",
    },
  ]);

  const [form, setForm] = useState({
    title: "",
    schedule: "",
    duration: "",
    price: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = (e) => {
    e.preventDefault();

    const newClass = {
      id: Date.now(),
      title: form.title,
      schedule: form.schedule,
      duration: form.duration,
      price: Number(form.price),
      students: 0,
      status: "Draft",
    };

    setClasses([newClass, ...classes]);
    setShowModal(false);
    setForm({ title: "", schedule: "", duration: "", price: "" });
  };

  return (
    <div className="space-y-8">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">My Classes</h2>
          <p className="text-sm text-gray-500">
            Manage your live & recorded classes
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 bg-[#0852A1] text-white
                     px-5 py-2.5 rounded-xl hover:bg-[#387DC6] shadow-md"
        >
          <Plus size={18} />
          Create Class
        </button>
      </div>

      {/* ================= EMPTY STATE ================= */}
      {classes.length === 0 && (
        <div className="bg-white rounded-2xl shadow p-12 text-center">
          <BookOpen className="mx-auto text-gray-300 mb-4" size={52} />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            No Classes Yet
          </h3>
          <p className="text-gray-500 mb-6">
            Start by creating your first class.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-[#0852A1] text-white px-6 py-2.5 rounded-xl"
          >
            Create Class
          </button>
        </div>
      )}

      {/* ================= CLASSES GRID ================= */}
      {classes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {classes.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border shadow-sm hover:shadow-lg p-5"
            >
              <div className="flex justify-between mb-4">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    item.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Users size={16} /> {item.students} Students
                </div>

                <div className="flex items-center gap-2">
                  <Clock size={16} /> {item.schedule}
                </div>

                <div className="flex items-center gap-2">
                  ⏳ {item.duration}
                </div>

                <div className="flex items-center gap-2 font-semibold text-gray-800">
                  <IndianRupee size={16} /> {item.price}
                </div>
              </div>

              <div className="flex justify-between mt-6 pt-4 border-t">
                <button className="flex items-center gap-1 text-blue-600 text-sm">
                  <Edit size={16} /> Edit
                </button>
                <button className="flex items-center gap-1 text-red-600 text-sm">
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">

            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-semibold mb-6">Create New Class</h3>

            <form onSubmit={handleCreate} className="space-y-4">
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Class Title"
                className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#0852A1]"
                required
              />

              <input
                name="schedule"
                value={form.schedule}
                onChange={handleChange}
                placeholder="Schedule (Mon–Fri 10AM)"
                className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#0852A1]"
                required
              />

              <input
                name="duration"
                value={form.duration}
                onChange={handleChange}
                placeholder="Duration (e.g. 3 Months)"
                className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#0852A1]"
                required
              />

              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Price"
                className="w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#0852A1]"
                required
              />

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0852A1] text-white"
                >
                  Create Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Classes;
