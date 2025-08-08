'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Heart, Share2, ShoppingBag, Plus, Minus, Star, Truck, Shield, RotateCcw, Ruler } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useProduct } from '@/hooks/useProduct';
import { ProductColor, ProductSize, ProductImage } from '@/types/product';

gsap.registerPlugin(ScrollTrigger);

const ProductDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  
  const { product, loading, error } = useProduct(productId);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  
  const heroRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  // Set default selections when product loads
  useEffect(() => {
    if (product) {
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0]);
      }
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      }
    }
  }, [product]);

  useEffect(() => {
    if (!loading && product) {
      const hero = heroRef.current;
      const image = imageRef.current;
      const details = detailsRef.current;

      if (hero && image && details) {
        gsap.set([image, details], { opacity: 0, y: 30 });
        
        const tl = gsap.timeline();
        tl.to(image, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" })
          .to(details, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.4");
      }
    }
  }, [loading, product]);

  const handleQuantityChange = (change: number) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      alert('Please select color and size');
      return;
    }
    // Add to cart logic here
    console.log('Added to cart:', {
      productId: product?.id,
      color: selectedColor?.code,
      size: selectedSize?.code,
      quantity
    });
  };

  const getFilteredImages = () => {
    if (!product?.images) return [];
    
    if (!selectedColor) return product.images;
    
    const colorImages = product.images.filter(img => img.colorId === selectedColor.id);
    return colorImages.length > 0 ? colorImages : product.images;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-gray-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-10 bg-gray-200 rounded w-1/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The product you are looking for does not exist.'}</p>
          <Button onClick={() => router.push('/catalog')} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Catalog
          </Button>
        </div>
      </div>
    );
  }

  const filteredImages = getFilteredImages();
  const currentImage = filteredImages[selectedImageIndex] || { imageUrl: product.image };

  return (
    <div className="min-h-screen bg-gray-50" ref={heroRef}>
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsWishlisted(!isWishlisted)}
              >
                <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div ref={imageRef} className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-sm">
              <img
                src={currentImage.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/images/hero-shoes.svg';
                }}
              />
            </div>
            
            {/* Thumbnail Images */}
            {filteredImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {filteredImages.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square bg-white rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index ? 'border-pink-500' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image.imageUrl}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/images/hero-shoes.svg';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div ref={detailsRef} className="space-y-6">
            {/* Product Info */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{product.category.name}</Badge>
                {product.isNew && <Badge className="bg-green-100 text-green-700">New</Badge>}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-lg text-gray-600 mb-4">{product.brand.name}</p>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating || 0)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">({product.rating || 0}) • 127 reviews</span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  Rp {product.price.toLocaleString('id-ID')}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    Rp {product.originalPrice.toLocaleString('id-ID')}
                  </span>
                )}
              </div>
            </div>

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Color: {selectedColor?.colorName}
                </h3>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => {
                        setSelectedColor(color);
                        setSelectedImageIndex(0);
                      }}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        selectedColor?.code === color.code
                          ? 'border-gray-900 scale-110'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: color.hexCode }}
                      title={color.colorName}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-900">
                    Size: {selectedSize?.sizeLabel}
                  </h3>
                  <Dialog open={isSizeGuideOpen} onOpenChange={setIsSizeGuideOpen}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-pink-600 hover:text-pink-700">
                        <Ruler className="h-4 w-4 mr-1" />
                        Size Guide
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Size Guide</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6">
                        {/* Size Chart Table */}
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse border border-gray-300">
                            <thead>
                              <tr className="bg-gray-50">
                                <th className="border border-gray-300 px-4 py-2 text-left font-medium">Size</th>
                                <th className="border border-gray-300 px-4 py-2 text-left font-medium">Measurement (cm)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {product.sizes?.map((size, index) => (
                                 <tr key={size.id} className={index % 2 === 0 ? '' : 'bg-gray-50'}>
                                   <td className="border border-gray-300 px-4 py-2 font-medium">
                                     {size.sizeLabel}
                                   </td>
                                   <td className="border border-gray-300 px-4 py-2">
                                     {size.cmValue ? `${size.cmValue} cm` : 'Contact us for measurements'}
                                   </td>
                                 </tr>
                               ))}
                            </tbody>
                          </table>
                          
                          {product.sizes && product.sizes.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                              No size information available for this product.
                            </div>
                          )}
                        </div>
                        
                        {/* Measurement Guide */}
                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-900">How to Measure</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                              <p className="font-medium mb-1">Chest:</p>
                              <p>Measure around the fullest part of your chest, keeping the tape horizontal.</p>
                            </div>
                            <div>
                              <p className="font-medium mb-1">Waist:</p>
                              <p>Measure around your natural waistline, keeping the tape comfortably loose.</p>
                            </div>
                            <div>
                              <p className="font-medium mb-1">Hip:</p>
                              <p>Measure around the fullest part of your hips, keeping the tape horizontal.</p>
                            </div>
                            <div>
                              <p className="font-medium mb-1">Length:</p>
                              <p>Measure from the highest point of your shoulder to the desired length.</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Tips */}
                        <div className="bg-pink-50 p-4 rounded-lg">
                          <h4 className="font-medium text-pink-900 mb-2">Sizing Tips</h4>
                          <ul className="text-sm text-pink-800 space-y-1">
                            <li>• For the best fit, have someone help you measure</li>
                            <li>• Wear fitted clothing or undergarments when measuring</li>
                            <li>• If you&apos;re between sizes, we recommend sizing up</li>
                            <li>• Check the fabric composition for stretch information</li>
                          </ul>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 px-3 text-sm border rounded-md transition-colors ${
                        selectedSize?.code === size.code
                          ? 'border-pink-500 bg-pink-50 text-pink-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {size.sizeLabel}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-lg font-medium w-8 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="space-y-3">
              <Button 
                onClick={handleAddToCart}
                className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3"
                size="lg"
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <Button variant="outline" className="w-full" size="lg">
                Buy Now
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 gap-4 pt-6 border-t">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Free Shipping</p>
                  <p className="text-xs text-gray-600">On orders over Rp 500.000</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Easy Returns</p>
                  <p className="text-xs text-gray-600">30-day return policy</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Warranty</p>
                  <p className="text-xs text-gray-600">1-year manufacturer warranty</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="mt-12">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Product Description</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed">
                  {product.description || 'No description available for this product.'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;