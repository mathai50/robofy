# Retro 70s Salon Landing Page - UX Specification

## Project Overview
Create a single-page, stylish salon landing website using a bold 70s retro color palette with solid colors (no gradients). The site should be visually striking with vibrant vintage hues that reflect the fun and nostalgic energy of the 1970s, while maintaining usability, clear CTAs, and SEO optimization.

## Design System

### Color Palette (70s Retro Theme)
```css
/* CSS Variables for 70s Retro Salon */
:root {
  --warm-beige: #F5ECCD;      /* Background */
  --avocado-green: #89A36F;   /* Buttons/icons/highlights */
  --burnt-orange: #D96C3A;    /* Headlines/CTAs */
  --mustard-yellow: #E2B857;  /* Badges/links */
  --cocoa-brown: #6E4B2A;     /* Navigation/footer/text */
  --off-white: #FAF8F1;       /* Hero/sections/background */
}
```

### Typography
- **Headings**: Playfair Display (Serif) - for elegant, retro feel
- **Body Text**: Montserrat (Sans-serif) - for readability and modern contrast
- **Font Weights**: 300, 400, 500, 600, 700
- **Fluid Typography Scale**:
  - h1: `clamp(2.5rem, 5vw, 4rem)`
  - h2: `clamp(2rem, 4vw, 3rem)`
  - h3: `clamp(1.5rem, 3vw, 2.25rem)`
  - Body: `clamp(1rem, 2vw, 1.125rem)`

## Page Structure & Layout

### Organic Layout Principles
- **Asymmetrical Balance**: Avoid symmetrical grids, create visual interest through uneven compositions
- **Component Fusion**: Blend shadcn components organically rather than in rigid sections
- **Overlapping Elements**: Create depth and visual flow through strategic overlapping
- **Varied Spacing**: Use organic spacing (multiples of 4px) with intentional variation
- **Mobile-First**: Single-column flow on mobile, introduce asymmetry on larger screens

### Section Breakdown

#### 1. Hero Section (Organic Asymmetrical)
**Layout**: 60/40 split with offset positioning
- **Left Column (60%)**: Main content with staggered animations
  - Badge: "Vintage Luxury Salon" in avocado green
  - Headline: "Experience Your Best Look with Our Expert Stylists"
  - Subheadline: "Cutting-edge Haircuts, Vibrant Colors & Personalized Beauty Services"
  - Primary CTA: "Book Your Appointment" (burnt orange)
  - Secondary CTA: "See Services" (outline)
  - Trust indicators with retro icons

- **Right Column (40%)**: Visual element
  - Background image: https://images.unsplash.com/photo-1744095407400-aa337918bbb1
  - Overlay with warm beige gradient
  - Floating special offer card

#### 2. Popular Salon Services (Organic Grid)
**Layout**: Asymmetrical 3-column grid with varied card heights
- **Services to Include**:
  - Haircuts (women's, men's, kids)
  - Hair Coloring (balayage, highlights, keratin treatments)
  - Styling (wedding hair, blowouts, updos)
  - Facials & Skincare treatments
  - Manicure & Pedicure
  - Waxing services
  - Extensions & Treatments

**Card Design**:
- Hover effects with scale and shadow
- Border-left accents in avocado green
- Duration badges in mustard yellow
- Organic staggered placement (some cards offset)

#### 3. Why Choose Us (Split Layout)
**Layout**: 40/60 split with organic text flow
- **Left Column (40%)**: Descriptive text with badge
  - Headline: "Why Choose Vintage Vibe Salon"
  - Descriptive paragraph
  - "Our Story" CTA button

- **Right Column (60%)**: Feature grid (2x2)
  - Experienced and friendly stylists
  - Personalized consultations
  - Eco-friendly and cruelty-free products
  - Comfortable, relaxing atmosphere

#### 4. Customer Testimonials (Staggered Grid)
**Layout**: 3-column grid with vertical offset
- Rotating quotes from 3-5 clients
- 5-star rating display with mustard yellow stars
- Client photos and service types
- Asymmetrical placement (middle card offset downward)

