import HeroSection from '@/components/sections/HeroSection';
import CategoriesSection from '@/components/sections/CategoriesSection';

export default function Home() {
  return (
    <>
      <section aria-label="Hero banner">
        <HeroSection />
      </section>
      {/* <section aria-label="Featured products">
        <FeaturedProducts />
      </section> */}
      <section aria-label="Promotional content">
        {/* TODO: Add promotional content here */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Special Promotions</h2>
            <p className="text-gray-600">Coming soon - exciting promotional content!</p>
          </div>
        </div>
      </section>
      <section aria-label="Product categories">
        <CategoriesSection />
      </section>
    </>
  );
}
