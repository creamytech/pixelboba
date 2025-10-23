import Link from 'next/link';
import { Icon } from '@iconify/react';
import { Home, Search } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-20 relative overflow-hidden">
        {/* Pearl pattern background - Pomegranate style */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="404-pearl-pattern"
                x="0"
                y="0"
                width="60"
                height="60"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="30" cy="30" r="3" fill="#3A001D" opacity="1" />
                <circle cx="15" cy="15" r="2" fill="#3A001D" opacity="0.6" />
                <circle cx="45" cy="45" r="2" fill="#3A001D" opacity="0.6" />
              </pattern>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#404-pearl-pattern)" />
          </svg>
        </div>

        <div className="max-w-3xl mx-auto text-center relative z-10">
          {/* Neo-brutalist card container */}
          <div className="bg-white rounded-2xl border-5 border-ink shadow-[12px_12px_0px_0px_rgba(58,0,29,1)] p-8 md:p-12 mb-8">
            {/* Giant 404 with Pomegranate styling */}
            <div className="relative mb-6">
              <h1 className="font-black text-[10rem] md:text-[14rem] leading-none text-taro opacity-10 select-none">
                404
              </h1>
              <div className="absolute inset-0 flex items-center justify-center">
                <Icon icon="game-icons:boba" className="w-32 h-32 md:w-40 md:h-40 text-taro" />
              </div>
            </div>

            {/* Main heading */}
            <h2 className="font-black text-3xl md:text-5xl text-ink uppercase mb-4">
              Page Not Found
            </h2>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-ink/70 font-bold mb-8 max-w-lg mx-auto">
              Oops! The pearls got stuck in the straw. This page spilled all over the place.
            </p>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-strawberry/20 rounded-full border-3 border-strawberry mb-8">
              <Search className="w-4 h-4 text-strawberry" strokeWidth={3} />
              <span className="font-black text-xs text-strawberry uppercase">404 Error</span>
            </div>

            {/* CTA Buttons - Pomegranate style */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="group inline-flex items-center justify-center gap-2 bg-taro text-white px-8 py-4 rounded-full font-black uppercase border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] hover:shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
              >
                <Home className="w-5 h-5" strokeWidth={3} />
                Back to Home
              </Link>

              <Link
                href="/services"
                className="group inline-flex items-center justify-center gap-2 bg-white text-ink px-8 py-4 rounded-full font-black uppercase border-4 border-ink shadow-[4px_4px_0px_0px_rgba(58,0,29,1)] hover:shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
              >
                <Icon icon="ph:sparkle-duotone" className="w-5 h-5" />
                Browse Services
              </Link>
            </div>
          </div>

          {/* Scattered boba pearls - Pomegranate style */}
          <div className="flex justify-center gap-4 items-center">
            <div className="w-6 h-6 bg-taro rounded-full border-3 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] animate-bounce" />
            <div
              className="w-5 h-5 bg-matcha rounded-full border-3 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] animate-bounce"
              style={{ animationDelay: '0.2s' }}
            />
            <div
              className="w-7 h-7 bg-strawberry rounded-full border-3 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] animate-bounce"
              style={{ animationDelay: '0.4s' }}
            />
            <div
              className="w-5 h-5 bg-thai-tea rounded-full border-3 border-ink shadow-[2px_2px_0px_0px_rgba(58,0,29,1)] animate-bounce"
              style={{ animationDelay: '0.6s' }}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
