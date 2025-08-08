'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Plus, Minus, ShoppingBag, Trash2, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/utils';

const CartDrawer = () => {
  const { state, removeItem, updateQuantity, clearCart, closeCart } = useCart();
  const { items, total, itemCount, isOpen } = state;

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const generateWhatsAppMessage = () => {
    let message = "Halo! Saya ingin memesan produk berikut:\n\n";
    
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.product.name}\n`;
      message += `   Brand: ${item.product.brand?.name || 'N/A'}\n`;
      if (item.selectedColor && item.selectedColor.colorName) {
        message += `   Warna: ${item.selectedColor.colorName}\n`;
      }
      if (item.selectedSize && item.selectedSize.sizeLabel) {
        message += `   Ukuran: ${item.selectedSize.sizeLabel}\n`;
      }
      message += `   Kuantitas: ${item.quantity}\n`;
      message += `   Harga: ${formatPrice(item.product.price * item.quantity)}\n\n`;
    });
    
    message += `Total Pesanan: ${formatPrice(total)}\n\n`;
    message += "Mohon konfirmasi ketersediaan dan proses pembayaran. Terima kasih!";
    
    return encodeURIComponent(message);
  };

  const handleWhatsAppCheckout = () => {
    const message = generateWhatsAppMessage();
    const phoneNumber = "6281234567890"; // Ganti dengan nomor WhatsApp toko
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Shopping Cart
              {itemCount > 0 && (
                <Badge variant="secondary">{itemCount}</Badge>
              )}
            </span>
            {items.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCart}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-600 mb-6">Add some products to get started</p>
              <Button onClick={closeCart} asChild>
                <Link href="/catalog">
                  Continue Shopping
                </Link>
              </Button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                    {/* Product Image */}
                    <div className="relative w-16 h-16 bg-white rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <Link href={`/product/${item.product.id}`} onClick={closeCart}>
                        <h4 className="font-medium text-gray-900 hover:text-pink-600 transition-colors line-clamp-2 text-sm">
                          {item.product.name}
                        </h4>
                      </Link>
                      
                      <div className="mt-1 space-y-1">
                        <p className="text-xs text-gray-500">
                          {item.product.brand.name}
                        </p>
                        
                        {/* Selected Options */}
                        <div className="flex flex-wrap gap-2 text-xs">
                          {item.selectedColor && (
                            <div className="flex items-center gap-1">
                              <div 
                                className="w-3 h-3 rounded-full border border-gray-200"
                                style={{ backgroundColor: item.selectedColor.hexCode }}
                              />
                              <span className="text-gray-600">{item.selectedColor.colorName}</span>
                            </div>
                          )}
                          {item.selectedSize && (
                            <Badge variant="outline" className="text-xs px-1 py-0">
                              Size {item.selectedSize.sizeLabel}
                            </Badge>
                          )}
                        </div>
                        
                        {/* Price */}
                        <p className="font-semibold text-gray-900">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                    </div>

                    {/* Quantity Controls & Remove */}
                    <div className="flex flex-col items-end justify-between">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-600 p-1 h-auto"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}
              <div className="border-t pt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total:</span>
                  <span className="text-xl font-bold text-pink-600">
                    {formatPrice(total)}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700" 
                    size="lg"
                    onClick={handleWhatsAppCheckout}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Checkout via WhatsApp ({itemCount} items)
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={closeCart}
                    asChild
                  >
                    <Link href="/catalog">
                      Continue Shopping
                    </Link>
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;