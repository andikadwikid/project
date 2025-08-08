import HeroSection from '@/components/sections/HeroSection';
import FeaturedProducts from '@/components/sections/FeaturedProducts';
import CategoriesSection from '@/components/sections/CategoriesSection';

export default function Home() {
  return (
    <>
      <section aria-label="Hero banner">
        <HeroSection />
      </section>
      <section aria-label="Featured products">
        <FeaturedProducts />
      </section>
      <section aria-label="Product categories">
        <CategoriesSection />
      </section>
    </>
  );
}
