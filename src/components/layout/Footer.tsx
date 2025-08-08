'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    const content = contentRef.current;
    const bottom = bottomRef.current;

    if (!footer || !content || !bottom) return;

    // Set initial states
    gsap.set([content, bottom], { opacity: 0, y: 50 });

    // Scroll-triggered animation
    ScrollTrigger.create({
      trigger: footer,
      start: "top 80%",
      onEnter: () => {
        const tl = gsap.timeline();
        tl.to(content, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out"
        })
          .to(bottom, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out"
          }, "-=0.4");
      }
    });

    // Add hover animations for social links
    const socialLinks = footer.querySelectorAll('.social-link');
    socialLinks.forEach((link) => {
      link.addEventListener('mouseenter', () => {
        gsap.to(link, {
          scale: 1.1,
          rotation: 5,
          duration: 0.3,
          ease: "power2.out"
        });
      });

      link.addEventListener('mouseleave', () => {
        gsap.to(link, {
          scale: 1,
          rotation: 0,
          duration: 0.3,
          ease: "power2.out"
        });
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <footer ref={footerRef} className="bg-gradient-to-br from-pink-50 to-rose-50 border-t" role="contentinfo">
      <div ref={contentRef} className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <section className="space-y-4" aria-labelledby="brand-heading">
            <Link href="/" className="flex items-center space-x-2" aria-label="Femme Steps - Go to homepage">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 flex items-center justify-center">
                <span className="text-white font-bold text-sm" aria-hidden="true">FS</span>
              </div>
              <h2 id="brand-heading" className="text-xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                Femme Steps
              </h2>
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed">
              Koleksi sepatu wanita terbaik dengan desain feminin dan kualitas premium.
              Temukan sepatu impian Anda di Femme Steps.
            </p>
            <div className="flex space-x-4" role="list" aria-label="Social media links">
              <Link href="#" className="social-link text-gray-400 hover:text-pink-500 transition-colors" aria-label="Follow us on Instagram">
                <Instagram className="h-5 w-5" aria-hidden="true" />
              </Link>
              <Link href="#" className="social-link text-gray-400 hover:text-pink-500 transition-colors" aria-label="Follow us on Facebook">
                <Facebook className="h-5 w-5" aria-hidden="true" />
              </Link>
              <Link href="#" className="social-link text-gray-400 hover:text-pink-500 transition-colors" aria-label="Follow us on Twitter">
                <Twitter className="h-5 w-5" aria-hidden="true" />
              </Link>
            </div>
          </section>

          {/* Quick Links */}
          <section className="space-y-4" aria-labelledby="quick-links-heading">
            <h3 id="quick-links-heading" className="text-lg font-semibold text-gray-900">Quick Links</h3>
            <nav role="navigation" aria-labelledby="quick-links-heading">
              <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 hover:text-pink-600 transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/catalog" className="text-gray-600 hover:text-pink-600 transition-colors text-sm">
                  Catalog
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-pink-600 transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-pink-600 transition-colors text-sm">
                  Contact
                </Link>
              </li>
              </ul>
            </nav>
          </section>

          {/* Categories */}
          <section className="space-y-4" aria-labelledby="categories-heading">
            <h3 id="categories-heading" className="text-lg font-semibold text-gray-900">Categories</h3>
            <nav role="navigation" aria-labelledby="categories-heading">
              <ul className="space-y-2">
              <li>
                <Link href="/catalog?category=high-heels" className="text-gray-600 hover:text-pink-600 transition-colors text-sm">
                  High Heels
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=sneakers" className="text-gray-600 hover:text-pink-600 transition-colors text-sm">
                  Sneakers
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=flats" className="text-gray-600 hover:text-pink-600 transition-colors text-sm">
                  Flats
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=boots" className="text-gray-600 hover:text-pink-600 transition-colors text-sm">
                  Boots
                </Link>
              </li>
              </ul>
            </nav>
          </section>

          {/* Contact Info */}
          <section className="space-y-4" aria-labelledby="contact-heading">
            <h3 id="contact-heading" className="text-lg font-semibold text-gray-900">Contact Info</h3>
            <address className="space-y-3 not-italic">
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-pink-500" aria-hidden="true" />
                <span className="text-gray-600 text-sm">
                  Jl. Fashion Street No. 123, Jakarta
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-pink-500" aria-hidden="true" />
                <a href="tel:+622112345678" className="text-gray-600 text-sm hover:text-pink-600 transition-colors">
                  +62 21 1234 5678
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-pink-500" aria-hidden="true" />
                <a href="mailto:hello@femmesteps.com" className="text-gray-600 text-sm hover:text-pink-600 transition-colors">
                  hello@femmesteps.com
                </a>
              </div>
            </address>
          </section>
        </div>

        <Separator className="my-8" />

        <div ref={bottomRef} className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-600 text-sm">
            © 2024 Femme Steps. All rights reserved.
          </p>
          <nav role="navigation" aria-label="Legal links">
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-gray-600 hover:text-pink-600 transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-600 hover:text-pink-600 transition-colors text-sm">
                Terms of Service
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;