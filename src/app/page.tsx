import HeroSection from '@/components/sections/HeroSection';
import FeaturedProducts from '@/components/sections/FeaturedProducts';
import CategoriesSection from '@/components/sections/CategoriesSection';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <FeaturedProducts />
      <CategoriesSection />
    </main>
  );
}
