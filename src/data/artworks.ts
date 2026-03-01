export interface Artwork {
  _id: string;
  title: string;
  category: string;
  medium: string;
  description: string;
  year: string;
  image: string;
  featured?: boolean;
}

export interface PaginatedResponse {
  data: Artwork[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}