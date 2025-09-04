import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'terms of service',
  description: 'terms and conditions for using pixel boba services.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-display text-4xl font-bold text-ink mb-8">terms of service</h1>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6">
                <strong>last updated:</strong> {new Date().toLocaleDateString()}
              </p>

              <section className="mb-8">
                <h2 className="font-display text-2xl font-bold text-ink mb-4">services</h2>
                <p className="text-gray-600 mb-4">
                  pixel boba llc provides web design, development, and related digital services. our
                  services are provided on a project basis as outlined in individual project
                  agreements.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-2xl font-bold text-ink mb-4">project terms</h2>
                <ul className="text-gray-600 mb-4 space-y-2">
                  <li>• projects begin upon signed agreement and initial payment</li>
                  <li>
                    • timelines are estimates and may vary based on client feedback and revisions
                  </li>
                  <li>• final deliverables are provided upon full payment</li>
                  <li>• clients are responsible for providing necessary content and assets</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-2xl font-bold text-ink mb-4">
                  intellectual property
                </h2>
                <p className="text-gray-600 mb-4">
                  upon full payment, clients receive ownership of the final delivered work. pixel
                  Boba retains the right to showcase completed projects in our portfolio unless
                  otherwise agreed upon in writing.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-2xl font-bold text-ink mb-4">Contact</h2>
                <p className="text-gray-600">
                  Questions about these terms? Contact us at{' '}
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
