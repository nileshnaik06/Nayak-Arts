import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const AdminDashboard = () => {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchImages = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/images`, {
        withCredentials: true,
      });

      setImages(res?.data?.data || []);
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch images. Please login again.");
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/api/images/${id}`, {
        withCredentials: true,
      });

      setImages((prev) => prev.filter((img) => img._id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-gray-800">
          Admin Dashboard
        </h1>

        {loading && (
          <p className="text-gray-500 text-center py-10">
            Loading images...
          </p>
        )}

        {error && (
          <p className="text-red-500 text-center py-6">
            {error}
          </p>
        )}

        {!loading && images.length === 0 && (
          <p className="text-gray-500 text-center py-10">
            No images found.
          </p>
        )}

        {/* Responsive Grid */}
        <div className="grid gap-6 
                        grid-cols-1 
                        sm:grid-cols-2 
                        md:grid-cols-3 
                        lg:grid-cols-4">
          {images.map((img) => (
            <div
              key={img._id}
              className="bg-white rounded-xl shadow-md overflow-hidden 
                         hover:shadow-lg transition duration-300"
            >
              <img
                src={img.image}
                alt={img.title}
                className="w-full h-48 object-cover"
              />

              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 truncate">
                  {img.title}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {img.category}
                </p>

                <button
                  onClick={() => deleteImage(img._id)}
                  className="mt-4 w-full bg-red-500 
                             hover:bg-red-600 
                             text-white 
                             py-2 rounded-lg 
                             text-sm 
                             transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;