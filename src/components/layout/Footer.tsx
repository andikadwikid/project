import Link from 'next/link';
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-pink-50 to-rose-50 border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 flex items-center justify-center">
                <span className="text-white font-bold text-sm">FS</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                Femme Steps
              </span>
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed">
              Koleksi sepatu wanita terbaik dengan desain feminin dan kualitas premium. 
              Temukan sepatu impian Anda di Femme Steps.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Quick Links</h3>
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
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Categories</h3>
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
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-pink-500" />
                <span className="text-gray-600 text-sm">
                  Jl. Fashion Street No. 123, Jakarta
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-pink-500" />
                <span className="text-gray-600 text-sm">
                  +62 21 1234 5678
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-pink-500" />
                <span className="text-gray-600 text-sm">
                  hello@femmesteps.com
                </span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-600 text-sm">
            © 2024 Femme Steps. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="text-gray-600 hover:text-pink-600 transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-600 hover:text-pink-600 transition-colors text-sm">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;