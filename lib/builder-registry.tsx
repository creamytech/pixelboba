'use client';

import { Builder } from '@builder.io/react';
import dynamic from 'next/dynamic';

// Import your Pomegranate components
const HeroSection = dynamic(() => import('@/components/sections/HeroSection'));
const ServicesPreview = dynamic(() => import('@/components/sections/ServicesPreview'));
const ProcessSection = dynamic(() => import('@/components/sections/ProcessSection'));
const CTASection = dynamic(() => import('@/components/sections/CTASection'));
const SocialProofSection = dynamic(() => import('@/components/sections/SocialProofSection'));
const CodeFirstSection = dynamic(() => import('@/components/sections/CodeFirstSection'));
const BobaClubPromo = dynamic(() => import('@/components/sections/BobaClubPromo'));
const ContactForm = dynamic(() => import('@/components/ContactForm'));

// Boba Club components
const BobaClubHero = dynamic(() => import('@/components/boba-club/BobaClubHero'));
const BobaClubPricing = dynamic(() => import('@/components/boba-club/BobaClubPricing'));
const BobaClubFeatures = dynamic(() => import('@/components/boba-club/BobaClubFeatures'));

/**
 * Register Pomegranate Design System components with Builder.io
 * These components will be available in the visual editor
 */

// Hero Section
Builder.registerComponent(HeroSection, {
  name: 'Hero Section',
  description: 'Main hero section with headline and CTA',
  inputs: [
    {
      name: 'showGetStarted',
      type: 'boolean',
      defaultValue: true,
      helperText: 'Show "Get Started" button',
    },
  ],
  image: 'https://tabler-icons.io/static/tabler-icons/icons-png/layout-navbar.png',
});

// Services Preview
Builder.registerComponent(ServicesPreview, {
  name: 'Services Preview',
  description: 'Preview of services offered',
  image: 'https://tabler-icons.io/static/tabler-icons/icons-png/packages.png',
});

// Process Section
Builder.registerComponent(ProcessSection, {
  name: 'Process Section',
  description: 'How we work process with steps',
  image: 'https://tabler-icons.io/static/tabler-icons/icons-png/timeline.png',
});

// CTA Section
Builder.registerComponent(CTASection, {
  name: 'CTA Section',
  description: 'Call-to-action section with buttons',
  image: 'https://tabler-icons.io/static/tabler-icons/icons-png/click.png',
});

// Social Proof
Builder.registerComponent(SocialProofSection, {
  name: 'Social Proof',
  description: 'Trust badges and social proof',
  image: 'https://tabler-icons.io/static/tabler-icons/icons-png/award.png',
});

// Code First Section
Builder.registerComponent(CodeFirstSection, {
  name: 'Code First Section',
  description: 'Benefits of code-first approach',
  image: 'https://tabler-icons.io/static/tabler-icons/icons-png/code.png',
});

// Boba Club Promo
Builder.registerComponent(BobaClubPromo, {
  name: 'Boba Club Promo',
  description: 'Promotional section for Boba Club subscription',
  image: 'https://tabler-icons.io/static/tabler-icons/icons-png/star.png',
});

// Contact Form
Builder.registerComponent(ContactForm, {
  name: 'Contact Form',
  description: 'Contact form with validation',
  image: 'https://tabler-icons.io/static/tabler-icons/icons-png/mail.png',
});

// Boba Club Hero
Builder.registerComponent(BobaClubHero, {
  name: 'Boba Club Hero',
  description: 'Hero section for Boba Club page',
  image: 'https://tabler-icons.io/static/tabler-icons/icons-png/coffee.png',
});

// Boba Club Pricing
Builder.registerComponent(BobaClubPricing, {
  name: 'Boba Club Pricing',
  description: 'Pricing cards for Boba Club tiers',
  image: 'https://tabler-icons.io/static/tabler-icons/icons-png/credit-card.png',
});

// Boba Club Features
Builder.registerComponent(BobaClubFeatures, {
  name: 'Boba Club Features',
  description: 'Feature list for Boba Club',
  image: 'https://tabler-icons.io/static/tabler-icons/icons-png/list-check.png',
});

// Register image component with upload capability
Builder.registerComponent(
  (props: { image?: string; alt?: string; width?: number; height?: number }) => (
    <img
      src={props.image}
      alt={props.alt || ''}
      width={props.width}
      height={props.height}
      className="w-full h-auto rounded-2xl border-4 border-ink shadow-[8px_8px_0px_0px_rgba(58,0,29,1)]"
    />
  ),
  {
    name: 'Pomegranate Image',
    description: 'Image with Pomegranate styling (bold borders and shadows)',
    inputs: [
      {
        name: 'image',
        type: 'file',
        allowedFileTypes: ['jpeg', 'jpg', 'png', 'svg', 'webp'],
        required: true,
        helperText: 'Upload an image',
      },
      {
        name: 'alt',
        type: 'string',
        defaultValue: 'Image',
        helperText: 'Alt text for accessibility',
      },
      {
        name: 'width',
        type: 'number',
        defaultValue: 800,
      },
      {
        name: 'height',
        type: 'number',
        defaultValue: 600,
      },
    ],
    image: 'https://tabler-icons.io/static/tabler-icons/icons-png/photo.png',
  }
);

// Register a custom heading component
Builder.registerComponent(
  (props: { text: string; level?: 'h1' | 'h2' | 'h3' }) => {
    const Tag = props.level || 'h2';
    return (
      <Tag className="text-5xl md:text-6xl lg:text-7xl font-black text-ink mb-6 leading-tight">
        {props.text}
      </Tag>
    );
  },
  {
    name: 'Pomegranate Heading',
    description: 'Large bold heading with Pomegranate styling',
    inputs: [
      {
        name: 'text',
        type: 'string',
        defaultValue: 'Your Heading Here',
        required: true,
      },
      {
        name: 'level',
        type: 'string',
        enum: ['h1', 'h2', 'h3'],
        defaultValue: 'h2',
      },
    ],
    image: 'https://tabler-icons.io/static/tabler-icons/icons-png/heading.png',
  }
);

// Register a button component
Builder.registerComponent(
  (props: { text: string; href: string; variant?: 'primary' | 'secondary' }) => {
    const isPrimary = props.variant === 'primary';
    return (
      <a
        href={props.href}
        className={`inline-flex items-center px-10 py-5 text-xl font-black rounded-full border-4 border-ink shadow-[6px_6px_0px_0px_rgba(58,0,29,1)] hover:shadow-[8px_8px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all ${
          isPrimary ? 'bg-[#FDB97A] text-ink' : 'bg-white text-ink'
        }`}
      >
        {props.text}
      </a>
    );
  },
  {
    name: 'Pomegranate Button',
    description: 'Button with Pomegranate styling',
    inputs: [
      {
        name: 'text',
        type: 'string',
        defaultValue: 'Click Me',
        required: true,
      },
      {
        name: 'href',
        type: 'string',
        defaultValue: '/start',
        required: true,
      },
      {
        name: 'variant',
        type: 'string',
        enum: ['primary', 'secondary'],
        defaultValue: 'primary',
      },
    ],
    image: 'https://tabler-icons.io/static/tabler-icons/icons-png/button.png',
  }
);

console.log('✅ Builder.io components registered successfully');
