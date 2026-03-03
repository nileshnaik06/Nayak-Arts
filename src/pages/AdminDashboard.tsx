import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { categories } from "@/data/categories";
import { createImage, deleteImage as deleteImageApi, updateImage as updateImageApi, getArtworks } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

interface ImageData {
  _id?: string;
  title: string;
  category: string;
  medium: string;
  description: string;
  year: number;
  featured: boolean;
  image?: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState<ImageData>({
    title: "",
    category: "",
    medium: "",
    description: "",
    year: new Date().getFullYear(),
    featured: false,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const res = await getArtworks();
      setImages(res?.data || []);
      setError("");
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch images. Please login again.");
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingId) {
        // Update existing image
        await updateImageApi(editingId, {
          title: formData.title,
          category: formData.category,
          medium: formData.medium,
          description: formData.description,
          year: formData.year,
          featured: formData.featured,
        });

        setImages((prev) =>
          prev.map((img) =>
            img._id === editingId ? { ...img, ...formData } : img
          )
        );

        setSuccessMessage("Image updated successfully!");
        setEditingId(null);
      } else {
        // Create new image
        if (!imageFile) {
          setError("Please select an image file");
          setSubmitting(false);
          return;
        }

        const uploadFormData = new FormData();
        uploadFormData.append("image", imageFile);
        uploadFormData.append("title", formData.title);
        uploadFormData.append("category", formData.category);
        uploadFormData.append("medium", formData.medium);
        uploadFormData.append("description", formData.description);
        uploadFormData.append("year", String(formData.year));
        uploadFormData.append("featured", String(formData.featured));

        const res = await createImage(uploadFormData);
        setImages((prev) => [res.data.data, ...prev]);
        setSuccessMessage("Image uploaded successfully!");
      }

      resetForm();
      setShowCreateForm(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Operation failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteImage = async (id: string) => {
    try {
      await deleteImageApi(id);
      setImages((prev) => prev.filter((img) => img._id !== id));
      setDeleteConfirm(null);
      setSuccessMessage("Image deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      setError("Delete failed. Please try again.");
    }
  };

  const handleEditImage = (img: any) => {
    setFormData({
      _id: img._id,
      title: img.title,
      category: img.category,
      medium: img.medium,
      description: img.description,
      year: img.year,
      featured: img.featured,
      image: img.image,
    });
    setEditingId(img._id);
    setShowCreateForm(true);
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
      medium: "",
      description: "",
      year: new Date().getFullYear(),
      featured: false,
    });
    setImageFile(null);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto">
        {/* Top Navigation Bar */}
        <div className="mb-8 sm:mb-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-lg shadow-md p-4 sm:p-6">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">Manage your art gallery</p>
          </div>
          
          {/* User Info & Logout */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Welcome back,</p>
              <p className="text-lg font-semibold text-gray-900">{user?.userName || "User"}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold transition duration-200 w-full sm:w-auto"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Header with Add Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 sm:mb-12">
          {!showCreateForm && (
            <button
              onClick={() => {
                setShowCreateForm(true);
                resetForm();
                setEditingId(null);
              }}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold transition duration-200"
            >
              + Add New Image
            </button>
          )}
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {successMessage}
          </div>
        )}

        {/* Create/Edit Form */}
        {showCreateForm && (
          <div className="mb-8 sm:mb-12 bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {editingId ? "Edit Image" : "Create New Image"}
              </h2>
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  resetForm();
                  setEditingId(null);
                }}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOrUpdate} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Enter image title"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Medium */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medium *
                  </label>
                  <input
                    type="text"
                    name="medium"
                    value={formData.medium}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="e.g., Oil on Canvas, Acrylic, etc."
                  />
                </div>

                {/* Year */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year
                  </label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  placeholder="Describe the artwork..."
                />
              </div>

              {/* Image Upload (Only for new images) */}
              {!editingId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      required={!editingId}
                      className="hidden w-full"
                      id="image-input"
                    />
                    <label htmlFor="image-input" className="cursor-pointer">
                      <div className="text-gray-600">
                        <p className="text-sm font-medium">Click to upload</p>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                        {imageFile && <p className="text-blue-600 mt-2 font-medium">{imageFile.name}</p>}
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* Current Image Preview (When editing) */}
              {editingId && formData.image && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Image
                  </label>
                  <img src={formData.image} alt={formData.title} className="w-full sm:w-64 h-40 object-cover rounded-lg" />
                </div>
              )}

              {/* Featured Checkbox */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="featured"
                  id="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                />
                <label htmlFor="featured" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Mark as Featured
                </label>
              </div>

              {/* Form Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 rounded-lg font-semibold transition duration-200"
                >
                  {submitting ? "Processing..." : editingId ? "Update Image" : "Upload Image"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    resetForm();
                    setEditingId(null);
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg font-semibold transition duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-600 mt-4">Loading images...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && images.length === 0 && !showCreateForm && (
          <div className="text-center py-12 sm:py-16">
            {/* <div className="text-6xl mb-4">🖼️</div> */}
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">No Images Yet</h2>
            <p className="text-gray-600 mb-6">Start by creating your first art gallery image.</p>
            <button
              onClick={() => {
                setShowCreateForm(true);
                resetForm();
                setEditingId(null);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200"
            >
              Create Your First Image
            </button>
          </div>
        )}

        {/* Images Grid */}
        {!loading && images.length > 0 && (
          <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {images.map((img) => (
              <div
                key={img._id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300 overflow-hidden group"
              >
                {/* Image Container */}
                <div className="relative overflow-hidden bg-gray-200 h-40 sm:h-48">
                  <img
                    src={img.image}
                    alt={img.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  {img.featured && (
                    <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-xs font-semibold">
                      Featured
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-3 sm:p-4">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-800 truncate">
                    {img.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-blue-600 font-medium mt-1">
                    {img.category}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    Medium: {img.medium}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Year: {img.year}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleEditImage(img)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded text-xs sm:text-sm font-medium transition duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(img._id)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded text-xs sm:text-sm font-medium transition duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                Confirm Delete
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this image? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleDeleteImage(deleteConfirm)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition duration-200"
                >
                  Delete
                </button>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg font-semibold transition duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;