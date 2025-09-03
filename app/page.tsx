import dynamic from 'next/dynamic';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import ValuePropsSection from '@/components/sections/ValuePropsSection';
import MarqueeSection from '@/components/sections/MarqueeSection';
import FeaturedWorkSection from '@/components/sections/FeaturedWorkSection';
import ProcessSection from '@/components/sections/ProcessSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import TechStackSection from '@/components/sections/TechStackSection';
import CTASection from '@/components/sections/CTASection';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <ValuePropsSection />
        <MarqueeSection />
        <FeaturedWorkSection />
        <ProcessSection />
        <TestimonialsSection />
        <TechStackSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
