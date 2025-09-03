import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              {/* 404 with pearls */}
              <div className="relative inline-block">
                <h1 className="font-display text-8xl font-bold text-ink mb-4">
                  4
                  <span className="relative">
                    0
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-taro rounded-full flex items-center justify-center">
                        <div className="w-6 h-6 bg-white rounded-full opacity-60" />
                      </div>
                    </div>
                  </span>
                  4
                </h1>
                {/* Floating pearls */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-matcha rounded-full animate-bounce-subtle" />
                <div
                  className="absolute -top-2 -right-6 w-6 h-6 bg-brown-sugar rounded-full animate-bounce-subtle"
                  style={{ animationDelay: '0.5s' }}
                />
                <div
                  className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-milk-tea border-2 border-taro rounded-full animate-bounce-subtle"
                  style={{ animationDelay: '1s' }}
                />
              </div>
            </div>

            <h2 className="font-display text-3xl font-bold text-ink mb-4">
              Oops! This page got lost in the tea
            </h2>

            <p className="text-xl text-gray-600 mb-8">
              The page you&apos;re looking for doesn&apos;t exist or has been moved. But don&apos;t
              worry, we&apos;ll help you find what you need.
            </p>

            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              <Link
                href="/"
                className="inline-block bg-taro text-white px-8 py-3 rounded-lg font-semibold hover:bg-deep-taro transition-colors duration-200"
              >
                Go Home
              </Link>
              <Link
                href="/contact"
                className="inline-block border border-taro text-taro px-8 py-3 rounded-lg font-semibold hover:bg-taro hover:text-white transition-colors duration-200"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
