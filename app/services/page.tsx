import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PricingSection from '@/components/sections/PricingSection';
import FAQSection from '@/components/sections/FAQSection';
import { Code, Palette, Search, Zap, Users, Settings } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Services - What We Do Best',
  description:
    'From web design to development, we offer comprehensive digital services that make your brand pop.',
};

const services = [
  {
    icon: Palette,
    title: 'Web Design',
    description:
      'Beautiful, user-centered designs that capture your brand essence and engage your audience.',
    features: ['UI/UX Design', 'Brand Integration', 'Responsive Design', 'Design Systems'],
  },
  {
    icon: Code,
    title: 'Next.js Development',
    description:
      'Lightning-fast, SEO-optimized websites built with modern technologies and best practices.',
    features: [
      'Custom Development',
      'Performance Optimization',
      'SEO Integration',
      'Analytics Setup',
    ],
  },
  {
    icon: Users,
    title: 'Branding',
    description:
      'Complete brand identity solutions that help your business stand out from the competition.',
    features: ['Logo Design', 'Brand Guidelines', 'Visual Identity', 'Brand Strategy'],
  },
  {
    icon: Search,
    title: 'UX Audit',
    description:
      'Comprehensive analysis of your current site to identify opportunities for improvement.',
    features: [
      'User Journey Analysis',
      'Conversion Optimization',
      'Accessibility Review',
      'Recommendations',
    ],
  },
  {
    icon: Zap,
    title: 'Performance',
    description:
      'Speed optimization and technical enhancements to ensure your site loads fast and ranks well.',
    features: ['Core Web Vitals', 'Image Optimization', 'Code Splitting', 'CDN Setup'],
  },
  {
    icon: Settings,
    title: 'Maintenance',
    description: 'Ongoing support and updates to keep your website secure, fast, and up-to-date.',
    features: ['Security Updates', 'Content Updates', 'Bug Fixes', 'Performance Monitoring'],
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-display text-5xl md:text-6xl font-bold text-ink mb-6">
                What We Do
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                We specialize in creating digital experiences that not only look amazing but also
                perform exceptionally well. Every project is crafted with care and attention to
                detail.
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="pb-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <div
                    key={service.title}
                    className="group p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-taro/20"
                  >
                    <div className="relative mb-6">
                      <div className="w-16 h-16 bg-taro/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-taro/20 transition-colors duration-300">
                        <Icon className="w-8 h-8 text-taro" />
                      </div>
                      {/* Pearl animation on hover */}
                      <div className="absolute -top-2 -right-2 w-4 h-4 bg-taro/60 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce-subtle transition-all duration-300" />
                    </div>

                    <h3 className="font-display text-2xl font-bold text-ink mb-4">
                      {service.title}
                    </h3>

                    <p className="text-gray-600 mb-6">{service.description}</p>

                    <ul className="space-y-2">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center text-sm text-gray-500">
                          <div className="w-2 h-2 bg-matcha rounded-full mr-3 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <PricingSection />

        {/* FAQ Section */}
        <FAQSection />

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-taro to-deep-taro">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h2 className="font-display text-4xl font-bold mb-6">Ready to Get Started?</h2>
              <p className="text-xl text-taro-100 mb-8">
                Let&apos;s discuss your project and see how we can help bring your vision to life.
              </p>
              <a
                href="/contact"
                className="inline-block bg-white text-taro px-8 py-3 rounded-lg font-semibold hover:bg-milk-tea transition-colors duration-200"
              >
                Start Your Project
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
