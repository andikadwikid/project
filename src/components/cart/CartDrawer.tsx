'use client';

import { ShoppingCart, Trash2, Plus, Minus, X } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from '@/components/ui/drawer';

interface CartDrawerProps {
  isOpen: boolean;
  closeCart: () => void;
}

export default function CartDrawer({ isOpen, closeCart }: CartDrawerProps) {
  const { state, updateQuantity, removeItem, clearCart } = useCart();

  const handleWhatsAppCheckout = () => {
    const phoneNumber = '6281234567890'; // Ganti dengan nomor WhatsApp toko
    
    let message = 'Halo, saya ingin memesan produk berikut:\n\n';
    
    state.items.forEach((item, index) => {
      message += `${index + 1}. ${item.product.name}\n`;
      message += `   Brand: ${item.product.brand.name}\n`;
      
      if (item.selectedColor && item.selectedColor.colorName) {
        message += `   Warna: ${item.selectedColor.colorName}\n`;
      }
      
      if (item.selectedSize && item.selectedSize.sizeLabel) {
        message += `   Ukuran: ${item.selectedSize.sizeLabel}\n`;
      }
      
      message += `   Harga: ${formatPrice(item.price)}\n`;
      message += `   Jumlah: ${item.quantity}\n`;
      message += `   Subtotal: ${formatPrice(item.price * item.quantity)}\n\n`;
    });
    
    message += `Total: ${formatPrice(state.total)}`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && closeCart()} direction="right">
      <DrawerContent className="h-full max-w-md">
        <DrawerHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingCart className="h-6 w-6" />
              <DrawerTitle className="text-xl font-semibold">Shopping Cart</DrawerTitle>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                {state.itemCount}
              </span>
            </div>
            <DrawerClose asChild>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="h-5 w-5" />
              </button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="flex flex-col h-full">
          {state.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 text-center p-8">
              <ShoppingCart className="h-20 w-20 text-gray-300 mb-6" />
              <h3 className="text-xl font-medium text-gray-900 mb-3">Your cart is empty</h3>
              <p className="text-gray-500 mb-8">Add some products to get started!</p>
              <Link 
                href="/catalog"
                onClick={closeCart}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {state.items.map((item) => (
                  <div key={`${item.id}-${item.selectedColor?.id || 'no-color'}-${item.selectedSize?.id || 'no-size'}`} className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {(() => {
                          // Handle different image data structures
                          let imageUrl = '';
                          
                          // Check if images is an array of ProductImage objects
                          if (item.product.images && Array.isArray(item.product.images) && item.product.images.length > 0) {
                            if (typeof item.product.images[0] === 'object' && item.product.images[0].imageUrl) {
                              imageUrl = item.product.images[0].imageUrl;
                            } else if (typeof item.product.images[0] === 'string') {
                              imageUrl = item.product.images[0];
                            }
                          }
                          
                          // Fallback to single image property
                          if (!imageUrl && item.product.image) {
                            imageUrl = item.product.image;
                          }
                          
                          return imageUrl && imageUrl.trim() !== '' ? (
                            <Image
                              src={imageUrl}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <ShoppingCart className="h-8 w-8 text-gray-400" />
                            </div>
                          );
                        })()}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{item.product.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{item.product.brand.name}</p>
                        
                        {/* Selected Options */}
                        <div className="space-y-1 mb-3">
                          {item.selectedColor && (
                            <div className="flex items-center gap-2">
                              <div 
                                 className="w-4 h-4 rounded-full border-2 border-gray-300"
                                 style={{ backgroundColor: item.selectedColor.hexCode }}
                               />
                              <span className="text-sm text-gray-600">{item.selectedColor.colorName}</span>
                            </div>
                          )}
                          {item.selectedSize && (
                            <div className="text-sm text-gray-600">
                               Size: {item.selectedSize.sizeLabel}
                             </div>
                          )}
                        </div>

                        {/* Price and Quantity */}
                        <div className="flex items-center justify-between">
                          <div className="text-lg font-bold text-gray-900">
                            {formatPrice(item.price)}
                          </div>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2">
                            <button
                               onClick={() => updateQuantity(item.id, item.quantity - 1)}
                               className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                               disabled={item.quantity <= 1}
                             >
                               <Minus className="h-4 w-4" />
                             </button>
                             <span className="w-8 text-center font-medium">{item.quantity}</span>
                             <button
                               onClick={() => updateQuantity(item.id, item.quantity + 1)}
                               className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                             >
                               <Plus className="h-4 w-4" />
                             </button>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                           onClick={() => removeItem(item.id)}
                           className="mt-2 text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                         >
                           Remove
                         </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}
              <div className="border-t bg-gray-50 p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-2xl font-bold text-blue-600">{formatPrice(state.total)}</span>
                </div>
                
                <div className="space-y-3">
                  <button
                    onClick={handleWhatsAppCheckout}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.382"/>
                    </svg>
                    Checkout via WhatsApp
                  </button>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        clearCart();
                        closeCart();
                      }}
                      className="flex-1 bg-red-50 text-red-600 py-2 px-4 rounded-lg hover:bg-red-100 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Clear
                    </button>
                    <button
                      onClick={closeCart}
                      className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}