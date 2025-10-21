'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

const highlights = [
  {
    icon: 'ph:currency-dollar-duotone',
    title: 'Predictable Pricing',
    description: 'One flat rate. No hourly billing or scope creep.',
    color: 'text-matcha',
  },
  {
    icon: 'ph:target-duotone',
    title: 'Consistent Quality',
    description: 'Your dedicated Pixel Boba designer learns your brand and stays aligned.',
    color: 'text-deep-taro',
  },
  {
    icon: 'ph:lightning-duotone',
    title: 'Lightning Fast Delivery',
    description: 'Receive new work in 24-48 hours on average.',
    color: 'text-matcha',
  },
  {
    icon: 'ph:trophy-duotone',
    title: 'Full Creative Ownership',
    description: 'Every file and design is yours to keep forever.',
    color: 'text-deep-taro',
  },
  {
    icon: 'ph:calendar-duotone',
    title: 'No Commitment Needed',
    description: 'Pause or cancel whenever you need.',
    color: 'text-matcha',
  },
  {
    icon: 'ph:palette-duotone',
    title: 'Streamlined Workflow',
    description: 'Submit, track, and revise from one easy dashboard.',
    color: 'text-deep-taro',
  },
];

const testimonials = [
  {
    quote:
      'Boba Club changed how we handle design. Fast, consistent, and top-tier quality every time.',
    author: 'Ava',
    role: 'Founder of Bloom Studio',
    avatar: '/avatars/avatar-1.jpg',
    color: '#A78BFA',
  },
  {
    quote:
      'Our brand finally feels cohesive across every channel. Could not recommend Pixel Boba enough.',
    author: 'Liam',
    role: 'Marketing Lead',
    avatar: '/avatars/avatar-2.jpg',
    color: '#84CC16',
  },
  {
    quote: 'It is like having an in-house design team without the overhead.',
    author: 'Maya',
    role: 'Creator & Entrepreneur',
    avatar: '/avatars/avatar-3.jpg',
    color: '#8B5E3C',
  },
];

export default function BobaClubWhyUs() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 bg-cream relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black text-ink mb-4">
            why creators and brands <span className="italic text-[#7C3AED]">love boba club</span>
          </h2>
        </div>

        {/* Highlights Grid */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {highlights.map((highlight, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-8 border-4 border-ink shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] hover:shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
              >
                {/* Icon */}
                <Icon icon={highlight.icon} className={`w-16 h-16 ${highlight.color} mb-4`} />

                <h3 className="text-2xl font-black text-ink mb-3">{highlight.title}</h3>
                <p className="text-ink/70 font-bold leading-relaxed">{highlight.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Carousel */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl p-12 border-4 border-ink shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] overflow-hidden">
            {/* Testimonial content */}
            <div className="text-center">
              {/* Quote */}
              <div className="mb-8">
                <Icon
                  icon="ph:chat-circle-dots-duotone"
                  className="w-16 h-16 text-deep-taro mx-auto mb-4"
                />
                <p className="text-2xl md:text-3xl font-bold text-ink leading-relaxed">
                  &ldquo;{testimonials[currentTestimonial].quote}&rdquo;
                </p>
              </div>

              {/* Author */}
              <div className="flex items-center justify-center gap-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black text-white border-4 border-ink"
                  style={{
                    backgroundColor: testimonials[currentTestimonial].color,
                  }}
                >
                  {testimonials[currentTestimonial].author[0]}
                </div>

                <div className="text-left">
                  <p className="font-black text-ink text-lg">
                    {testimonials[currentTestimonial].author}
                  </p>
                  <p className="text-ink/60 font-bold">{testimonials[currentTestimonial].role}</p>
                </div>
              </div>

              {/* Navigation dots */}
              <div className="flex items-center justify-center gap-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`h-3 rounded-full transition-all duration-300 border-2 border-ink ${
                      index === currentTestimonial
                        ? 'bg-[#7C3AED] w-8'
                        : 'bg-ink/20 w-3 hover:bg-ink/40'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
