'use client';

import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';

const CartIcon = () => {
  const { state, toggleCart } = useCart();
  const { itemCount } = state;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleCart}
      className="relative hover:bg-pink-50 hover:text-pink-600 transition-colors"
      aria-label={`Shopping cart with ${itemCount} items`}
    >
      <ShoppingBag className="h-5 w-5" />
      {itemCount > 0 && (
        <Badge 
          variant="destructive" 
          className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-pink-600 hover:bg-pink-700"
        >
          {itemCount > 99 ? '99+' : itemCount}
        </Badge>
      )}
    </Button>
  );
};

export default CartIcon;