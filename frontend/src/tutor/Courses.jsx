import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { getCourses, createCourse, deleteCourse, updateCourse } from "@/api/course.api";

// Backend image base URL (Isse apni API URL se replace karein)
const IMAGE_BASE_URL = "http://localhost:5000/uploads/"; 

const Courses = () => {
  const [showModal, setShowModal] = useState(false);
  const [courses, setCourses] = useState([]);
  const [editCourse, setEditCourse] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchCourses = async () => {
    try {
      const res = await getCourses();
      setCourses(res.data);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be under 2MB");
      return;
    }
    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

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
    formData.append("tutorId", user?.id || user?._id);

    if (selectedFile) formData.append("image", selectedFile);

    try {
      if (editCourse) {
        const res = await updateCourse(editCourse._id, formData);
        setCourses((prev) => prev.map((c) => (c._id === editCourse._id ? res.data : c)));
      } else {
        const res = await createCourse(formData);
        setCourses((prev) => [res.data, ...prev]);
      }
      handleCloseModal();
    } catch (err) {
      alert(err.response?.data?.message || "Error occurred");
    } finally {
      setUploading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditCourse(null);
    setPreviewImage("");
    setSelectedFile(null);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    try {
      await deleteCourse(id);
      setCourses((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6 min-h-screen">
      
      {/* HEADER - Responsive Flex */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-5 rounded-xl shadow-sm border gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">Course Management</h2>
          <p className="text-xs md:text-sm text-gray-500">Create & manage your professional courses</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#0852A1] hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition-all shadow-md"
        >
          <Plus size={18} /> Add Course
        </button>
      </div>

      {/* COURSE GRID - Responsive Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {courses.map((item) => (
          <div key={item._id} className="bg-white rounded-xl overflow-hidden border shadow-sm flex flex-col hover:shadow-md transition-shadow">
            <div className="h-48 bg-gray-100 relative group">
              {item.image ? (
                <img src={item.image.startsWith('http') ? item.image : `${IMAGE_BASE_URL}${item.image}`} className="w-full h-full object-cover" alt={item.title} />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400"><ImageIcon size={40} /></div>
              )}
              <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-bold text-[#0852A1] shadow-sm">
                {item.published ? "Live" : "Draft"}
              </div>
            </div>

            <div className="p-5 flex flex-col flex-1">
              <h3 className="font-bold text-lg text-gray-800 line-clamp-1">{item.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-2 mt-1 mb-4 flex-1">{item.description}</p>

              <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-auto">
                <span className="text-xl font-black text-[#0852A1]">₹{item.price}</span>
                <div className="flex gap-1">
                  <button onClick={() => { setEditCourse(item); setPreviewImage(item.image); setShowModal(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"><Edit size={20} /></button>
                  <button onClick={() => handleDelete(item._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 size={20} /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL - Fully Responsive */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg h-full sm:h-auto sm:max-h-[90vh] sm:rounded-2xl flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b sticky top-0 bg-white z-10">
              <h3 className="font-bold text-lg">{editCourse ? "Update Course" : "Create New Course"}</h3>
              <button onClick={handleCloseModal} className="p-2 hover:bg-gray-100 rounded-full transition"><X size={24} /></button>
            </div>

            {/* Modal Body - Scrollable on Mobile */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
              
              {/* Image Upload Area */}
              <div className="relative h-44 border-2 border-dashed border-gray-300 rounded-xl overflow-hidden group hover:border-blue-400 transition-colors">
                {previewImage ? (
                  <img src={previewImage} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2">
                    <Upload size={32} />
                    <span className="text-sm font-medium">Upload Course Banner</span>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                {previewImage && <div className="absolute inset-0 bg-black/20 group-hover:flex hidden items-center justify-center text-white font-medium">Change Image</div>}
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Course Title</label>
                  <input name="title" defaultValue={editCourse?.title || ""} placeholder="e.g. Advanced React Pro" required className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Description</label>
                  <textarea name="description" rows="3" defaultValue={editCourse?.description || ""} placeholder="Tell students what they will learn..." required className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition resize-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700">Price (INR)</label>
                    <input type="number" name="price" defaultValue={editCourse?.price || ""} placeholder="₹999" required className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700">Status</label>
                    <select name="published" defaultValue={editCourse?.published ? "true" : "false"} className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white transition">
                      <option value="true">Published</option>
                      <option value="false">Draft</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 border-t mt-4">
                <button type="button" onClick={handleCloseModal} className="flex-1 px-4 py-3 font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition">Cancel</button>
                <button disabled={uploading} className="flex-1 bg-[#0852A1] hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-bold shadow-lg disabled:opacity-70 transition flex items-center justify-center">
                  {uploading ? <Loader2 className="animate-spin" /> : editCourse ? "Update Course" : "Create Course"}
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