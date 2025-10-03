# Developer Prompt: Create 70s Retro Salon with Organic Design

## Critical Design Principle
**Build a FLUID, NON-SECTIONAL layout** that follows the Robofy Organic Design Guide. The entire page must flow as one continuous experience without clear section boundaries or background color changes.

## Core Requirements

### ❌ What to AVOID (Traditional Approach)
- Clear section boundaries with background colors
- Symmetrical grid layouts  
- Isolated component sections
- Predictable spacing
- Section-based animations

### ✅ What to IMPLEMENT (Organic Approach)
- Fluid, continuous layout throughout
- Asymmetrical, overlapping elements
- Component fusion - blend services, features, testimonials together
- Varied, organic spacing (no uniform padding)
- Staggered, flowing animations
- 70s colors used ONLY as accents (no more than 10% of visual composition)

## Technical Implementation

### Color System (Accents Only on White Background)
```css
/* Define in component - white background throughout */
--text-primary: #1a1a1a;           /* Black text on white */
--background: #ffffff;             /* White background */
--accent-1: #D96C3A;              /* Burnt Orange - Primary CTAs only */
--accent-2: #89A36F;               /* Avocado Green - Secondary elements */
--accent-3: #E2B857;               /* Mustard Yellow - Highlights */
--neutral: #6E4B2A;                /* Cocoa Brown - Subtle borders */
```

### Organic Layout Structure
The entire page flows as one continuous experience:

```
[Minimal Header]
[Large Hero Headline - offset left, no clear hero section]
[Subheadline - organic spacing below]
[Service Card 1 - placed asymmetrically top left]
[Service Card 2 - offset right, higher position]
[Feature Description - flows between service cards]
[Service Card 3 - lower, overlaps next content]
[Testimonial - appears naturally, not in a "testimonials section"]
[Booking Form - integrated into flow, not isolated]
[More Services - staggered placement]
[Contact Info - flows from previous content]
[Map - integrated without section break]
[Footer - minimal, blends with content]
```

### Key Implementation Details

#### 1. Hero Area (No Clear Section)
- Large headline positioned asymmetrically (top-left offset)
- Subheadline flows naturally below with varied spacing
- CTA buttons placed at varying heights
- **No hero cards or clear section dividers**
- **No background image overlays that create sections**

#### 2. Component Fusion
- Service cards, features, testimonials blend together
- No background color changes between content types
- Components placed at varied heights and positions
- Use overlapping elements to break grid constraints

#### 3. Spacing & Rhythm
- Vary vertical spacing organically: `py-12`, `py-16`, `py-20`, `py-24`
- Use negative margins and overlapping for organic flow
- No uniform padding between "sections" because there are no sections

### Animation Approach
```typescript
// Staggered, flowing animations - no section-based animations
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

## Content Flow Specification

### Data Structure (Same Content, Different Placement)
```typescript
const salonServices = [
  { title: 'Haircuts', description: 'Expert cuts...', duration: '45-60 min' },
  { title: 'Hair Coloring', description: 'Balayage...', duration: '2-3 hours' },
  // ... more services
];

const whyChooseUs = [
  { title: 'Experienced Stylists', description: 'Our team...' },
  // ... more features
];

const testimonials = [
  { name: 'Jessica Taylor', content: 'Best color service...', rating: 5 },
  // ... more testimonials
];
```

### Placement Strategy
- **Services**: Place cards at varying positions (some left, some right, different heights)
- **Features**: Interweave between service cards as descriptive text blocks
- **Testimonials**: Appear organically between other content, not grouped together
- **Booking Form**: Integrated into the flow, not in a separate "booking section"
- **Contact**: Flows naturally from previous content, no clear "contact section"

## File Location
Create at: `src/app/demo/salon-organic/page.tsx` (new file to avoid conflicts)

## Success Criteria

### Organic Design Compliance
- ✅ **No clear section boundaries** in final implementation
- ✅ **Components blend seamlessly** throughout the layout  
- ✅ **70s colors used sparingly** as accents only (buttons, highlights, borders)
- ✅ **Asymmetrical balance** creates visual interest
- ✅ **Natural flow** between all content elements
- ✅ **White background** throughout with black text for maximum readability

### Technical Requirements
- Self-contained page with direct component imports
- Framer Motion for organic animations
- Mobile-first responsive design
- SEO-optimized structured data
- Accessibility compliance (4.5:1 contrast ratio)

## Implementation Notes

### Critical Reminders
1. **NO background color changes** between content areas
2. **NO clear section dividers** or boundaries
3. **NO symmetrical grid layouts** - use asymmetrical placement
4. **NO isolated component groups** - blend everything together
5. **USE 70s colors only for accents** - buttons, highlights, borders

### Layout Inspiration
Draw inspiration from the asymmetrical examples in the Robofy Organic Design Guide, but create a completely unique composition that feels natural and unforced.

This prompt ensures we create a truly organic salon page that follows the Robofy design principles while incorporating the 70s aesthetic through subtle, strategic color accents on a clean white background.