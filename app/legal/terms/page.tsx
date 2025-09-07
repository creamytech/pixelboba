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
                <strong>last updated:</strong> september 7, 2025
              </p>

              <section className="mb-8">
                <h2 className="font-display text-2xl font-bold text-ink mb-4">services</h2>
                <p className="text-gray-600 mb-4">
                  pixel boba llc provides web design, development, and related digital services.
                  services are delivered according to individual project agreements.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-2xl font-bold text-ink mb-4">project terms</h2>
                <ul className="text-gray-600 mb-4 space-y-2">
                  <li>
                    • projects commence once an agreement is signed and an initial payment is
                    received
                  </li>
                  <li>
                    • timelines are estimates and may vary based on client feedback and revisions
                  </li>
                  <li>• final deliverables are released upon full payment</li>
                  <li>
                    • clients are responsible for providing necessary content, assets, and timely
                    feedback
                  </li>
                  <li>• additional requests or scope changes may incur extra charges</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-2xl font-bold text-ink mb-4">payments</h2>
                <ul className="text-gray-600 mb-4 space-y-2">
                  <li>• invoices must be paid by the due date listed</li>
                  <li>• late payments may result in project delays or suspension</li>
                  <li>• deposits are non-refundable unless otherwise agreed in writing</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-2xl font-bold text-ink mb-4">
                  intellectual property
                </h2>
                <p className="text-gray-600 mb-4">
                  upon full payment, clients receive ownership of the final delivered work
                </p>
                <p className="text-gray-600 mb-4">pixel boba retains rights to:</p>
                <ul className="text-gray-600 mb-4 space-y-2">
                  <li>• showcase completed projects in our portfolio and marketing materials</li>
                  <li>
                    • retain ownership of any pre-existing tools, frameworks, or code libraries used
                    in development
                  </li>
                </ul>
                <p className="text-gray-600 mb-4">
                  if clients prefer not to be featured in our portfolio, they must request this in
                  writing before project completion
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-2xl font-bold text-ink mb-4">
                  limitation of liability
                </h2>
                <p className="text-gray-600 mb-4">pixel boba is not liable for:</p>
                <ul className="text-gray-600 mb-4 space-y-2">
                  <li>
                    • any indirect, incidental, or consequential damages arising from the use of our
                    services
                  </li>
                  <li>
                    • issues caused by third-party hosting providers, integrations, or
                    client-provided content
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-2xl font-bold text-ink mb-4">termination</h2>
                <p className="text-gray-600 mb-4">
                  either party may terminate a project in writing. work completed up to the
                  termination date will be billed accordingly.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-2xl font-bold text-ink mb-4">governing law</h2>
                <p className="text-gray-600 mb-4">
                  these terms are governed by the laws of the state of florida, without regard to
                  conflict of law principles.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-display text-2xl font-bold text-ink mb-4">contact</h2>
                <p className="text-gray-600">
                  questions about these terms? contact us at{' '}
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
