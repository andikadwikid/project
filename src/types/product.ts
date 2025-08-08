export interface ProductImage {
  id: number;
  productId: number;
  colorId?: number;
  imageUrl: string;
  isPrimary: boolean;
  sortOrder: number;
  color?: {
    id: number;
    colorName: string;
    hexCode: string;
  };
}

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
  sizes: Array<{ name: string }>;
  colors: Array<{ name: string; value: string }>;
  isNew?: boolean;
  isSale?: boolean;
  rating?: number;
  reviews?: number;
  productImages?: ProductImage[];
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