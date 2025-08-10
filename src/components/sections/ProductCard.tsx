'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useState } from 'react';
import ProductOptionsModal from '@/components/cart/ProductOptionsModal';
import { ProductCardProps } from '@/types/components';

const ProductCard = ({ product }: ProductCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  useEffect(() => {
    const card = cardRef.current;
    const image = imageRef.current;
    const content = contentRef.current;

    if (!card || !image || !content) return;

    // Set initial state
    gsap.set(card, { opacity: 0, y: 30 });

    // Entrance animation
    gsap.to(card, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out",
      delay: Math.random() * 0.3 // Stagger effect
    });

    // Hover animations
    const handleMouseEnter = () => {
      gsap.to(image, {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out"
      });
      gsap.to(card, {
        y: -5,
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        duration: 0.3,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      gsap.to(image, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
      gsap.to(card, {
        y: 0,
        boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
        duration: 0.3,
        ease: "power2.out"
      });
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <Card className="group overflow-hidden border-0 shadow-sm transition-all duration-300 bg-white h-full flex flex-col">
      <CardContent className="p-0 flex flex-col h-full">
        {/* Image Container */}
        <Link href={`/product/${product.id}`}>
          <div ref={imageRef} className="relative aspect-square overflow-hidden bg-gradient-to-br from-pink-50 to-rose-50 cursor-pointer">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Badges */}
            <div className="absolute top-2 left-2 md:top-3 md:left-3 flex flex-col gap-1 md:gap-2">
              {product.isNew && (
                <Badge className="bg-pink-500 hover:bg-pink-600 text-white text-xs">
                  New
                </Badge>
              )}
              {product.isSale && (
                <Badge className="bg-red-500 hover:bg-red-600 text-white text-xs">
                  Sale
                </Badge>
              )}
              {product.promotion && (
                <Badge className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-xs font-semibold">
                  {product.promotion.discountType === 'percentage'
                    ? `-${product.promotion.discountValue}%`
                    : `-${formatPrice(product.promotion.discountValue)}`
                  }
                </Badge>
              )}
            </div>

            {/* Wishlist Button - Hidden on mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:block absolute top-3 right-3 bg-white/80 hover:bg-white text-gray-600 hover:text-pink-600 opacity-0 group-hover:opacity-100 transition-all duration-300"
            >
              <Heart className="h-4 w-4" />
            </Button>

            {/* Quick Add Button - Hidden on mobile */}
            <Button
              size="sm"
              className="flex cursor-pointer absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-pink-600 hover:bg-pink-700 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </Link>

        {/* Product Options Modal */}
        <ProductOptionsModal
          product={product}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />

        {/* Product Info */}
        <div ref={contentRef} className="p-2 md:p-4 flex-1 flex flex-col">
          <div className="space-y-1 md:space-y-3 flex-1">
            {/* Brand - Hidden on mobile */}
            <p className="hidden md:block text-xs font-medium text-pink-600 uppercase tracking-wide">
              {product.brand.name}
            </p>


            {/* Product Name */}
            <Link href={`/product/${product.id}`}>
              <h3 className="font-semibold text-gray-900 hover:text-pink-600 transition-colors duration-200 line-clamp-2 text-sm md:text-base">
                {product.name}
              </h3>
            </Link>

            {/* Rating - Hidden on mobile */}
            {/* {product.rating && (
              <div className="hidden md:flex items-center space-x-1">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${i < Math.floor(product.rating!)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                        }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500">({product.reviews})</span>
              </div>
            )} */}
          </div>

          {/* Price */}
          <div className="flex flex-col md:flex-row items-start space-x-2 gap-3 h-8 justify-center md:justify-start mt-auto">
            {product.promotion && product.originalPrice ? (
              <div className="flex flex-col md:flex-row items-start gap-1 md:gap-2">
                <span className="text-sm md:text-lg font-bold text-red-600">
                  {formatPrice(product.price)}
                </span>
                <div className='flex flex-row gap-2'>
                  <span className="text-xs md:text-sm text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  {product.promotion.discountType === 'percentage' && (
                    <span className="text-xs text-green-600 font-medium">
                      Save {product.promotion.discountValue}%
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <span className="text-sm md:text-lg font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Promotion Info - Show on all devices */}
          {product.promotion && (
            <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-2 my-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-orange-800">
                  🎉 {product.promotion.title}
                </span>
                <Badge variant="outline" className="text-xs border-orange-300 text-orange-700">
                  Limited Time
                </Badge>
              </div>
            </div>
          )}

          {/* Available Colors - Hidden on mobile */}
          {product.colors && product.colors.length > 0 && (
            <div className="hidden md:flex items-center space-x-2">
              <span className="text-xs text-gray-500">Colors:</span>
              <div className="flex space-x-1">
                {product.colors.slice(0, 3).map((color, index) => (
                  <div
                    key={color.id || index}
                    className="w-4 h-4 rounded-full border border-gray-200"
                    style={{
                      backgroundColor: color.hexCode || '#6b7280'
                    }}
                    title={color.colorName || 'Unknown Color'}
                  />
                ))}
                {product.colors.length > 3 && (
                  <span className="text-xs text-gray-400">+{product.colors.length - 3}</span>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;