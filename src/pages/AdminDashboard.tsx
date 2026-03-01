import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const AdminDashboard = () => {
  const [images, setImages] = useState<any[]>([]);

  const fetchImages = async () => {
    const res = await axios.get(`${API_URL}/api/images`, {
      withCredentials: true,
    });
    setImages(res.data.data);
  };

  const deleteImage = async (id: string) => {
    await axios.delete(`${API_URL}/api/images/${id}`, {
      withCredentials: true,
    });
    fetchImages();
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>

      {images.map((img) => (
        <div key={img._id}>
          <img src={img.image} width={100} />
          <button onClick={() => deleteImage(img._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;
