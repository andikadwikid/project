'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ShoppingBag, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ProductColor, ProductSize } from '@/types/product';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';

import { ProductOptionsModalProps } from '@/types/components';

const ProductOptionsModal = ({ product, isOpen, onClose }: ProductOptionsModalProps) => {
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(
    product.colors && product.colors.length > 0 ? product.colors[0] : null
  );
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const { addItem, openCart } = useCart();

  const handleAddToCart = () => {
    // Validation
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      toast.error('Please select a color');
      return;
    }

    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }

    // Add item to cart
    addItem({
      product,
      quantity,
      selectedColor: selectedColor || undefined,
      selectedSize: selectedSize || undefined,
      price: product.price
    });

    // Show success toast
    toast.success(`${product.name} added to cart!`, {
      description: `${quantity} item(s) added to your shopping cart.`,
      action: {
        label: 'View Cart',
        onClick: () => openCart()
      }
    });

    // Close modal
    onClose();
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg mx-auto max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-left text-xl font-bold">Select Options</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          {/* Product Info */}
          <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="relative w-24 h-24 bg-white rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 line-clamp-2 text-base">
                {product.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {product.brand.name}
              </p>
              <p className="font-bold text-pink-600 mt-2 text-lg">
                {formatPrice(product.price)}
              </p>
            </div>
          </div>

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 text-base">Color</h4>
              <div className="grid grid-cols-2 gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(color)}
                    className={`relative flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all hover:shadow-md ${
                      selectedColor?.id === color.id
                        ? 'border-pink-500 bg-pink-50 text-pink-700 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div
                      className="w-5 h-5 rounded-full border-2 border-gray-300 shadow-sm"
                      style={{ backgroundColor: color.hexCode }}
                    />
                    <span className="text-sm font-medium">{color.colorName}</span>
                    {selectedColor?.id === color.id && (
                      <Check className="w-4 h-4 text-pink-600 ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 text-base">Size</h4>
              <div className="grid grid-cols-3 gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size)}
                    className={`relative px-4 py-3 text-sm font-medium rounded-lg border-2 transition-all hover:shadow-md ${
                      selectedSize?.id === size.id
                        ? 'border-pink-500 bg-pink-500 text-white shadow-md'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'
                    }`}
                  >
                    <div className="text-center">
                      <div className="font-semibold">{size.sizeLabel}</div>
                      {size.cmValue && (
                        <div className="text-xs opacity-75 mt-1">
                          {size.cmValue}cm
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selection */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 text-base">Quantity</h4>
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                className="h-12 w-12 p-0 rounded-full border-2 hover:bg-gray-50"
              >
                -
              </Button>
              <div className="bg-gray-50 px-6 py-3 rounded-lg border-2">
                <span className="text-xl font-bold text-gray-900">{quantity}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= 10}
                className="h-12 w-12 p-0 rounded-full border-2 hover:bg-gray-50"
              >
                +
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 pt-6 border-t">
          <div className="flex gap-3 w-full">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 h-12 text-base font-medium"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddToCart}
              className="flex-1 h-12 text-base font-medium bg-pink-600 hover:bg-pink-700"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Add to Cart
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductOptionsModal;