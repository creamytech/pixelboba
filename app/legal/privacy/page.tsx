import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'privacy policy',
  description: 'how pixel boba llc collects, uses, and protects your personal information.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-display text-4xl font-bold text-ink mb-8">privacy policy</h1>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6">
                <strong>last updated:</strong> {new Date().toLocaleDateString()}
              </p>

              <section className="mb-8">
                <h2 className="font-display text-2xl font-bold text-ink mb-4">
                  information we collect
                </h2>
                <p className="text-gray-600 mb-4">
                  when you contact us or use our services, we may collect:
                </p>
                <ul className="text-gray-600 mb-4 space-y-2">
                  <li>• contact information (name, email, phone number)</li>
                  <li>• project details and requirements</li>
                  <li>• communication preferences</li>
                  <li>• technical information about your current website</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-2xl font-bold text-ink mb-4">
                  how we use your information
                </h2>
                <p className="text-gray-600 mb-4">we use the information you provide to:</p>
                <ul className="text-gray-600 mb-4 space-y-2">
                  <li>• respond to your inquiries and provide quotes</li>
                  <li>• deliver our design and development services</li>
                  <li>• communicate project updates and deliverables</li>
                  <li>• send occasional updates about our services (with your consent)</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-2xl font-bold text-ink mb-4">
                  information sharing
                </h2>
                <p className="text-gray-600 mb-4">
                  we do not sell, trade, or otherwise transfer your personal information to third
                  parties without your consent, except:
                </p>
                <ul className="text-gray-600 mb-4 space-y-2">
                  <li>• when required by law</li>
                  <li>• to trusted service providers who assist in our operations</li>
                  <li>• with your explicit permission</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-2xl font-bold text-ink mb-4">contact us</h2>
                <p className="text-gray-600">
                  if you have questions about this privacy policy, please contact us at{' '}
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
