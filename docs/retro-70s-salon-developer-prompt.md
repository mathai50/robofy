# Developer Prompt: Create 70s Retro Salon Landing Page

## Project Goal
Build a single-page, stylish salon landing website using a bold 70s retro color palette with solid colors (no gradients). Create a visually striking page with vibrant vintage hues that reflect the fun and nostalgic energy of the 1970s, while maintaining usability, clear CTAs, and SEO optimization.

## Technical Requirements

### Tech Stack
- **Frontend**: Next.js with React, TypeScript
- **Styling**: TailwindCSS with CSS variables
- **UI Components**: shadcn UI components
- **Animations**: Framer Motion
- **Icons**: Lucide icons
- **Fonts**: Playfair Display (headings), Montserrat (body)

### File Location
Create at: `src/app/demo/salon/page.tsx`

## Design Implementation

### 70s Retro Color Palette
```css
/* Define these CSS variables in the component */
--warm-beige: #F5ECCD;      /* Background */
--avocado-green: #89A36F;   /* Buttons/icons/highlights */
--burnt-orange: #D96C3A;    /* Headlines/CTAs */
--mustard-yellow: #E2B857;  /* Badges/links */
--cocoa-brown: #6E4B2A;     /* Navigation/footer/text */
--off-white: #FAF8F1;       /* Hero/sections/background */
```

### Organic Layout Principles
- Use asymmetrical, non-grid layouts
- Implement staggered animations with Framer Motion
- Create overlapping elements for depth
- Vary spacing organically (multiples of 4px but intentionally varied)
- Each section should have unique layout characteristics

## Page Sections to Implement

### 1. Hero Section (Organic Asymmetrical)
**Layout**: 60/40 split with offset positioning
```typescript
// Left Column (60%): Main content
- Badge: "Vintage Luxury Salon" (avocado green background)
- Headline: "Experience Your Best Look with Our Expert Stylists"
- Subheadline: "Cutting-edge Haircuts, Vibrant Colors & Personalized Beauty Services"
- Primary CTA: "Book Your Appointment" (burnt orange)
- Secondary CTA: "See Services" (outline)
- Trust indicators with retro icons (✦ symbol)

// Right Column (40%): Visual element
- Background image: https://images.unsplash.com/photo-1744095407400-aa337918bbb1
- Overlay with warm beige gradient
- Floating special offer card
```

### 2. Popular Salon Services (Organic Grid)
**Services Array**:
```typescript
const salonServices = [
  {
    title: 'Haircuts',
    description: 'Expert cuts for women, men, and kids with personalized styling advice.',
    duration: '45-60 min'
  },
  {
    title: 'Hair Coloring',
    description: 'Balayage, highlights, and vibrant color transformations with keratin treatments.',
    duration: '2-3 hours'
  },
  {
    title: 'Styling',
    description: 'Wedding hair, blowouts, updos, and special occasion styling.',
    duration: '60-90 min'
  },
  {
    title: 'Facials & Skincare',
    description: 'Customized facials using organic ingredients for radiant, rejuvenated skin.',
    duration: '45-75 min'
  },
  {
    title: 'Manicure & Pedicure',
    description: 'Professional nail care with premium products and relaxing treatments.',
    duration: '60-90 min'
  },
  {
    title: 'Waxing Services',
    description: 'Precise and comfortable hair removal with soothing aftercare.',
    duration: '15-45 min'
  },
  {
    title: 'Extensions & Treatments',
    description: 'Hair extensions, keratin treatments, and scalp therapies.',
    duration: '2-4 hours'
  }
];
```

**Grid Layout**: Asymmetrical 3-column with varied card heights and offsets

