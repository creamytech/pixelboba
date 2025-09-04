import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Pixel Boba LLC collects, uses, and protects your personal information.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-display text-4xl font-bold text-ink mb-8">Privacy Policy</h1>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6">
                <strong>Last updated:</strong> {new Date().toLocaleDateString()}
              </p>

              <section className="mb-8">
                <h2 className="font-display text-2xl font-bold text-ink mb-4">
                  Information We Collect
                </h2>
                <p className="text-gray-600 mb-4">
                  When you contact us or use our services, we may collect:
                </p>
                <ul className="text-gray-600 mb-4 space-y-2">
                  <li>• Contact information (name, email, phone number)</li>
                  <li>• Project details and requirements</li>
                  <li>• Communication preferences</li>
                  <li>• Technical information about your current website</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-2xl font-bold text-ink mb-4">
                  How We Use Your Information
                </h2>
                <p className="text-gray-600 mb-4">We use the information you provide to:</p>
                <ul className="text-gray-600 mb-4 space-y-2">
                  <li>• Respond to your inquiries and provide quotes</li>
                  <li>• Deliver our design and development services</li>
                  <li>• Communicate project updates and deliverables</li>
                  <li>• Send occasional updates about our services (with your consent)</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-2xl font-bold text-ink mb-4">
                  Information Sharing
                </h2>
                <p className="text-gray-600 mb-4">
                  We do not sell, trade, or otherwise transfer your personal information to third
                  parties without your consent, except:
                </p>
                <ul className="text-gray-600 mb-4 space-y-2">
                  <li>• When required by law</li>
                  <li>• To trusted service providers who assist in our operations</li>
                  <li>• With your explicit permission</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-2xl font-bold text-ink mb-4">Contact Us</h2>
                <p className="text-gray-600">
                  If you have questions about this Privacy Policy, please contact us at{' '}
                  <a href="mailto:hello@pixelboba.com" className="text-taro hover:text-deep-taro">
                    hello@pixelboba.com
                  </a>
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
