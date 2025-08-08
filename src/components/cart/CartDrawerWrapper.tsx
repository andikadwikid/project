'use client';

import { useCart } from '@/contexts/CartContext';
import CartDrawer from './CartDrawer';

export default function CartDrawerWrapper() {
  const { state, closeCart } = useCart();
  return <CartDrawer isOpen={state.isOpen} closeCart={closeCart} />;
}