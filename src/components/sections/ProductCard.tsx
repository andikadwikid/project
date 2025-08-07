'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, Star, ShoppingBag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types/product';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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
    <Card ref={cardRef} className="group overflow-hidden border-0 shadow-sm transition-all duration-300 bg-white">
      <CardContent className="p-0">
        {/* Image Container */}
        <div ref={imageRef} className="relative aspect-square overflow-hidden bg-gradient-to-br from-pink-50 to-rose-50">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
              <Badge className="bg-pink-500 hover:bg-pink-600 text-white">
                New
              </Badge>
            )}
            {product.isSale && (
              <Badge className="bg-red-500 hover:bg-red-600 text-white">
                Sale
              </Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 bg-white/80 hover:bg-white text-gray-600 hover:text-pink-600 opacity-0 group-hover:opacity-100 transition-all duration-300"
          >
            <Heart className="h-4 w-4" />
          </Button>

          {/* Quick Add Button */}
          <Button
            size="sm"
            className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-pink-600 hover:bg-pink-700 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0"
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>

        {/* Product Info */}
        <div ref={contentRef} className="p-4 space-y-3">
          {/* Brand */}
          <p className="text-xs font-medium text-pink-600 uppercase tracking-wide">
            {product.brand}
          </p>

          {/* Product Name */}
          <Link href={`/product/${product.id}`}>
            <h3 className="font-semibold text-gray-900 hover:text-pink-600 transition-colors duration-200 line-clamp-2">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center space-x-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(product.rating!)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">({product.reviews})</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Available Colors */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">Colors:</span>
            <div className="flex space-x-1">
              {product.colors.slice(0, 3).map((color, index) => (
                <div
                  key={index}
                  className="w-4 h-4 rounded-full border border-gray-200"
                  style={{
                    backgroundColor: color.toLowerCase().includes('pink') ? '#ec4899' :
                                   color.toLowerCase().includes('rose') ? '#f43f5e' :
                                   color.toLowerCase().includes('black') ? '#000000' :
                                   color.toLowerCase().includes('white') ? '#ffffff' :
                                   color.toLowerCase().includes('nude') ? '#d4a574' :
                                   color.toLowerCase().includes('burgundy') ? '#7c2d12' :
                                   color.toLowerCase().includes('lavender') ? '#a855f7' :
                                   '#6b7280'
                  }}
                  title={color}
                />
              ))}
              {product.colors.length > 3 && (
                <span className="text-xs text-gray-400">+{product.colors.length - 3}</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;