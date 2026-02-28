import { getImageUrl } from '@/lib/imagekit';

export interface Artwork {
  id: string;
  title: string;
  category: string;
  medium: string;
  description: string;
  year: number;
  image: string;
  featured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  artworkCount: number;
}

export const categories: Category[] = [
  {
    id: 'thermocol',
    name: 'Thermocol Art',
    description: 'Intricate sculptures carved from foam, transforming ordinary materials into extraordinary art pieces.',
    image: 'artwork-thermocol-1.jpg',
    artworkCount: 12,
  },
  {
    id: 'paintings',
    name: 'Paintings',
    description: 'Expressive works on canvas exploring color, texture, and emotion through various techniques.',
    image: 'artwork-painting-1.jpg',
    artworkCount: 24,
  },
  {
    id: 'models',
    name: 'Model Creations',
    description: 'Detailed architectural and sculptural models showcasing precision and creative vision.',
    image: 'artwork-model-1.jpg',
    artworkCount: 8,
  },
  {
    id: 'diy',
    name: 'DIY Art',
    description: 'Handcrafted pieces created from recycled and found materials with sustainable creativity.',
    image: 'artwork-diy-1.jpg',
    artworkCount: 15,
  },
  {
    id: 'experimental',
    name: 'Experimental',
    description: 'Mixed media explorations pushing boundaries and blending multiple artistic disciplines.',
    image: 'artwork-experimental-1.jpg',
    artworkCount: 10,
  },
];

export const artworks: Artwork[] = [
  {
    id: '1',
    title: 'Celestial Geometry',
    category: 'thermocol',
    medium: 'Carved Thermocol',
    description: 'A spherical sculpture featuring intricate geometric patterns inspired by sacred geometry and cosmic structures.',
    year: 2024,
    image: 'artwork-thermocol-1.jpg',
    featured: true,
  },
  {
    id: '2',
    title: 'Floral Symphony',
    category: 'thermocol',
    medium: 'Carved Thermocol Relief',
    description: 'An elaborate wall piece showcasing hand-carved floral motifs with delicate scrollwork details.',
    year: 2023,
    image: 'artwork-thermocol-2.jpg',
    featured: true,
  },
  {
    id: '3',
    title: 'Autumn Whispers',
    category: 'paintings',
    medium: 'Oil on Canvas',
    description: 'An abstract expressionist piece capturing the warmth and movement of autumn through bold brushstrokes.',
    year: 2024,
    image: 'artwork-painting-1.jpg',
    featured: true,
  },
  {
    id: '4',
    title: 'Rolling Horizons',
    category: 'paintings',
    medium: 'Acrylic on Canvas',
    description: 'A contemporary landscape depicting the gentle undulation of hills in muted, earthy tones.',
    year: 2023,
    image: 'artwork-painting-2.jpg',
  },
  {
    id: '5',
    title: 'Heritage Manor',
    category: 'models',
    medium: 'Mixed Materials Model',
    description: 'A detailed architectural scale model of a traditional European manor house with intricate detailing.',
    year: 2024,
    image: 'artwork-model-1.jpg',
    featured: true,
  },
  {
    id: '6',
    title: 'Nature\'s Cabinet',
    category: 'diy',
    medium: 'Found Objects & Recycled Materials',
    description: 'A curated assemblage of natural materials and vintage papers celebrating organic textures.',
    year: 2024,
    image: 'artwork-diy-1.jpg',
    featured: true,
  },
  {
    id: '7',
    title: 'Layered Memories',
    category: 'experimental',
    medium: 'Mixed Media Collage',
    description: 'A textural exploration combining paper, fabric, and paint to create depth and visual intrigue.',
    year: 2024,
    image: 'artwork-experimental-1.jpg',
    featured: true,
  },
];

export const getArtworksByCategory = (categoryId: string): Artwork[] => {
  return artworks
    .filter((artwork) => artwork.category === categoryId)
    .map((a) => ({ ...a, image: getImageUrl(a.image) }));
};

export const getFeaturedArtworks = (): Artwork[] => {
  return artworks.filter((artwork) => artwork.featured).map((a) => ({ ...a, image: getImageUrl(a.image) }));
};

export const getCategoryById = (categoryId: string): Category | undefined => {
  const cat = categories.find((category) => category.id === categoryId);
  if (!cat) return undefined;
  return { ...cat, image: getImageUrl(cat.image) };
};
