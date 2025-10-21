'use client';

import { Icon } from '@iconify/react';

const testimonials = [
  {
    quote:
      'Boba Club changed how we handle design. Fast, consistent, and top-tier quality every time.',
    author: 'Ava',
    role: 'Founder of Bloom Studio',
    color: '#A78BFA',
    initial: 'A',
  },
  {
    quote:
      'Our brand finally feels cohesive across every channel. Could not recommend Pixel Boba enough.',
    author: 'Liam',
    role: 'Marketing Lead',
    color: '#84CC16',
    initial: 'L',
  },
  {
    quote: 'It is like having an in-house design team without the overhead.',
    author: 'Maya',
    role: 'Creator & Entrepreneur',
    color: '#8B5E3C',
    initial: 'M',
  },
];

export default function BobaClubTestimonials() {
  return (
    <section className="py-24 bg-cream relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black text-ink mb-4">
            clients who <span className="italic text-[#7C3AED]">joined the club</span>
          </h2>
          <p className="text-xl md:text-2xl text-ink/70 font-bold max-w-2xl mx-auto">
            see what creators and brands are saying about boba club.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-8 border-4 border-ink shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] hover:shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all h-full flex flex-col"
              >
                {/* Quote icon */}
                <Icon
                  icon="ph:chat-circle-dots-duotone"
                  className="w-12 h-12 text-deep-taro mb-4"
                />

                {/* Quote text */}
                <p className="text-lg text-ink font-bold leading-relaxed mb-6 flex-grow">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>

                {/* Author info */}
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-black text-white border-4 border-ink"
                    style={{
                      backgroundColor: testimonial.color,
                    }}
                  >
                    {testimonial.initial}
                  </div>

                  <div>
                    <p className="font-black text-ink">{testimonial.author}</p>
                    <p className="text-sm text-ink/60 font-bold">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
