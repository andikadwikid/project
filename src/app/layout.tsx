import type { Metadata } from "next";
import "./globals.css";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CartProvider } from '@/contexts/CartContext';
import CartDrawerWrapper from '@/components/cart/CartDrawerWrapper';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: "Femme Steps - Premium Women's Shoes Collection",
  description: "Discover elegant and stylish women's shoes. From high heels to comfortable flats, find your perfect pair at Femme Steps.",
  keywords: "women's shoes, high heels, flats, boots, sandals, premium footwear, fashion shoes, comfortable shoes",
  authors: [{ name: "Femme Steps" }],
  creator: "Femme Steps",
  publisher: "Femme Steps",
  robots: "index, follow",
  openGraph: {
    title: "Femme Steps - Premium Women's Shoes Collection",
    description: "Discover elegant and stylish women's shoes. From high heels to comfortable flats, find your perfect pair at Femme Steps.",
    type: "website",
    locale: "en_US",
    siteName: "Femme Steps",
  },
  twitter: {
    card: "summary_large_image",
    title: "Femme Steps - Premium Women's Shoes Collection",
    description: "Discover elegant and stylish women's shoes. From high heels to comfortable flats, find your perfect pair at Femme Steps.",
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#ec4899",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://femmesteps.com" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="antialiased">
        <CartProvider>
          <Header />
          <main id="main-content" role="main">
            {children}
          </main>
          <Footer />
          <CartDrawerWrapper />
          <WhatsAppButton phoneNumber="6281234567890" message="Halo, saya tertarik dengan produk sepatu di Femme Steps" />
          <Toaster position="top-right" richColors />
        </CartProvider>
      </body>
    </html>
  );
}