#### 5. Booking Section (Centered Form)
**Layout**: Centered card with organic spacing
- Appointment form fields:
  - Name, Contact Info, Service Requested, Preferred Date/Time
  - Styled with 70s color accents
  - AI scheduling integration note

#### 6. Contact & Location (Split Layout)
**Layout**: 50/50 split with embedded map
- **Left Column**: Contact details with retro icons
  - Phone, Email, Address, Hours
  - Social media icons (Instagram, Facebook, TikTok)
- **Right Column**: Embedded Google Map
  - Styled with 70s color overlay

## Animation & Micro-interactions

### Entrance Animations
```typescript
const fadeInUp = {
  hidden: { y: 40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};
```

### Hover Effects
- **Cards**: Scale (105%) and shadow elevation
- **Buttons**: Background color darkening and subtle translate
- **Links**: Color transition to burnt orange

## Responsive Design

### Breakpoints
- **Mobile**: < 768px - Single column, stacked layout
- **Tablet**: 768px - 1024px - Begin introducing asymmetry
- **Desktop**: 1024px+ - Full organic composition

### Mobile Adaptations
- Hero becomes single column with image background
- Services grid becomes 2-column then single column
- Split layouts stack vertically
- Font sizes adjust with fluid typography

## SEO Strategy

### Target Keywords
- hair salon
- hair salon near me
- women's haircut
- balayage near me
- best wedding hair stylist
- keratin treatment
- manicure and pedicure near me
- waxing salon

### Structured Data
```json
{
  "@context": "https://schema.org",
  "@type": "HairSalon",
  "name": "Vintage Vibe Salon",
  "description": "Cutting-edge Haircuts, Vibrant Colors & Personalized Beauty Services",
  "service": [
    "Haircut",
    "Hair Coloring",
    "Styling",
    "Facials",
    "Manicure",
    "Pedicure",
    "Waxing"
  ]
}
```

## Technical Implementation

### Component Architecture
- Self-contained page (no global dependencies)
- Direct component imports from shadcn
- Custom animations per section
- CSS variables for color theming

### Required Dependencies
```typescript
// Core dependencies
"framer-motion": "^10.16.4",
"next/font": "13.5.6",
"@/components/ui/*": "Local shadcn components"

// Fonts
Playfair_Display, Montserrat
```

### File Structure
```
src/app/demo/salon/
├── page.tsx                 # Main page component
├── components/              # Page-specific components (if needed)
│   ├── HeroSection.tsx
│   ├── ServicesGrid.tsx
│   └── BookingForm.tsx
└── data/                   # Page-specific data
    ├── services.ts
    ├── testimonials.ts
    └── business-info.ts
```

## Accessibility Considerations

### Color Contrast
- Maintain 4.5:1 contrast ratio for all text
- Test cocoa brown on warm beige/off-white
- Ensure interactive elements have clear focus states

### Keyboard Navigation
- Logical tab order despite asymmetrical layout
- Skip navigation link
- Clear focus indicators

### Screen Readers
- Semantic HTML structure
- Appropriate ARIA labels
- Logical content order

## Success Metrics

### UX Goals
- **Conversion Rate**: Booking form submissions
- **Engagement**: Time on page, scroll depth
- **Mobile Performance**: Core Web Vitals scores
- **Accessibility**: WCAG 2.1 AA compliance

### Performance Targets
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- First Input Delay: < 100ms

## Implementation Notes

### Color Application Guidelines
- Use accent colors sparingly (no more than 10% of composition)
- Warm beige as primary background
- Burnt orange for primary CTAs and key headlines
- Avocado green for secondary elements and highlights
- Mustard yellow for badges and decorative elements
- Cocoa brown for body text and navigation

### Organic Layout Patterns
- Draw inspiration from existing demo pages but create fresh compositions
- Each section should have unique layout characteristics
- Vary component sizes and spacing intentionally
- Break out of traditional grid constraints

This specification provides the foundation for creating an outstanding 70s retro salon landing page that balances nostalgic aesthetics with modern usability and performance.