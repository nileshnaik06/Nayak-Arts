import axios from "axios";
import type { PaginatedResponse, Artwork } from "@/data/artworks";

const API_URL = import.meta.env.VITE_API_URL;

axios.defaults.withCredentials = true;

export const registerUser = async (data: {
  userName: string;
  password: string;
}) => {
  return axios.post(`${API_URL}/api/user/register`, data);
};

export const loginUser = async (data: {
  userName: string;
  password: string;
}) => {
  return axios.post(`${API_URL}/api/user/login`, data);
};

export const getArtworks = async (params?: any): Promise<PaginatedResponse> => {
  const res = await axios.get(`${API_URL}/api/images`, {
    params,
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
