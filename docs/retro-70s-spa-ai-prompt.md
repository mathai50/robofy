# AI Frontend Generation Prompt: Retro 70s Spa Landing Page

## High-Level Goal
Create a sophisticated, single-page spa landing website using a retro 70s color palette with warm, sun-drenched tones that evokes luxury and relaxation while maintaining modern usability and accessibility standards.

## Tech Stack & Foundation
- **Framework**: Next.js 14 with React and TypeScript
- **Styling**: TailwindCSS with custom color variables
- **UI Components**: shadcn/ui components (Button, Card, Input, etc.)
- **Animation**: Framer Motion for subtle, organic animations
- **Design System**: Organic, asymmetrical layouts following Robofy design principles
- **Accessibility**: WCAG AA compliance with keyboard navigation and screen reader support

## Detailed, Step-by-Step Instructions

### 1. Color System Setup
```css
/* Custom 70s Spa Color Palette */
:root {
  --warm-linen: #FBF7F0;    /* Primary Background */
  --dark-walnut: #26201B;   /* Primary Text & Headers */
  --burnt-terracotta: #C7533B; /* CTA & Primary Accent */
  --muted-sage: #758E85;    /* Secondary Elements */
  --sunburst-yellow: #F9A825; /* Graphics & Highlights */
}
```

### 2. Typography System
- **Primary Font**: Playfair Display (serif) for headings - evokes 70s elegance
- **Secondary Font**: Montserrat (sans-serif) for body text - clean and readable
- **Font Weights**: Regular 400, Medium 500, Semi-bold 600, Bold 700
- **Fluid Typography**: Use `clamp()` for responsive scaling

### 3. Layout Structure - Organic & Asymmetrical
Create a flowing, non-sectional layout with:
- Overlapping elements and varied spacing
- Asymmetrical grid compositions
- No rigid, boxy sections
- Mobile-first responsive design
- Self-contained page with unique header and footer

### 4. Visual Design Principles
- **No Icons**: Avoid iconography for a more sophisticated, text-based approach
- **Solid Colors Only**: No gradients, use the 70s palette as solid colors
- **Subtle Color Usage**: Use accent colors sparingly (max 10% of composition)
- **Rich Text Hierarchy**: Use typography and spacing instead of icons for visual hierarchy
- **Luxury Imagery**: Sun-drenched spa photography with warm filters
- **Organic Shapes**: Use subtle curves and irregular shapes instead of hard rectangles

### 5. Component Specifications

#### Hero Section
- Asymmetrical layout with text on left (60%), visual element on right (40%)
- Background: Warm Linen with subtle texture overlay
- Headline: "Reawaken Your Senses with Our Vintage-Inspired Spa Experience"
- Subheadline: "Relax, Rejuvenate, and Revitalize with Our Signature Treatments"
- Primary CTA: "Book Your Escape" in Burnt Terracotta
- Secondary CTA: Outline button for "Learn More"
- No icons - use elegant typography and spacing

#### Services Section
- Organic grid with varied card sizes and placements
- Each service card features:
  - Service title in Dark Walnut
  - Description in muted tones
  - Subtle accent border in Muted Sage
  - Hover effect with slight elevation
- Services: Therapeutic Massages, Facials, Foot & Reflexology, Couples Packages, Ayurvedic Treatments, Body Wraps, Aromatherapy

#### Testimonials
- Rotating quote cards with asymmetrical positioning
- Customer names and roles in elegant typography
- Star ratings represented with text symbols (★★★★★)
- No avatar images - focus on the content

#### Booking Form
- Clean, spacious form with ample white space
- Fields: Name, Contact, Service Selection, Preferred Date/Time
- AI-assisted booking integration note
- Submit button in Burnt Terracotta
- Form validation with subtle error states

## Code Examples & Constraints

### Color Usage Constraints
```css
/* Text must maintain 4.5:1 contrast ratio */
.text-primary { color: var(--dark-walnut); }
.text-secondary { color: var(--muted-sage); }
.bg-primary { background-color: var(--warm-linen); }
.bg-accent { background-color: var(--burnt-terracotta); }
```

### Component Integration Rules
- Each shadcn component must be imported directly in the page
- No global CSS dependencies
- Self-contained animations using Framer Motion
- Responsive breakpoints: mobile (<768px), tablet (768-1024px), desktop (1024px+)

### DO NOT INCLUDE:
- Icons or icon libraries
- Gradients or complex backgrounds
- Symmetrical, grid-based layouts
- Global component dependencies
- Overuse of accent colors

## Strict Scope Definition

### Files to Create/Modify:
- `src/app/demo/spa/page.tsx` - Main landing page
- `src/app/demo/spa/components/` - Page-specific components (if needed)

### Files to Leave Untouched:
- Global layout components
- Other demo pages
- Global CSS files
- Shared component libraries

### Development Approach:
1. Start with mobile layout and fluid typography
2. Implement asymmetrical desktop layouts
3. Add subtle animations and micro-interactions
4. Test accessibility and color contrast
5. Optimize performance with lazy loading

## Success Criteria
- Page loads under 3 seconds on 3G
- Perfect Lighthouse scores for accessibility and performance
- Responsive across all device sizes
- Organic, flowing visual experience
- Authentic 70s aesthetic without being kitschy
- Professional, luxury feel without icon dependency

**Important Note**: All AI-generated code requires careful human review, testing, and refinement to be considered production-ready. Pay special attention to accessibility compliance and color contrast ratios.