// Main types export file

// Re-export all types from different modules
export * from './product';
export * from './admin';
export * from './hooks';
export * from './components';

// Common utility types
export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PaginatedResponse<T> = {
  success: boolean;
  data: {
    items: T[];
    pagination: PaginationMeta;
  };
};

// Form and validation types
export type FormErrors<T> = {
  [K in keyof T]?: string;
};

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface BaseEntity {
  id: number;
  createdAt?: string;
  updatedAt?: string;
}