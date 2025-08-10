'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import CartDrawerWrapper from '@/components/cart/CartDrawerWrapper';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import { Toaster } from 'sonner';

interface ClientLayoutWrapperProps {
  children: ReactNode;
}

export default function ClientLayoutWrapper({ children }: ClientLayoutWrapperProps) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  if (isAdminPage) {
    // For admin pages, only render the main content without header, footer, cart, and whatsapp
    return (
      <>
        <main id="main-content" role="main" className="min-h-screen bg-gray-50">
          {children}
        </main>
        <Toaster position="top-right" richColors />
      </>
    );
  }

  // For non-admin pages, render with full layout
  return (
    <>
      <Header />
      <main id="main-content" role="main">
        {children}
      </main>
      <Footer />
      <CartDrawerWrapper />
      <WhatsAppButton phoneNumber="6281234567890" message="Halo, saya tertarik dengan produk sepatu di Femme Steps" />
      <Toaster position="top-right" richColors />
    </>
  );
}