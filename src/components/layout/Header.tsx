'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Heart, User, Search, Home, Package, Tag, Info, Phone, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from '@/components/ui/sheet';
import { gsap } from 'gsap';
import CartIcon from '@/components/cart/CartIcon';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Catalog', href: '/catalog' },
    { name: 'Promo', href: '/promo' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ];

  // Close drawer when clicking outside or pressing escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  useEffect(() => {
    const header = headerRef.current;
    const logo = logoRef.current;
    const nav = navRef.current;
    const actions = actionsRef.current;

    if (!header || !logo || !nav || !actions) return;

    // Set initial states
    gsap.set([logo, nav, actions], { opacity: 0, y: -20 });

    // Entrance animation
    const tl = gsap.timeline();
    tl.to(logo, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out"
    })
      .to(nav, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.4")
      .to(actions, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.4");

    // Scroll effect
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50);

      if (scrollY > 50) {
        gsap.to(header, {
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          duration: 0.3,
          ease: "power2.out"
        });
      } else {
        gsap.to(header, {
          backgroundColor: "rgba(255, 255, 255, 1)",
          backdropFilter: "none",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          duration: 0.3,
          ease: "power2.out"
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header ref={headerRef} className={`sticky top-0 z-50 w-full transition-all duration-300 border-b border-gray-200 ${isScrolled ? 'bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60' : 'bg-white'}`} role="banner">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div ref={logoRef} className="flex items-center">
            <Link href="/" className="flex items-center space-x-2" aria-label="Femme Steps - Go to homepage">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 flex items-center justify-center">
                <span className="text-white font-bold text-sm" aria-hidden="true">FS</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                Femme Steps
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav ref={navRef} className="hidden md:flex items-center space-x-8" role="navigation" aria-label="Main navigation">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`transition-colors duration-200 font-medium ${
                    isActive 
                      ? 'text-pink-600 border-b-2 border-pink-600 pb-1' 
                      : 'text-gray-700 hover:text-pink-600'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div ref={actionsRef} className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-gray-700 hover:text-pink-600">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-700 hover:text-pink-600">
              <Heart className="h-5 w-5" />
            </Button>
            <CartIcon />
            <Button variant="ghost" size="icon" className="text-gray-700 hover:text-pink-600">
              <User className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center space-x-2">
            <CartIcon />
            <Sheet open={isOpen} onOpenChange={(open) => {
              setIsOpen(open);
              if (!open) setSearchTerm('');
            }}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-700">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[320px] sm:w-[400px] p-0">
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-6 text-white">
                    <SheetHeader>
                      <SheetTitle className="text-white text-xl font-bold flex items-center gap-2">
                        <Menu className="h-6 w-6" />
                        Menu Navigation
                      </SheetTitle>
                    </SheetHeader>
                  </div>

                  {/* Search Bar */}
                  <div className="p-4 border-b">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        placeholder="Cari menu atau halaman..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <div className="flex-1 p-4">
                    <div className="space-y-2">
                      {navigation
                        .filter(item => 
                          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.href.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((item) => {
                        const isActive = pathname === item.href;
                        const getIcon = (name: string) => {
                          switch (name) {
                            case 'Home': return <Home className="h-5 w-5" />;
                            case 'Catalog': return <Package className="h-5 w-5" />;
                            case 'Promo': return <Tag className="h-5 w-5" />;
                            case 'About': return <Info className="h-5 w-5" />;
                            case 'Contact': return <Phone className="h-5 w-5" />;
                            default: return <Package className="h-5 w-5" />;
                          }
                        };

                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                              isActive 
                                ? 'bg-pink-50 text-pink-600 border-l-4 border-pink-600 shadow-sm' 
                                : 'text-gray-700 hover:bg-gray-50 hover:text-pink-600'
                            }`}
                            onClick={() => {
                              setIsOpen(false);
                              setSearchTerm('');
                            }}
                          >
                            {getIcon(item.name)}
                            <span className="font-medium">{item.name}</span>
                            {isActive && (
                              <div className="ml-auto w-2 h-2 bg-pink-600 rounded-full"></div>
                            )}
                          </Link>
                        );
                      })}
                      {navigation.filter(item => 
                        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.href.toLowerCase().includes(searchTerm.toLowerCase())
                      ).length === 0 && searchTerm && (
                        <div className="text-center py-8 text-gray-500">
                          <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">Tidak ada menu yang ditemukan</p>
                          <p className="text-xs mt-1">Coba kata kunci lain</p>
                        </div>
                      )}
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-8">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Quick Actions</h3>
                      <div className="space-y-2">
                        <Link href="/cart">
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start gap-3 p-3 h-auto text-gray-700 hover:bg-gray-50 hover:text-pink-600 transition-all duration-200"
                            onClick={() => {
                              setIsOpen(false);
                              setSearchTerm('');
                            }}
                          >
                            <ShoppingBag className="h-5 w-5" />
                            <span>Keranjang Belanja</span>
                            <div className="ml-auto text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded-full">0</div>
                          </Button>
                        </Link>
                        <Link href="/wishlist">
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start gap-3 p-3 h-auto text-gray-700 hover:bg-gray-50 hover:text-pink-600 transition-all duration-200"
                            onClick={() => {
                              setIsOpen(false);
                              setSearchTerm('');
                            }}
                          >
                            <Heart className="h-5 w-5" />
                            <span>Wishlist</span>
                            <div className="ml-auto text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded-full">0</div>
                          </Button>
                        </Link>
                        <Link href="/account">
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start gap-3 p-3 h-auto text-gray-700 hover:bg-gray-50 hover:text-pink-600 transition-all duration-200"
                            onClick={() => {
                              setIsOpen(false);
                              setSearchTerm('');
                            }}
                          >
                            <User className="h-5 w-5" />
                            <span>Akun Saya</span>
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-4 border-t bg-gray-50">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="h-6 w-6 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 flex items-center justify-center">
                          <span className="text-white font-bold text-xs">FS</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-700">Femme Steps</span>
                      </div>
                      <p className="text-xs text-gray-500">Langkah Elegan untuk Wanita Modern</p>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;