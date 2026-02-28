import axios from 'axios';

const BASE_URL = import.meta.env.VITE_IMAGEKIT_BASE_URL || '';
const SERVER_API = import.meta.env.VITE_IMAGEKIT_SERVER_API || '';

export const getImageUrl = (filePath: string, transformation?: string): string => {
  if (!filePath) return '';
  if (BASE_URL) {
    const t = transformation ? `${transformation}/` : '';
    return `${BASE_URL}/${t}${filePath}`;
  }
  return `/assets/${filePath}`;
};

export const fetchImageMetadata = async (filePath: string) => {
  if (!SERVER_API) throw new Error('VITE_IMAGEKIT_SERVER_API not set');
  const res = await axios.get(`${SERVER_API}/imagekit/file`, { params: { path: filePath } });
  return res.data;
};

export default {
  getImageUrl,
  fetchImageMetadata,
};
