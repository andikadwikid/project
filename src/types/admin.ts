// Admin-specific types and interfaces

// Base entity interfaces for admin operations
export interface AdminCategory {
  id: number;
  name: string;
  code: string;
  productCount?: number;
}

export interface AdminBrand {
  id: number;
  name: string;
  code: string;
  productCount?: number;
}

export interface AdminColor {
  id: number;
  name: string;
  hexCode: string;
  code: string;
  productCount?: number;
}

export interface AdminSize {
  id: number;
  sizeLabel: string;
  code: string;
  cmValue?: number;
  productCount?: number;
  pivotId?: number;
}

// Size template related interfaces
export interface SizeTemplateItem {
  id?: number;
  sizeId: number;
  cmValue: number;
  sortOrder: number;
  size?: {
    id: number;
    sizeLabel: string;
  };
}

export interface SizeTemplate {
  id: number;
  name: string;
  description?: string;
  templateSizes: SizeTemplateItem[];
  isActive?: boolean;
}

// Product admin interfaces
export interface AdminProductImage {
  id: number;
  imageUrl: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface AdminProductData {
  id: number;
  code: string;
  name: string;
  description?: string;
  categoryId: number;
  brandId: number;
  price: number;
  isActive: boolean;
  category: AdminCategory;
  brand: AdminBrand;
  selectedColors: number[];
  selectedSizes: { id: number; cmValue?: number }[];
  images: string[];
}

// API Response interfaces
export interface AdminProductsResponse {
  success: boolean;
  data: {
    products: AdminProductData[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

// Import related interfaces
export interface ExcelRow {
  name: string;
  code: string;
  description?: string;
  categoryCode: string;
  brandCode: string;
  price: string;
  colorCodes?: string; // comma-separated color codes
  sizeCodes?: string; // comma-separated size codes
  imageUrls?: string; // comma-separated image filenames from ZIP
  isActive?: string;
}

export interface ProcessedImage {
  filename: string;
  url: string;
  buffer: Buffer;
}

export interface ExtractedImage {
  filename: string;
  buffer: Buffer;
}