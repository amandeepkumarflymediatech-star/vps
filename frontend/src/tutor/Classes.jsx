import { useState, useEffect } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  Calendar,
  Users,
  IndianRupee,
  X,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getAllClasses,
  createClass,
  updateClass,
  deleteClass,
} from "../api/classes.api";

const Classes = () => {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editClass, setEditClass] = useState(null);

  const [form, setForm] = useState({
    courseId: "",
    title: "",
    description: "",
    price: "",
    startDate: "",
    endDate: "",
    maxStudents: 50,
  });

  /* ================= FETCH ================= */
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getAllClasses();
      if (res.data.success) setClasses(res.data.data);
    } catch (err) {
      setError("Failed to load classes");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = editClass
        ? await updateClass(editClass._id, form)
        : await createClass(form);

      if (res.data.success) {
        editClass
          ? setClasses((prev) =>
              prev.map((c) => (c._id === editClass._id ? res.data.data : c))
            )
          : setClasses((prev) => [res.data.data, ...prev]);

        closeModal();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save class");
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this class?")) return;
    try {
      await deleteClass(id);
      setClasses((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      alert("Unauthorized or failed to delete");
    }
  };

  /* ================= HELPERS ================= */
  const openCreate = () => {
    resetForm();
    setEditClass(null);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditClass(item);
    setForm({
      courseId: item.courseId,
      title: item.title,
      description: item.description,
      price: item.price,
      startDate: item.startDate?.slice(0, 10),
      endDate: item.endDate?.slice(0, 10),
      maxStudents: item.maxStudents,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditClass(null);
    resetForm();
  };

  const resetForm = () => {
    setForm({
      courseId: "",
      title: "",
      description: "",
      price: "",
      startDate: "",
      endDate: "",
      maxStudents: 50,
    });
  };

  /* ================= UI ================= */
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border shadow-sm">
        <div>
          <h2 className="text-3xl font-black">Classes Panel</h2>
          <p className="text-gray-500">{classes.length} total classes</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#0852A1] text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700"
        >
          <Plus size={20} /> Create Class
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="flex justify-center py-20 text-gray-400">
          <Loader2 className="animate-spin" size={36} />
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="bg-red-50 text-red-600 p-6 rounded-xl">{error}</div>
      )}

      {/* GRID */}
      {!loading && !error && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-3xl border p-6 shadow-sm hover:shadow-lg transition"
            >
              <div className="flex justify-between mb-4">
                <span className="text-xs font-bold bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
                  {item.status}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(item)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-bold mb-4">{item.title}</h3>

              <div className="space-y-2 text-sm text-gray-500 mb-6">
                <div className="flex items-center gap-2">
                  <Users size={16} /> Max {item.maxStudents}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  {new Date(item.startDate).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2 text-lg font-black text-[#0852A1]">
                  <IndianRupee size={18} /> {item.price}
                </div>
              </div>

              <button
                onClick={() => navigate(`/classes/${item._id}`)}
                className="w-full py-3 bg-gray-50 hover:bg-[#0852A1] hover:text-white rounded-2xl font-bold transition"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={closeModal}
          />
          <div className="relative bg-white rounded-[2rem] w-full max-w-lg p-6">
            <div className="flex justify-between mb-6">
              <h3 className="text-xl font-bold">
                {editClass ? "Edit Class" : "Create Class"}
              </h3>
              <X className="cursor-pointer" onClick={closeModal} />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                required
                placeholder="Class Title"
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
                className="w-full border rounded-xl px-4 py-3"
              />

              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full border rounded-xl px-4 py-3"
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  required
                  value={form.startDate}
                  onChange={(e) =>
                    setForm({ ...form, startDate: e.target.value })
                  }
                  className="border rounded-xl px-4 py-3"
                />
                <input
                  type="date"
                  required
                  value={form.endDate}
                  onChange={(e) =>
                    setForm({ ...form, endDate: e.target.value })
                  }
                  className="border rounded-xl px-4 py-3"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Price"
                  value={form.price}
                  onChange={(e) =>
                    setForm({ ...form, price: e.target.value })
                  }
                  className="border rounded-xl px-4 py-3"
                />
                <input
                  type="number"
                  placeholder="Max Students"
                  value={form.maxStudents}
                  onChange={(e) =>
                    setForm({ ...form, maxStudents: e.target.value })
                  }
                  className="border rounded-xl px-4 py-3"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#0852A1] text-white py-4 rounded-2xl font-bold hover:bg-blue-700"
              >
                {editClass ? "Update Class" : "Create Class"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};



export default Classes;
