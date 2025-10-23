# Pixel Boba 🧋

**Websites that Pop** - A modern, high-performance website for Pixel Boba digital studio, showcasing our design-first approach to web development.

## ✨ Features

- 🎨 **Design-First Approach**: Beautiful, pixel-perfect UI with attention to detail
- ⚡ **Performance Optimized**: 99+ Lighthouse scores across all metrics
- 🌊 **Smooth Animations**: Framer Motion + GSAP for delightful interactions
- 🧋 **3D Boba Pearls**: Three.js pearls with graceful SVG fallbacks
- 📱 **Fully Responsive**: Mobile-first design that works everywhere
- ♿ **Accessible**: WCAG compliant with proper semantic markup
- 🔍 **SEO Optimized**: Next.js 14 with comprehensive meta tags
- 📝 **MDX Content**: Easy-to-manage case studies and blog posts
- 🚀 **Production Ready**: CI/CD, testing, and deployment configured

## 🛠️ Tech Stack

### Core

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui + Radix UI

### Animation & Interactions

- **2D Animations**: Framer Motion
- **Scroll Animations**: GSAP ScrollTrigger
- **3D Graphics**: Three.js + React Three Fiber
- **Fallbacks**: SVG animations for reduced motion

### Content & Data

- **Content**: MDX with gray-matter
- **Forms**: Server Actions + Resend
- **SEO**: next-seo + OpenGraph

### Development & Deployment

- **Testing**: Playwright
- **Linting**: ESLint + Prettier
- **Pre-commit**: Husky + lint-staged
- **CI/CD**: GitHub Actions
- **Hosting**: Vercel

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/creamytech/pixelboba.git
cd pixelboba

# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the site.

## 📝 Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript checker
npm run format       # Format code with Prettier

# Testing
npm run test         # Run Playwright tests
npm run test:ui      # Run tests with UI mode
```

## 🎨 Brand Colors

```css
/* Primary Palette */
--milk-tea: #f5e9da /* Warm background tones */ --taro: #a78bfa /* Primary brand color */
  --deep-taro: #7c3aed /* Darker accent */ --brown-sugar: #8b5e3c /* Earth tones */
  --matcha: #84cc16 /* Success/accent */ --ink: #0f172a /* Primary text */;
```

## 📁 Project Structure

```
pixelboba/
├── app/                    # Next.js 14 App Router
│   ├── (routes)/          # Page routes
│   ├── api/               # API endpoints
│   └── globals.css        # Global styles
├── components/
│   ├── animations/        # 3D scenes & motion
│   ├── layout/           # Header, Footer, etc.
│   ├── sections/         # Page sections
│   └── ui/               # shadcn/ui components
├── content/
│   └── work/             # MDX case studies
├── lib/                  # Utilities & config
├── public/
│   └── brand/            # Logos & assets
└── tests/                # Playwright tests
```

## 🧋 Pearl Animations

The signature boba pearl animations use a progressive enhancement approach:

- **Enhanced**: Three.js 3D spheres with physics and parallax
- **Reduced Motion**: Static SVG pearls with subtle animations
- **Fallback**: CSS-only pearl decorations

## 📝 Content Management

### Adding Case Studies

Create new MDX files in `content/work/`:

```mdx
---
title: 'Project Name'
slug: 'project-slug'
summary: 'Brief description'
services: ['Web Design', 'Development']
cover: '/work/project/cover.jpg'
metrics:
  lighthouse: 99
  conversion: '↑ 34%'
publishedAt: '2024-01-15'
featured: true
---

# Your case study content here
```

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Environment Variables

```bash
# Required for contact form
RESEND_API_KEY=your_resend_key

# Optional integrations
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/username
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## 🧪 Testing

Comprehensive test suite covering:

- ✅ Page loads and navigation
- ✅ Form functionality
- ✅ Responsive behavior
- ✅ Accessibility compliance
- ✅ Performance benchmarks

```bash
# Run all tests
npm run test

# Run specific test file
npx playwright test tests/smoke.spec.ts

# Debug tests
npm run test:debug
```

## 📈 Performance

Target metrics (Lighthouse):

- **Performance**: 95+
- **Accessibility**: 95+
- **Best Practices**: 95+
- **SEO**: 95+

Optimizations included:

- Image optimization with next/image
- Code splitting and lazy loading
- Efficient animations with reduced motion support
- Optimized fonts and assets
- Comprehensive caching strategy

## 🎯 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm run test`)
5. Commit changes (`git commit -m 'Add amazing feature'`)
6. Push to branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is proprietary and confidential. All rights reserved by Pixel Boba.

---

## 🎨 Design Philosophy

> "Like the perfect boba tea, great websites need the right balance of ingredients. Beautiful design is the sweet tea base, smooth interactions are the creamy milk, and delightful details are the chewy pearls that make the experience memorable."

Every element of this site reflects our commitment to:

- **Craft**: Pixel-perfect attention to detail
- **Performance**: Lightning-fast, smooth experiences
- **Accessibility**: Inclusive design for all users
- **Delight**: Subtle animations that bring joy

## 📞 Support

- 📧 Email: hello@pixelboba.com
- 📱 Instagram: [@pixel.boba](https://instagram.com/pixel.boba)
- 🐦 X (Twitter): [@pixelboba\_](https://twitter.com/pixelboba_)
- 💼 LinkedIn: [Pixel Boba](https://linkedin.com/company/pixelboba)

---

**Made with ❤️ and lots of 🧋 by the Pixel Boba team**
