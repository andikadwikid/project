// Types and interfaces for React components
import { Product, ProductColor, ProductSize } from './product';
import { HookProduct } from './hooks';

// Cart related interfaces
export interface CartItem {
  id: string;
  product: HookProduct;
  quantity: number;
  selectedColor?: ProductColor;
  selectedSize?: ProductSize;
  price: number;
}

export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  isOpen: boolean;
}

export type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'id'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

export interface CartContextType {
  state: CartState;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

// Component prop interfaces
export interface CartDrawerProps {
  isOpen: boolean;
  closeCart: () => void;
}

export interface ProductCardProps {
  product: HookProduct;
}

export interface ProductOptionsModalProps {
  product: HookProduct;
  isOpen: boolean;
  onClose: () => void;
}

export interface FileUploadProps {
  onUpload: (urls: string[]) => void;
  existingImages?: string[];
  maxFiles?: number;
  folder?: string;
  className?: string;
  accept?: string;
  maxSize?: number;
}

export interface UploadedFile {
  url: string;
  filename: string;
  uploading?: boolean;
}

export interface WhatsAppButtonProps {
  phoneNumber: string;
  message?: string;
  className?: string;
}