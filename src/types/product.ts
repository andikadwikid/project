export interface ProductImage {
  id: number;
  productId: number;
  productColorId?: number;
  colorId?: number;
  imageUrl: string;
  isPrimary: boolean;
  sortOrder: number;
  productColor?: {
    color: {
      id: number;
      name: string;
      hexCode: string;
    };
  };
}

export interface ProductColor {
  id: number;
  code: string;
  colorName: string;
  hexCode: string;
  imageUrl?: string;
}

export interface ProductSize {
  id: number;
  code: string;
  sizeLabel: string;
  cmValue?: number;
  pivotId?: number;
}

export interface ProductSizePivot {
  id: number;
  productId: number;
  sizeId: number;
  cmValue?: number;
  size: {
    id: number;
    code: string;
    sizeLabel: string;
    cmValue?: number;
  };
}

export interface Product {
  id: string | number;
  code: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: ProductImage[];
  category: {
    id: number;
    name: string;
    code: string;
  };
  brand: {
    id: number;
    name: string;
    code: string;
  };
  description: string;
  sizes?: ProductSize[];
  colors?: ProductColor[];
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