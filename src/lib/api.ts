import axios from "axios";
import type { PaginatedResponse, Artwork } from "@/data/artworks";

const API_URL = import.meta.env.VITE_API_URL;

axios.defaults.withCredentials = true;

export const registerUser = async (data: {
  userName: string;
  password: string;
}) => {
  return axios.post(`${API_URL}/api/users/register`, data);
};

export const loginUser = async (data: {
  userName: string;
  password: string;
}) => {
  return axios.post(`${API_URL}/api/users/login`, data);
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
