'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import Link from 'next/link';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/sections/ProductCard';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ProductGridSectionProps {
  title?: string;
  subtitle?: string;
  heroImage?: string;
}

export default function ProductGridSection({
  title = "Koleksi Terbaru",
  subtitle = "Temukan produk-produk pilihan terbaik kami",
  heroImage = "/images/hero-shoes.svg"
}: ProductGridSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const productRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  const { products, loading } = useProducts({ limit: 12 });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Debounce resize handler
    let resizeTimeout: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const wasMobile = isMobile;
        checkMobile();

        // Force refresh ScrollTrigger when switching between mobile/desktop
        if (wasMobile !== (window.innerWidth < 768)) {
          ScrollTrigger.killAll();
          setTimeout(() => ScrollTrigger.refresh(), 100);
        } else {
          ScrollTrigger.refresh();
        }
      }, 150);
    };

    checkMobile();
    window.addEventListener('resize', debouncedResize);
    window.addEventListener('orientationchange', debouncedResize);

    return () => {
      window.removeEventListener('resize', debouncedResize);
      window.removeEventListener('orientationchange', debouncedResize);
      clearTimeout(resizeTimeout);
    };
  }, [isMobile]);

  useEffect(() => {
    if (!sectionRef.current || !imageRef.current || !gridRef.current || isMobile) return;

    const section = sectionRef.current;
    const image = imageRef.current;
    const grid = gridRef.current;
    let pinTrigger: ScrollTrigger | null = null;

    // Wait for layout to settle and images to load
    const timer = setTimeout(() => {
      try {
        ScrollTrigger.refresh();

        // Calculate dimensions
        const sectionHeight = section.offsetHeight;
        const imageHeight = image.offsetHeight;
        const gridHeight = grid.offsetHeight;

        // Ensure we have valid dimensions
        if (sectionHeight === 0 || imageHeight === 0 || gridHeight === 0) {
          console.warn('Invalid dimensions for ScrollTrigger, retrying...');
          setTimeout(() => ScrollTrigger.refresh(), 500);
          return;
        }

        // Create ScrollTrigger for pinning the image
        pinTrigger = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: () => {
            // Calculate based on the grid container height with better logic
            const viewportHeight = window.innerHeight;
            const endPoint = Math.max(gridHeight - viewportHeight + 100, 300);
            return `+=${endPoint}`;
          },
          pin: image,
          pinSpacing: false,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: -1,
          scrub: false,
          onUpdate: (self) => {
            // Add subtle parallax effect
            const progress = self.progress;
            gsap.set(image, {
              opacity: Math.max(0.85, 1 - progress * 0.15),
              scale: 1 + progress * 0.02
            });
          },
          onRefresh: () => {
            // Reset styles when refreshing
            gsap.set(image, { opacity: 1, scale: 1 });
          },
          onToggle: (self) => {
            // Ensure proper state when toggling
            if (!self.isActive) {
              gsap.set(image, { opacity: 1, scale: 1 });
            }
          }
        });
      } catch (error) {
        console.error('ScrollTrigger setup failed:', error);
        // Fallback: just ensure image is visible
        gsap.set(image, { opacity: 1, scale: 1 });
      }
    }, 500); // Increased timeout for better layout settling

    return () => {
      clearTimeout(timer);
      if (pinTrigger) {
        pinTrigger.kill();
      }
    };
  }, [isMobile, products]);

  // Animate products on scroll
  useEffect(() => {
    if (!products.length) return;

    const validRefs = productRefs.current.filter(ref => ref !== null);
    if (validRefs.length === 0) return;

    // For mobile, use simpler CSS animations
    if (isMobile) {
      validRefs.forEach((ref, index) => {
        if (ref) {
          ref.style.opacity = '0';
          ref.style.transform = 'translateY(20px)';
          ref.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

          setTimeout(() => {
            if (ref) {
              ref.style.opacity = '1';
              ref.style.transform = 'translateY(0)';
            }
          }, index * 100);
        }
      });
      return;
    }

    // Desktop GSAP animations
    try {
      // Set initial state
      gsap.set(validRefs, {
        opacity: 0,
        y: 50,
        scale: 0.9
      });

      // Create stagger animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
          refreshPriority: -1
        }
      });

      tl.to(validRefs, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.7)"
      });

      return () => {
        tl.kill();
      };
    } catch (error) {
      console.warn('GSAP animation failed, falling back to CSS:', error);
      // Fallback to CSS animations
      validRefs.forEach((ref, index) => {
        if (ref) {
          ref.style.opacity = '0';
          ref.style.transform = 'translateY(20px)';
          ref.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

          setTimeout(() => {
            if (ref) {
              ref.style.opacity = '1';
              ref.style.transform = 'translateY(0)';
            }
          }, index * 100);
        }
      });
    }
  }, [products, isMobile]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat produk...</p>
        </div>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 text-gray-400">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM10 12a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Tidak ada produk</h3>
          <p className="text-gray-500">Produk akan segera tersedia</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={sectionRef} className="relative min-h-screen scroll-section">
      <div className="flex flex-col md:flex-row">
        {/* Left Column - Hero Image */}
        <div
          ref={imageRef}
          className="w-full md:w-1/2 md:h-screen relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center overflow-hidden gsap-pinned gsap-pin-start"
          style={{ minHeight: isMobile ? '60vh' : '100vh' }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-20 h-20 bg-blue-400 rounded-full blur-xl"></div>
            <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-400 rounded-full blur-xl"></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-indigo-400 rounded-full blur-lg"></div>
          </div>

          <div className="relative z-10 text-center p-8 md:p-12 max-w-lg">
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 mb-4">
                ✨ Koleksi Eksklusif
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              {title}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              {subtitle}
            </p>
            <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto transform hover:scale-105 transition-transform duration-500">
              <Image
                src={heroImage}
                alt="Hero Product"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>

            {/* Floating Elements */}
            <div className="absolute top-1/4 -right-4 w-8 h-8 bg-yellow-400 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute bottom-1/3 -left-2 w-6 h-6 bg-pink-400 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>

        {/* Right Column - Product Grid */}
        <div
          ref={gridRef}
          className="w-full md:w-1/2 bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 p-6 md:p-12 min-h-screen"
          style={{ paddingBottom: isMobile ? '2rem' : '50vh' }}
        >
          <div className="mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Produk Pilihan
            </h3>
            <p className="text-gray-600">
              Jelajahi koleksi produk terbaik kami
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {products.map((product, index) => {
              // Transform product data to match ProductCard props
              const transformedProduct = {
                ...product,
                image: typeof product.image === 'string' ? product.image : (product.images && product.images.length > 0 ? (typeof product.images[0] === 'string' ? product.images[0] : product.images[0]?.imageUrl || '/placeholder-image.svg') : '/placeholder-image.svg'),
                rating: product.rating || 4.5,
                reviews: product.reviews || 12,
                isNew: product.isNew || false,
                isSale: product.isSale || false,
                promotion: product.promotion || null,
                originalPrice: product.originalPrice || undefined,
                colors: product.colors || []
              };

              return (
                <div
                  key={product.id}
                  ref={(el) => {
                    productRefs.current[index] = el;
                  }}
                  className="product-card"
                >
                  <ProductCard product={transformedProduct} />
                </div>
              );
            })}
          </div>

          {/* View More Button */}
          <div className="mt-12 text-center">
            <Link
              href="/catalog"
              className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Lihat Semua Produk
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}