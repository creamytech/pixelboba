import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us - Start Your Project',
  description: "Ready to create something amazing? Get in touch and let's discuss your project.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-display text-5xl md:text-6xl font-bold text-ink mb-6">
                Let&apos;s Talk
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Ready to make your project pop? We&apos;d love to hear about your goals and explore
                how we can bring your vision to life.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                {/* Contact Info */}
                <div className="lg:col-span-1">
                  <div className="sticky top-32">
                    <h2 className="font-display text-2xl font-bold text-ink mb-6">Get in Touch</h2>

                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold text-ink mb-2">Email</h3>
                        <a
                          href="mailto:hello@pixelboba.studio"
                          className="text-gray-600 hover:text-taro transition-colors duration-200"
                        >
                          hello@pixelboba.studio
                        </a>
                      </div>

                      <div>
                        <h3 className="font-semibold text-ink mb-2">Response Time</h3>
                        <p className="text-gray-600">
                          We typically respond within 24 hours during business days.
                        </p>
                      </div>

                      <div>
                        <h3 className="font-semibold text-ink mb-2">Project Timeline</h3>
                        <p className="text-gray-600">
                          Most projects are completed within 4-8 weeks, depending on scope and
                          complexity.
                        </p>
                      </div>
                    </div>

                    {/* Decorative pearls */}
                    <div className="mt-12 relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-taro/20 to-transparent rounded-full flex items-center justify-center">
                        <div className="w-12 h-12 bg-taro/40 rounded-full flex items-center justify-center">
                          <div className="w-6 h-6 bg-taro rounded-full" />
                        </div>
                      </div>
                      <div className="absolute top-2 right-4 w-4 h-4 bg-matcha rounded-full animate-bounce-subtle" />
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-brown-sugar rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Contact Form */}
                <div className="lg:col-span-2">
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
