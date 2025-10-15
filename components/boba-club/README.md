# Boba Club Page Components

This directory contains all the components for the Boba Club subscription service landing page (`/boba-club`).

## Overview

The Boba Club page is a fully animated, interactive landing page designed to showcase Pixel Boba's unlimited design subscription service. It features extensive animations, 3D elements, and engaging UX touches throughout.

## Components

### Core Sections

1. **BobaClubHero.tsx**
   - Hero section with animated headline (letter-by-letter reveal)
   - 3D boba cup morphing animation
   - Floating pearl background with parallax effects
   - Primary and secondary CTAs with hover animations
   - Location: Top of page

2. **BobaClubHowItWorks.tsx**
   - 5-step process visualization
   - Animated pipeline with boba pearls flowing through steps
   - Alternating left/right layout for visual interest
   - Pearl drop animations when hovering over steps
   - SVG path animations connecting steps

3. **BobaClubFeatures.tsx**
   - Grid of 14 included features with micro-animations
   - Each card has icon rotation on hover
   - Sparkle effects and gradient orbs
   - "Not Included" section for transparency
   - Staggered entrance animations

4. **BobaClubWhyUs.tsx**
   - 6 key benefits in a grid layout
   - Auto-rotating testimonials carousel
   - Floating background decorations
   - Gradient orbs on hover
   - Animated avatars with pearl effects

5. **BobaClubPricing.tsx**
   - Single pricing tier with prominent display
   - Mouse-tracking gradient glow effect
   - Animated border shimmer
   - Feature checklist with staggered reveals
   - Risk-free guarantee badge

6. **BobaClubFAQ.tsx**
   - Accordion-style FAQ with 8 questions
   - Boba pearl drop animation when opening items
   - Splash/ripple effect on expand
   - Smooth accordion transitions
   - Floating background pearls

7. **BobaClubPortfolio.tsx**
   - 3x3 masonry grid of work samples
   - Hover reveals with before/after labels
   - Gradient overlays and sparkle effects
   - Varying heights for visual interest
   - Links to full portfolio page

8. **BobaClubTestimonials.tsx**
   - 3-card testimonial display
   - Animated avatars with orbiting pearls
   - Floating confetti/pearl background
   - Quote icons and decorative elements
   - Staggered entrance animations

9. **BobaClubFinalCTA.tsx**
   - Full-width gradient background section
   - Animated boba cup mascot with waving hand
   - Rising pearl animations
   - Confetti burst effects
   - Dual CTAs with prominent styling

### Supporting Components

10. **BobaMorphAnimation.tsx**
    - 3D scene using React Three Fiber
    - Morphing sphere with distortion material
    - Floating tool representations (simplified spheres)
    - Auto-rotating camera controls
    - Ambient and point lighting

11. **FloatingPearls.tsx**
    - Reusable background pearl animation
    - 8 pearls with varying sizes and colors
    - Parallax floating effect
    - Uses brand colors (taro, matcha, brown-sugar, milk-tea)

12. **BobaClubStickyButton.tsx**
    - Fixed position bottom-right button
    - Appears after scrolling 300px
    - Pulse ring animation
    - Shimmer effect on hover
    - Floating pearl decoration

## Page Structure

The main page file is located at:

- `app/boba-club/page.tsx`

It imports all sections and renders them in order:

1. Hero
2. How It Works
3. Features (What You Get)
4. Why Us (with testimonials)
5. Pricing
6. FAQ
7. Portfolio Preview
8. Testimonials
9. Final CTA

Plus the sticky button overlay.

## Animations & Interactions

### Animation Techniques Used

- **Framer Motion**: Primary animation library
  - `motion` components for declarative animations
  - `useInView` hook for scroll-triggered animations
  - `AnimatePresence` for enter/exit animations
  - Staggered children animations

- **3D Graphics**: React Three Fiber
  - Custom sphere with distortion material
  - Orbital controls
  - Ambient and point lighting

- **Micro-interactions**:
  - Hover scale/translate effects
  - Icon rotations
  - Pulse rings
  - Shimmer effects
  - Pearl drops
  - Confetti bursts

### Key Animation Patterns

1. **Scroll-triggered reveals**: Elements fade/slide in when scrolled into view
2. **Staggered delays**: Items in lists animate in sequence
3. **Infinite loops**: Pearls floating, orbits rotating, pulses
4. **Hover states**: Scale, translate, rotate, glow effects
5. **Conditional animations**: Different states based on interaction

## Styling

- **Tailwind CSS**: Utility-first styling
- **Brand Colors**:
  - `taro` (#A78BFA) - Primary purple
  - `deep-taro` (#7C3AED) - Darker purple
  - `matcha` (#84CC16) - Green accent
  - `brown-sugar` (#8B5E3C) - Brown accent
  - `milk-tea` (#F5E9DA) - Cream background
  - `ink` (#0F172A) - Dark text

- **Gradients**: Heavy use of radial and linear gradients
- **Shadows**: Layered shadows for depth
- **Backdrop blur**: For glassmorphism effects

## Customization

### To Update Content:

1. **Testimonials**: Edit the `testimonials` array in `BobaClubWhyUs.tsx` and `BobaClubTestimonials.tsx`
2. **Features**: Edit the `includedFeatures` and `notIncluded` arrays in `BobaClubFeatures.tsx`
3. **FAQs**: Edit the `faqs` array in `BobaClubFAQ.tsx`
4. **Pricing**: Update price and features in `BobaClubPricing.tsx`
5. **Portfolio**: Replace placeholder items in `BobaClubPortfolio.tsx` with real work

### To Adjust Animations:

- Modify `transition` props on `motion` components
- Adjust `delay` values for stagger effects
- Change `duration` for speed
- Update `ease` functions for animation curves

## Performance Considerations

- Animations use `useInView` with `once: true` to prevent re-triggering
- 3D scene is isolated to hero section only
- Lazy loading recommended for portfolio images
- Motion values use GPU-accelerated properties (transform, opacity)
- Reduced motion should be considered for accessibility

## Browser Support

- Modern browsers with ES6+ support
- WebGL support required for 3D animations
- Tested on Chrome, Firefox, Safari, Edge

## Future Enhancements

- [ ] Add cursor trail with boba pearls
- [ ] Implement loading screen with boba cup filling
- [ ] Add sound effects (optional bubble pops)
- [ ] Create video background option for hero
- [ ] Add real portfolio images
- [ ] Implement A/B testing for CTA variations
- [ ] Add analytics tracking for scroll depth
- [ ] Create mobile-specific optimizations

## Dependencies

Required packages (already installed):

- `framer-motion` - Animations
- `@react-three/fiber` - 3D rendering
- `@react-three/drei` - 3D helpers
- `three` - 3D library
- `lucide-react` - Icons
- `next` - Framework
- `react` - UI library

## Notes

- All text uses lowercase styling to match brand voice
- Pearls are a recurring visual motif throughout
- Color scheme maintains consistency across all sections
- Mobile responsiveness built into all components
- Accessibility features include semantic HTML and ARIA labels
