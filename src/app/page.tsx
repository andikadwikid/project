import HeroSection from '@/components/sections/HeroSection';
import CategoriesSection from '@/components/sections/CategoriesSection';
import ProductGridSection from '@/components/sections/ProductGridSection';

export default function Home() {
  return (
    <>
      <div className="w-full py-2.5 font-medium text-sm text-white text-center bg-gradient-to-r from-violet-500 via-[#9938CA] to-[#E0724A]">
        <p>Special Deal: Free Shipping on Orders Above $50! | 20% OFF on First Purchase</p>
      </div>
      <section aria-label="Hero banner">
        <HeroSection />
      </section>
      {/* <section aria-label="Featured products">
        <FeaturedProducts />
      </section> */}
      <section aria-label="Promotional content">
        <div className="bg-gradient-to-r from-red-500 to-pink-500 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center text-white">
              <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 mb-6">
                <span className="text-sm font-medium uppercase tracking-wide">🔥 Hot Deals</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-4">Flash Sale Up to 70% OFF!</h2>
              <p className="text-lg lg:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Jangan lewatkan kesempatan emas! Ribuan produk pilihan dengan diskon fantastis menunggu Anda.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/promo" className="inline-flex items-center justify-center px-8 py-4 bg-white text-red-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                  Lihat Semua Promo
                </a>
                <a href="/catalog" className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-red-600 transition-colors">
                  Browse Catalog
                </a>
              </div>
              <div className="mt-8 flex items-center justify-center gap-8 text-sm opacity-80">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  <span>Limited Time Only</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  <span>Easy Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section aria-label="Product categories">
        <CategoriesSection />
      </section>
      <section aria-label="Product showcase with scroll pinning">
        <ProductGridSection
          title="Koleksi Terbaru"
          subtitle="Temukan produk-produk pilihan terbaik kami dengan teknologi terdepan"
          heroImage="/images/hero-shoes.svg"
        />
      </section>
    </>
  );
}
