'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import ProductCard from '@/components/sections/ProductCard';
import { products, categories, brands } from '@/data/products';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CatalogPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [priceRange, setPriceRange] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('name');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const heroRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    const filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      const matchesBrand = !selectedBrand || product.brand === selectedBrand;

      let matchesPrice = true;
      if (priceRange) {
        switch (priceRange) {
          case 'under-500k':
            matchesPrice = product.price < 500000;
            break;
          case '500k-1m':
            matchesPrice = product.price >= 500000 && product.price < 1000000;
            break;
          case '1m-1.5m':
            matchesPrice = product.price >= 1000000 && product.price < 1500000;
            break;
          case 'over-1.5m':
            matchesPrice = product.price >= 1500000;
            break;
        }
      }

      return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'newest':
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [searchTerm, selectedCategory, selectedBrand, priceRange, sortBy]);

  useEffect(() => {
    const hero = heroRef.current;

    if (!hero) return;

    // Hero section animation only
    gsap.set(hero.children, { opacity: 0, y: 30 });
    gsap.to(hero.children, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out"
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Removed filter animation effect

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedBrand('');
    setPriceRange('');
    setSortBy('name');
  };

  const activeFiltersCount = [selectedCategory, selectedBrand, priceRange].filter(Boolean).length;

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
        <div className="space-y-2">
          <button
            onClick={() => setSelectedCategory('')}
            className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${!selectedCategory ? 'bg-pink-100 text-pink-700' : 'hover:bg-gray-100'
              }`}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.name)}
              className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${selectedCategory === category.name ? 'bg-pink-100 text-pink-700' : 'hover:bg-gray-100'
                }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Brands</h3>
        <div className="space-y-2">
          <button
            onClick={() => setSelectedBrand('')}
            className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${!selectedBrand ? 'bg-pink-100 text-pink-700' : 'hover:bg-gray-100'
              }`}
          >
            All Brands
          </button>
          {brands.map((brand) => (
            <button
              key={brand.id}
              onClick={() => setSelectedBrand(brand.name)}
              className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${selectedBrand === brand.name ? 'bg-pink-100 text-pink-700' : 'hover:bg-gray-100'
                }`}
            >
              {brand.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
        <div className="space-y-2">
          {[
            { value: '', label: 'All Prices' },
            { value: 'under-500k', label: 'Under Rp 500,000' },
            { value: '500k-1m', label: 'Rp 500,000 - Rp 1,000,000' },
            { value: '1m-1.5m', label: 'Rp 1,000,000 - Rp 1,500,000' },
            { value: 'over-1.5m', label: 'Over Rp 1,500,000' }
          ].map((range) => (
            <button
              key={range.value}
              onClick={() => setPriceRange(range.value)}
              className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${priceRange === range.value ? 'bg-pink-100 text-pink-700' : 'hover:bg-gray-100'
                }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <Button onClick={clearFilters} variant="outline" className="w-full">
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div ref={heroRef} className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Our <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">Collection</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our complete range of elegant women&apos;s shoes designed for every occasion.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary">{activeFiltersCount}</Badge>
                  )}
                </div>
                <FilterContent />
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Sort Bar */}
            <div ref={filtersRef} className="flex flex-col sm:flex-row gap-4 mb-6">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search shoes, brands, categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                />
              </div>

              {/* Mobile Filter Button */}
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <Badge variant="secondary" className="ml-2">{activeFiltersCount}</Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px]">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
              </select>
            </div>

            {/* Active Filters */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedCategory && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {selectedCategory}
                    <button onClick={() => setSelectedCategory('')} className="ml-1 hover:text-red-600">
                      ×
                    </button>
                  </Badge>
                )}
                {selectedBrand && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {selectedBrand}
                    <button onClick={() => setSelectedBrand('')} className="ml-1 hover:text-red-600">
                      ×
                    </button>
                  </Badge>
                )}
                {priceRange && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Price Range
                    <button onClick={() => setPriceRange('')} className="ml-1 hover:text-red-600">
                      ×
                    </button>
                  </Badge>
                )}
              </div>
            )}

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {filteredProducts.length} of {products.length} products
              </p>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div ref={productsRef} className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-6">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="product-card-wrapper">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
                <Button onClick={clearFilters} variant="outline">
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;