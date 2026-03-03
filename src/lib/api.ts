import axios from "axios";
import type { PaginatedResponse, Artwork } from "@/data/artworks";

const API_URL = import.meta.env.VITE_API_URL;
const token = localStorage.getItem("token");

axios.defaults.withCredentials = true;

export const registerUser = async (data: {
  userName: string;
  password: string;
}) => {
  const response = await axios.post(`${API_URL}/api/user/register`, data);
  return response.data;
};

export const loginUser = async (data: {
  userName: string;
  password: string;
}) => {
  const response = await axios.post(`${API_URL}/api/user/login`, data);
  return response.data;
};

export const getCurrentUser = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/user/me`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch current user:", error);
    throw error;
  }
};

export const getArtworks = async (params?: any): Promise<PaginatedResponse> => {
  const res = await axios.get(`${API_URL}/api/images`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const getSingleArtwork = async (id: string): Promise<Artwork> => {
  const res = await axios.get(`${API_URL}/api/images/${id}`);
  return res.data;
};

export const createImage = async (formData: FormData) => {
  return axios.post(`${API_URL}/api/images`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });
};

export const updateImage = async (id: string, data: any) => {
  return axios.put(`${API_URL}/api/images/${id}`, data);
};

export const deleteImage = async (id: string) => {
  return axios.delete(`${API_URL}/api/images/${id}`);
};
