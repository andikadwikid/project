'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // Set initial states
    gsap.set([titleRef.current, subtitleRef.current, buttonsRef.current, statsRef.current], {
      opacity: 0,
      y: 50
    });
    gsap.set(imageRef.current, {
      opacity: 0,
      scale: 0.8,
      rotation: -10
    });

    // Animate elements in sequence
    tl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out"
    })
    .to(subtitleRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.5")
    .to(buttonsRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.4")
    .to(statsRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.4")
    .to(imageRef.current, {
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration: 1.2,
      ease: "elastic.out(1, 0.5)"
    }, "-=0.8");

    // Floating animation for decorative elements
    gsap.to(".floating-element", {
      y: -20,
      duration: 2,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1,
      stagger: 0.3
    });
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-[80vh] flex items-center overflow-hidden" aria-labelledby="hero-title">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50" aria-hidden="true" />

      {/* Decorative Elements */}
      <div className="floating-element absolute top-20 left-10 w-20 h-20 bg-pink-200 rounded-full opacity-20" aria-hidden="true" />
      <div className="floating-element absolute bottom-32 right-20 w-16 h-16 bg-rose-200 rounded-full opacity-30" aria-hidden="true" />
      <div className="floating-element absolute top-1/2 right-10 w-12 h-12 bg-purple-200 rounded-full opacity-25" aria-hidden="true" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <header className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-pink-200" role="banner">
              <Sparkles className="h-4 w-4 text-pink-500" aria-hidden="true" />
              <span className="text-sm font-medium text-pink-700">New Collection 2024</span>
            </div>

            {/* Heading */}
            <div className="space-y-4">
              <h1 id="hero-title" ref={titleRef} className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 bg-clip-text text-transparent">
                  Step Into
                </span>
                <br />
                <span className="text-gray-900">
                  Elegance
                </span>
              </h1>
              <p ref={subtitleRef} className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-lg">
                Temukan koleksi sepatu wanita terbaik dengan desain feminin dan kualitas premium.
                Dari high heels elegan hingga sneakers kasual yang stylish.
              </p>
            </div>

            {/* CTA Buttons */}
            <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4">
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
            <div ref={statsRef} className="grid grid-cols-3 gap-8 pt-8 border-t border-pink-100">
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
          </header>

          {/* Hero Image */}
          <div className="relative">
            <div ref={imageRef} className="relative aspect-square max-w-lg mx-auto">
              {/* Background Circle */}
              <div className="absolute inset-0 bg-gradient-to-br from-pink-200 to-rose-300 rounded-full opacity-20" />

              {/* Main Image */}
              <div className="relative z-10 p-8">
                <Image
                  // src="/images/image1.jpeg"
                  src="/images/hero-shoes.svg"
                  alt="Elegant Women Shoes Collection"
                  width={500}
                  height={500}
                  className="w-full h-full object-contain drop-shadow-2xl"
                  priority
                />
              </div>

              {/* Floating Elements */}
              <div className="floating-element absolute top-16 -left-4 bg-white rounded-lg shadow-lg p-3 z-20">
                <div className="text-xs font-semibold text-gray-900">Free Shipping</div>
                <div className="text-xs text-gray-600">On orders over 500K</div>
              </div>

              <div className="floating-element absolute bottom-20 -right-4 bg-white rounded-lg shadow-lg p-3 z-20">
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