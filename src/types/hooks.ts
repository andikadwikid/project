// Types and interfaces for custom hooks
import { ProductColor, ProductSize, ProductImage } from './product';

// Base entity interfaces for hooks
export interface HookBrand {
  id: number;
  code: string;
  name: string;
  productCount?: number;
}

export interface HookCategory {
  id: number;
  code: string;
  name: string;
  productCount?: number;
}

export interface HookColor {
  id: number;
  code: string;
  name: string;
  hexCode: string;
}

export interface HookSize {
  id: number;
  code: string;
  sizeLabel: string;
  cmValue?: number;
}

// API Response interfaces for hooks
export interface BrandsResponse {
  success: boolean;
  data: HookBrand[];
}

export interface CategoriesResponse {
  success: boolean;
  data: HookCategory[];
}

export interface ColorsResponse {
  success: boolean;
  data: HookColor[];
}

export interface SizesResponse {
  success: boolean;
  data: HookSize[];
}

export interface ProductsResponse {
  success: boolean;
  data: {
    products: HookProduct[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

// Hook parameter interfaces
export interface UseProductsParams {
  category?: string;
  brand?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface HookPromotion {
  id: number;
  title: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
}

export interface HookProduct {
  id: string | number;
  code: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: HookCategory;
  brand: HookBrand;
  description?: string;
  isActive?: boolean;
  isNew?: boolean;
  isSale?: boolean;
  rating?: number;
  reviews?: number;
  colors?: ProductColor[];
  sizes?: ProductSize[];
  images?: ProductImage[];
  promotion?: HookPromotion | null;
}

export interface UseProductResult {
  product: HookProduct | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}