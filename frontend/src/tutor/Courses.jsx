import { useEffect, useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Upload,
  X,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  getCourses,
  createCourse,
  deleteCourse,
  updateCourse,
} from "@/api/course.api";

const Courses = () => {
  const [showModal, setShowModal] = useState(false);
  const [courses, setCourses] = useState([]);
  const [editCourse, setEditCourse] = useState(null);

  const [previewImage, setPreviewImage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  /* ================= FETCH COURSES ================= */
  const fetchCourses = async () => {
    try {
      const res = await getCourses();
      setCourses(res.data);
    } catch (err) {
      toast.error("Failed to load courses");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  /* ================= IMAGE SELECT ================= */
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return;
    }

    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    const form = e.target;
    const formData = new FormData();

    formData.append("title", form.title.value);
    formData.append("description", form.description.value);
    formData.append("price", form.price.value);
    formData.append("published", form.published.value);

    const user = JSON.parse(localStorage.getItem("user"));
    formData.append("tutorId", user.id);

    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    try {
      if (editCourse) {
        const res = await updateCourse(editCourse._id, formData);
        setCourses((prev) =>
          prev.map((c) => (c._id === editCourse._id ? res.data : c))
        );
        toast.success("Course updated successfully");
      } else {
        const res = await createCourse(formData);
        setCourses((prev) => [res.data, ...prev]);
        toast.success("Course created successfully");
      }

      handleCloseModal();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setUploading(false);
    }
  };

  /* ================= CLOSE MODAL ================= */
  const handleCloseModal = () => {
    setShowModal(false);
    setEditCourse(null);
    setPreviewImage("");
    setSelectedFile(null);
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this course?")) return;

    try {
      await deleteCourse(id);
      setCourses((prev) => prev.filter((c) => c._id !== id));
      toast.success("Course deleted");
    } catch (err) {
      toast.error("Failed to delete course");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow">
        <div>
          <h2 className="text-2xl font-bold">Course Management</h2>
          <p className="text-sm text-gray-500">Create & manage courses</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg"
        >
          <Plus size={18} /> Add Course
        </button>
      </div>

      {/* COURSE GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-xl overflow-hidden border shadow-sm"
          >
            <div className="h-40 bg-gray-200">
              {item.image ? (
                <img
                  src={item.image}
                  className="w-full h-full object-cover"
                  alt=""
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400">
                  <ImageIcon size={36} />
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-2">
                {item.description}
              </p>

              <div className="flex justify-between items-center mt-4">
                <span className="font-bold text-blue-600">₹{item.price}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditCourse(item);
                      setPreviewImage(item.image || "");
                      setSelectedFile(null);
                      setShowModal(true);
                    }}
                    className="text-blue-600"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-xl overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b">
              <h3 className="font-bold">
                {editCourse ? "Edit Course" : "Create Course"}
              </h3>
              <button onClick={handleCloseModal}>
                <X />
              </button>
            </div>

            <form
              key={editCourse?._id || "create"}
              onSubmit={handleSubmit}
              className="p-6 space-y-4"
            >
              {/* IMAGE */}
              <div className="relative h-36 border-2 border-dashed rounded-lg overflow-hidden">
                {previewImage ? (
                  <img
                    src={previewImage}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    <Upload />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>

              <input
                name="title"
                defaultValue={editCourse?.title || ""}
                placeholder="Course title"
                required
                className="w-full border px-4 py-2 rounded-lg"
              />

              <textarea
                name="description"
                defaultValue={editCourse?.description || ""}
                placeholder="Course description"
                required
                className="w-full border px-4 py-2 rounded-lg"
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  name="price"
                  defaultValue={editCourse?.price || ""}
                  placeholder="Price"
                  required
                  className="border px-4 py-2 rounded-lg"
                />
                <select
                  name="published"
                  defaultValue={editCourse?.published ? "true" : "false"}
                  className="border px-4 py-2 rounded-lg"
                >
                  <option value="true">Published</option>
                  <option value="false">Draft</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  disabled={uploading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg"
                >
                  {uploading ? (
                    <Loader2 className="animate-spin" />
                  ) : editCourse ? (
                    "Update"
                  ) : (
                    "Create"
                  )}
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
