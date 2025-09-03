import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ShoppingBag, Coffee, Layers, Zap, Rocket, RotateCcw } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Our Process - How We Work',
  description:
    'Our proven 6-step process ensures every project is delivered on time, on budget, and exceeds expectations.',
};

const processSteps = [
  {
    icon: ShoppingBag,
    title: 'Shake',
    description:
      'We start by understanding your goals, audience, and challenges. This discovery phase helps us create a tailored strategy.',
    details: ['Stakeholder interviews', 'Competitive analysis', 'User research', 'Goal definition'],
  },
  {
    icon: Coffee,
    title: 'Brew',
    description:
      'With insights gathered, we develop a comprehensive plan including sitemap, wireframes, and technical architecture.',
    details: ['Information architecture', 'Wireframing', 'Technical planning', 'Content strategy'],
  },
  {
    icon: Layers,
    title: 'Layer',
    description:
      'Our design phase brings your brand to life with beautiful, user-centered interfaces and engaging experiences.',
    details: ['Visual design', 'UI components', 'Interaction design', 'Design system'],
  },
  {
    icon: Zap,
    title: 'Pop',
    description:
      'Development begins with clean, efficient code and attention to performance, accessibility, and SEO.',
    details: [
      'Front-end development',
      'Back-end integration',
      'Performance optimization',
      'Quality assurance',
    ],
  },
  {
    icon: Rocket,
    title: 'Launch',
    description:
      'We handle deployment, testing, and launch coordination to ensure everything goes smoothly from day one.',
    details: ['Deployment setup', 'Final testing', 'Launch coordination', 'Monitoring setup'],
  },
  {
    icon: RotateCcw,
    title: 'Iterate',
    description:
      'Post-launch, we monitor performance and gather feedback to continuously improve your digital experience.',
    details: [
      'Performance monitoring',
      'User feedback analysis',
      'Ongoing optimization',
      'Support & maintenance',
    ],
  },
];

export default function ProcessPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-display text-5xl md:text-6xl font-bold text-ink mb-6">
                Our Process
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Like crafting the perfect boba tea, creating exceptional digital experiences
                requires the right ingredients, technique, and timing. Here&apos;s how we do it.
              </p>
            </div>
          </div>
        </section>

        {/* Process Steps */}
        <section className="pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {processSteps.map((step, index) => {
                const Icon = step.icon;
                const isEven = index % 2 === 0;

                return (
                  <div key={step.title} className="relative">
                    {/* Connector Line */}
                    {index < processSteps.length - 1 && (
                      <div className="absolute left-1/2 transform -translate-x-1/2 w-px h-20 bg-gradient-to-b from-taro to-transparent mt-20 z-0" />
                    )}

                    <div
                      className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-16 mb-20 ${isEven ? '' : 'lg:flex-row-reverse'}`}
                    >
                      {/* Content */}
                      <div className="flex-1">
                        <div className="bg-white p-8 rounded-lg shadow-lg">
                          <div className="flex items-center mb-6">
                            <div className="w-12 h-12 bg-taro/10 rounded-lg flex items-center justify-center mr-4">
                              <Icon className="w-6 h-6 text-taro" />
                            </div>
                            <div>
                              <span className="text-sm text-gray-500 font-medium">
                                Step {index + 1}
                              </span>
                              <h3 className="font-display text-2xl font-bold text-ink">
                                {step.title}
                              </h3>
                            </div>
                          </div>

                          <p className="text-gray-600 mb-6">{step.description}</p>

                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {step.details.map((detail) => (
                              <li key={detail} className="flex items-center text-sm text-gray-500">
                                <div className="w-2 h-2 bg-matcha rounded-full mr-3 flex-shrink-0" />
                                {detail}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Visual Element */}
                      <div className="w-32 h-32 lg:w-40 lg:h-40 bg-gradient-to-br from-taro to-deep-taro rounded-full flex items-center justify-center relative">
                        <Icon className="w-12 h-12 lg:w-16 lg:h-16 text-white" />

                        {/* Decorative pearls */}
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-matcha rounded-full opacity-80" />
                        <div className="absolute -bottom-3 -left-1 w-4 h-4 bg-brown-sugar rounded-full opacity-60" />
                        {index % 3 === 0 && (
                          <div className="absolute top-1/2 -right-4 w-3 h-3 bg-milk-tea rounded-full opacity-70" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-milk-tea">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-display text-4xl font-bold text-ink mb-6">
                Ready to Start Your Project?
              </h2>
              <p className="text-xl text-brown-sugar mb-8">
                Let&apos;s begin with a conversation about your goals and how we can help you
                achieve them.
              </p>
              <a
                href="/contact"
                className="inline-block bg-taro text-white px-8 py-3 rounded-lg font-semibold hover:bg-deep-taro transition-colors duration-200"
              >
                Let&apos;s Talk
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
