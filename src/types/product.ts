export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  category: string;
  brand: string;
  description: string;
  sizes: string[];
  colors: string[];
  isNew?: boolean;
  isSale?: boolean;
  rating?: number;
  reviews?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  description: string;
}