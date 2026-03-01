export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
}

export const categories: Category[] = [
  {
    id: "Thermacol Art",
    name: "Thermacol Art",
    description:
      "Intricate sculptures carved from foam transforming materials into art.",
    image: "/category-images/thermocol.jpg",
  },
  {
    id: "Paintings",
    name: "Paintings",
    description:
      "Expressive works on canvas exploring color and texture.",
    image: "/category-images/paintings.jpg",
  },
  {
    id: "Model Creaetion",
    name: "Model Creation",
    description:
      "Detailed architectural and sculptural models.",
    image: "/category-images/models.jpg",
  },
  {
    id: "DIY Art",
    name: "DIY Art",
    description:
      "Handcrafted art created from recycled materials.",
    image: "/category-images/diy.jpg",
  },
  {
    id: "Experimental",
    name: "Experimental",
    description:
      "Mixed media explorations pushing creative boundaries.",
    image: "/category-images/experimental.jpg",
  },
];