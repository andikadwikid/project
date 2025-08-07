import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50" />
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-pink-200 rounded-full opacity-20 animate-pulse" />
      <div className="absolute bottom-32 right-20 w-16 h-16 bg-rose-200 rounded-full opacity-30 animate-pulse delay-1000" />
      <div className="absolute top-1/2 right-10 w-12 h-12 bg-purple-200 rounded-full opacity-25 animate-pulse delay-500" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-pink-200">
              <Sparkles className="h-4 w-4 text-pink-500" />
              <span className="text-sm font-medium text-pink-700">New Collection 2024</span>
            </div>
            
            {/* Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 bg-clip-text text-transparent">
                  Step Into
                </span>
                <br />
                <span className="text-gray-900">
                  Elegance
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-lg">
                Temukan koleksi sepatu wanita terbaik dengan desain feminin dan kualitas premium. 
                Dari high heels elegan hingga sneakers kasual yang stylish.
              </p>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                asChild 
                size="lg" 
                className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link href="/catalog" className="inline-flex items-center">
                  Shop Collection
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                size="lg"
                className="border-pink-200 text-pink-700 hover:bg-pink-50 hover:border-pink-300"
              >
                <Link href="/about">
                  Learn More
                </Link>
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-pink-100">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-gray-900">500+</div>
                <div className="text-sm text-gray-600">Products</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-gray-900">10K+</div>
                <div className="text-sm text-gray-600">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-gray-900">4.9</div>
                <div className="text-sm text-gray-600">Rating</div>
              </div>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="relative">
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Background Circle */}
              <div className="absolute inset-0 bg-gradient-to-br from-pink-200 to-rose-300 rounded-full opacity-20" />
              
              {/* Main Image */}
              <div className="relative z-10 p-8">
                <Image
                  src="/images/hero-shoes.svg"
                  alt="Elegant Women Shoes Collection"
                  width={500}
                  height={500}
                  className="w-full h-full object-contain drop-shadow-2xl"
                  priority
                />
              </div>
              
              {/* Floating Elements */}
              <div className="absolute top-16 -left-4 bg-white rounded-lg shadow-lg p-3 animate-bounce">
                <div className="text-xs font-semibold text-gray-900">Free Shipping</div>
                <div className="text-xs text-gray-600">On orders over 500K</div>
              </div>
              
              <div className="absolute bottom-20 -right-4 bg-white rounded-lg shadow-lg p-3 animate-bounce delay-1000">
                <div className="text-xs font-semibold text-gray-900">Premium Quality</div>
                <div className="text-xs text-gray-600">Italian Craftsmanship</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;