### 3. Why Choose Us Section (Split Layout)
**Layout**: 40/60 split
```typescript
// Left Column (40%): Text content
- Badge: "Excellence" (burnt orange)
- Headline: "Why Choose Vintage Vibe Salon"
- Description paragraph
- "Our Story" CTA button

// Right Column (60%): Feature grid (2x2)
const whyChooseUs = [
  {
    title: 'Experienced Stylists',
    description: 'Our team of certified professionals brings decades of combined experience and personalized care.'
  },
  {
    title: 'Personalized Consultations',
    description: 'One-on-one consultations to understand your unique style and beauty goals.'
  },
  {
    title: 'Eco-Friendly Products',
    description: 'We use only cruelty-free, organic products that are gentle on you and the environment.'
  },
  {
    title: 'Relaxing Atmosphere',
    description: 'Our vintage-inspired space is designed to transport you to a peaceful, bygone era.'
  }
];
```

### 4. Customer Testimonials (Staggered Grid)
**Testimonials Array**:
```typescript
const testimonials = [
  {
    name: 'Jessica Taylor',
    role: 'Regular Client',
    content: 'Best color service I\'ve ever had! The balayage turned out perfectly and lasted months.',
    rating: 5,
    service: 'Hair Coloring'
  },
  {
    name: 'Marcus Rodriguez',
    role: 'New Client',
    content: 'The stylists really listen to what you want. Got the perfect cut that suits my face shape.',
    rating: 5,
    service: 'Haircut'
  },
  {
    name: 'Sophia Chen',
    role: 'Bride',
    content: 'Love the retro vibe and amazing service. My wedding hair was absolutely stunning!',
    rating: 5,
    service: 'Wedding Styling'
  }
];
```

**Layout**: 3-column grid with middle card offset downward

### 5. Booking Section
**Form Fields**:
- Name (text input)
- Email (email input)
- Phone (tel input)
- Service (select dropdown with services)
- Preferred Date/Time (datetime input)
- Message (textarea)

**Styling**: Centered card with 70s color accents

### 6. Contact & Location Section
**Layout**: 50/50 split
```typescript
// Left Column: Contact details
- Phone: (555) 987-6543
- Email: hello@vintagevibesalon.com
- Address: 456 Retro Avenue, City, State 12345
- Hours: Tue-Sat: 9AM-7PM, Sun: 10AM-4PM
- Social media icons (Instagram, Facebook, TikTok)

// Right Column: Embedded Google Map
```

## Animation Specifications

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
- Cards: `scale(1.05)` and shadow elevation
- Buttons: Background color darkening and subtle translate
- Links: Color transition to burnt orange

## SEO & Structured Data

### JSON-LD Schema
```json
{
  "@context": "https://schema.org",
  "@type": "HairSalon",
  "name": "Vintage Vibe Salon",
  "description": "Cutting-edge Haircuts, Vibrant Colors & Personalized Beauty Services",
  "telephone": "(555) 987-6543",
  "email": "hello@vintagevibesalon.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "456 Retro Avenue",
    "addressLocality": "City",
    "addressRegion": "State",
    "postalCode": "12345"
  },
  "openingHours": "Tu-Sa 09:00-19:00, Su 10:00-16:00",
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

## Implementation Guidelines

### 1. Self-Contained Page
- Import all components directly (no global dependencies)
- Define CSS variables in the component
- Use page-specific animations
- Follow the organic design principles from the Robofy design guide

### 2. Responsive Design
- Mobile-first approach
- Single column on mobile, introduce asymmetry on tablet/desktop
- Use `clamp()` for fluid typography
- Test on multiple screen sizes

### 3. Accessibility
- Maintain 4.5:1 contrast ratio
- Semantic HTML structure
- Keyboard navigation support
- Screen reader compatibility

### 4. Performance
- Optimize images with Next.js Image component
- Use efficient animations
- Implement lazy loading where appropriate

## Expected Outcome
A visually stunning, fully functional salon landing page that:
- Captures the vibrant, nostalgic energy of the 1970s
- Provides excellent user experience with clear navigation
- Converts visitors into booking appointments
- Performs well across all devices
- Meets SEO best practices

## Code Quality Requirements
- TypeScript for type safety
- Clean, readable code with comments
- Consistent naming conventions
- Proper error handling
- Follow existing project patterns from other demo pages

This prompt provides all the necessary specifications to create an outstanding 70s retro salon landing page that will showcase the capabilities of your development expertise.