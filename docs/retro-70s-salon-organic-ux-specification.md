# Retro 70s Salon - Organic UX Specification

## Core Design Principles (Following Robofy Organic Design Guide)

### Critical Principles Applied
- **Fluid, Non-Sectional Layouts**: No clear section boundaries or background color changes
- **Component Fusion**: Blend components organically throughout the layout, not in isolated sections
- **Asymmetrical Balance**: Create visual interest through uneven compositions
- **Subtle Color Usage**: Use 70s colors as accents only (no more than 10% of visual composition)
- **Organic Flow**: Create seamless, flowing experience that feels natural and unforced

## Design System

### Color Application (Following "Subtle Color Usage")
```css
/* 70s colors used as ACCENTS only on white/black background */
--text-primary: #1a1a1a;           /* Black for text on white */
--background: #ffffff;             /* White background */
--accent-1: #D96C3A;              /* Burnt Orange - Primary CTAs */
--accent-2: #89A36F;               /* Avocado Green - Secondary elements */
--accent-3: #E2B857;               /* Mustard Yellow - Highlights */
--neutral: #6E4B2A;                /* Cocoa Brown - Subtle borders */
```

### Typography (Organic Scaling)
- **Headings**: Playfair Display (Serif) - for elegant, retro feel
- **Body Text**: Montserrat (Sans-serif) - for readability
- **Fluid Typography**: 
  - h1: `clamp(2.5rem, 5vw, 4rem)`
  - h2: `clamp(2rem, 4vw, 3rem)`
  - Body: `clamp(1rem, 2vw, 1.125rem)`

## Organic Layout Structure

### Page Flow (Non-Sectional Approach)
The entire page flows as one continuous experience without clear section breaks. Components are placed organically with varied spacing and overlapping elements.

#### 1. Header & Navigation
- Minimal sticky header with salon name
- Navigation blends into the hero area
- No background color change from main content

#### 2. Hero Area (Asymmetrical, Overlapping)
**Layout**: No clear hero "section" - content flows naturally
- Large headline positioned asymmetrically (top-left offset)
- Subheadline flows naturally below with organic spacing
- CTA buttons placed at varying heights
- Background image blends into content without clear boundaries
- **No hero cards or clear section dividers**

#### 3. Content Flow (Component Fusion)
**Services, Features, Testimonials blend together:**
- Service cards placed at varying positions and heights
- Feature descriptions interwoven with service cards
- Testimonials appear organically between content
- Booking form appears as a natural part of the flow
- **No background color changes between "sections"**

#### 4. Contact Integration
- Contact information appears naturally in the content flow
- Map integrated without clear section boundaries
- **No contact "section" with different background**

## Component Placement Strategy

### Organic Grid Principles
- Avoid symmetrical, boxy layouts
- Use overlapping elements and varied spacing
- Create visual flow through asymmetrical balance
- Break out of traditional grid constraints

### Example Component Flow:
```
[Header - minimal]
[Large Hero Headline - offset left]
[Subheadline - organic spacing]
[Service Card 1 - top left]
[Service Card 2 - offset right, higher]
[Feature Description - flows between cards]
[Service Card 3 - lower, overlaps next content]
[Testimonial - appears naturally]
[Booking Form - integrated, not isolated]
[More Services - staggered placement]
[Contact Info - flows from previous content]
[Map - integrated without section break]
```

## Implementation Guidelines

### Color Application Rules
- Use white background throughout
- Apply 70s colors only to:
  - Primary buttons (burnt orange)
  - Secondary elements (avocado green)
  - Highlights and badges (mustard yellow)
  - Subtle borders (cocoa brown)
- **Never use background colors to define sections**

### Spacing & Rhythm
- Vary vertical spacing organically (1.5rem, 2rem, 3rem, etc.)
- Use overlapping elements to break grid constraints
- Create natural flow through varied component heights

### Animation Approach
- Staggered entrance animations create organic feel
- Hover effects use subtle scale and shadow
- No section-based animations

## Key Differences from Traditional Approach

### ❌ Traditional (What We Avoid)
- Clear section boundaries with background colors
- Symmetrical grid layouts
- Isolated component sections
- Predictable spacing
- Section-based animations

### ✅ Organic (What We Implement)
- Fluid, continuous layout
- Asymmetrical, overlapping elements
- Component fusion throughout
- Varied, organic spacing
- Staggered, flowing animations

## Success Metrics

### Organic Design Compliance
- **No clear section boundaries** in final implementation
- **Components blend seamlessly** throughout the layout
- **70s colors used sparingly** as accents only
- **Asymmetrical balance** creates visual interest
- **Natural flow** between all content elements

This specification ensures we create a truly organic salon page that follows the Robofy design principles while incorporating the 70s aesthetic through subtle, strategic color accents.