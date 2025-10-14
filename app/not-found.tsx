import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-20 bg-gradient-to-br from-milk-tea via-background to-taro/5 relative overflow-hidden">
        {/* Pearl pattern background */}
        <div className="absolute inset-0 text-taro/10 opacity-30">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="404-pearl-pattern"
                x="0"
                y="0"
                width="50"
                height="50"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="25" cy="25" r="2" fill="currentColor" opacity="0.4" />
                <circle cx="10" cy="10" r="1" fill="currentColor" opacity="0.2" />
              </pattern>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#404-pearl-pattern)" />
          </svg>
        </div>

        <div className="max-w-2xl mx-auto text-center relative z-10">
          {/* Spilled Boba Cup SVG */}
          <div className="mb-8 flex justify-center">
            <svg
              className="w-48 h-48 text-taro"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Spilled liquid puddle */}
              <ellipse cx="120" cy="160" rx="60" ry="15" fill="currentColor" opacity="0.1" />

              {/* Fallen cup */}
              <g transform="rotate(-45 100 100)">
                {/* Cup body */}
                <path
                  d="M70 60L65 100C65 105 68 108 73 108H107C112 108 115 105 115 100L110 60H70Z"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="currentColor"
                  fillOpacity="0.05"
                />
                {/* Cup lid (separated) */}
                <path d="M60 55H125" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                {/* Straw (bent) */}
                <path
                  d="M95 50L92 65L85 72"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </g>

              {/* Scattered pearls */}
              <circle cx="130" cy="140" r="4" fill="currentColor" opacity="0.5" />
              <circle cx="145" cy="145" r="3.5" fill="currentColor" opacity="0.5" />
              <circle cx="118" cy="150" r="3" fill="currentColor" opacity="0.5" />
              <circle cx="155" cy="138" r="4.5" fill="currentColor" opacity="0.5" />
              <circle cx="108" cy="145" r="3.5" fill="currentColor" opacity="0.5" />
              <circle cx="140" cy="152" r="3" fill="currentColor" opacity="0.5" />

              {/* Splash effect */}
              <path
                d="M95 120C95 120 88 125 85 130"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.3"
              />
              <path
                d="M125 125C125 125 132 130 135 135"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.3"
              />
            </svg>
          </div>

          {/* 404 text */}
          <h1 className="font-display text-7xl md:text-9xl font-bold text-ink mb-4">404</h1>

          <h2 className="font-display text-3xl md:text-4xl font-bold text-ink mb-4 lowercase">
            oops, the pearls got stuck in the straw
          </h2>

          <p className="text-xl text-gray-600 mb-8 lowercase max-w-md mx-auto">
            looks like this page spilled all over the place. let&apos;s get you back to something
            tasty.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="group inline-flex items-center justify-center bg-taro text-white px-8 py-4 rounded-xl font-semibold hover:bg-deep-taro transition-all duration-300 lowercase shadow-lg hover:shadow-2xl hover:shadow-taro/30 hover:scale-105"
            >
              back to home
              <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>

            <Link
              href="/services"
              className="group inline-flex items-center justify-center border-2 border-taro text-taro px-8 py-4 rounded-xl font-semibold hover:bg-taro/5 transition-all duration-300 lowercase"
            >
              browse services
              <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1 opacity-70">
                →
              </span>
            </Link>
          </div>

          {/* Floating pearls animation */}
          <div className="mt-12 flex justify-center gap-4">
            <div
              className="w-3 h-3 bg-taro/40 rounded-full animate-bounce"
              style={{ animationDelay: '0s' }}
            />
            <div
              className="w-3 h-3 bg-matcha/50 rounded-full animate-bounce"
              style={{ animationDelay: '0.2s' }}
            />
            <div
              className="w-3 h-3 bg-milk-tea/60 rounded-full animate-bounce"
              style={{ animationDelay: '0.4s' }}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
