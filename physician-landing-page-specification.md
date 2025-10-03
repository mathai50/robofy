# Physician Landing Page Specification for Coding Expert

## Project Overview
Create a modern, professional physician landing page demo following Robofy's organic design principles. The page should demonstrate compassionate medical care with a focus on patient-centered services.

## Design Requirements

### Color Palette (Physician-Specific)
- **Primary Color**: Deep Teal `#008080` (for main branding and CTAs)
- **Secondary Color**: Soft White `#FFFFFF` (for backgrounds)
- **Accent Colors**: 
  - Trust Blue `#2563EB` (for interactive elements)
  - Calm Green `#10B981` (for positive elements)
  - Warm Gray `#6B7280` (for secondary text)
- **Text Colors**: 
  - Primary: Charcoal `#1F2937` 
  - Secondary: Medium Gray `#4B5563`

### Typography
- **Hero Headings**: Playfair Display (Bold 700) - `font-family: 'Playfair Display', serif;`
- **Body Text**: Inter (Regular 400, Medium 500)
- **Font Sizes**: Fluid scaling using `clamp()` functions
  - Hero: `clamp(2.5rem, 5vw, 4rem)`
  - Section Headings: `clamp(2rem, 4vw, 3rem)`
  - Body: `clamp(1rem, 2vw, 1.125rem)`

### Design Principles
- **Organic Layout**: Asymmetrical grid compositions (no rigid symmetrical layouts)
- **No Gradients**: Solid colors only as per design guide
- **Minimal Blur Effects**: Avoid blur effects unless specifically requested
- **High Contrast**: Maintain 4.5:1 contrast ratio for accessibility
- **Self-Contained**: Page must be independent with its own layout and components

## Content Structure

### Physician Business Data
```typescript
const physicianPractice = {
  name: 'Compassionate Care Medical Group',
  phone: '(555) 123-HEAL',
  email: 'info@compassionatecare.com',
  address: '123 Wellness Avenue, Health City, HC 12345',
  heroImage: 'https://images.unsplash.com/photo-1581056771107-24ca5f033842?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  heroSlogan: 'Compassionate Care from Trusted Physicians',
  description: 'General Medicine, Chronic Disease Management, Preventive Care & Urgent Appointments with a patient-focused approach.'
};
```

### Physician Services (Organic Grid Layout)
```typescript
const medicalServices = [
  {
    title: 'General Medicine',
    description: 'Comprehensive primary care for patients of all ages, including routine check-ups and preventive screenings.',
    icon: '🩺'
  },
  {
    title: 'Chronic Disease Management',
    description: 'Expert care for diabetes, hypertension, asthma, and other chronic conditions with personalized treatment plans.',
    icon: '💊'
  },
  {
    title: 'Preventive Care',
    description: 'Health screenings, immunizations, and wellness counseling to maintain optimal health and prevent illness.',
    icon: '🛡️'
  },
  {
    title: 'Pediatric Care',
    description: 'Gentle, comprehensive medical care for children from infancy through adolescence.',
    icon: '👶'
  },
  {
    title: "Women's Health",
    description: 'Specialized care including annual exams, reproductive health, and menopause management.',
    icon: '🌸'
  },
  {
    title: 'Telemedicine',
    description: 'Virtual consultations for convenient access to medical care from the comfort of your home.',
    icon: '📱'
  }
];
```

### Physician Team
```typescript
const physicians = [
  {
    name: 'Dr. Ethan Caldwell, MD',
    specialty: 'Internal Medicine Specialist',
    bio: 'Board-certified internist with 15 years of experience in comprehensive adult medicine and chronic disease management.',
    credentials: 'MD, FACP, Board Certified Internal Medicine',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Dr. Sophia Rodriguez, MD',
    specialty: 'Family Medicine & Pediatrics',
    bio: 'Dual-certified in family medicine and pediatrics, providing comprehensive care for patients of all ages.',
    credentials: 'MD, FAAFP, Board Certified Family Medicine',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Dr. Benjamin Carter, DO',
    specialty: 'Osteopathic Medicine & Preventive Care',
    bio: 'Osteopathic physician specializing in holistic approaches to health and preventive medicine strategies.',
    credentials: 'DO, MPH, Board Certified Preventive Medicine',
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  }
];
```

### Health Concerns Addressed
```typescript
const healthConcerns = [
  'Cold & Flu Symptoms',
  'Hypertension Management',
  'Diabetes Care & Education',
  'Allergy & Asthma Treatment',
  'Preventive Health Screenings',
  'Vaccinations & Immunizations',
  'Wellness & Lifestyle Counseling',
  'Minor Injuries & Urgent Care'
];
```

## Page Sections (Required)

### 1. Hero Section
- Full-screen hero with provided medical image
- Playfair Display font for hero text
- Strong CTA: "Schedule an Appointment"
- Secondary CTA: "Meet Our Physicians"
- Organic overlay with teal accent

### 2. Physician Profile Section
- Featured physician introduction
- Credentials and philosophy of care
- Asymmetrical layout with image offset

### 3. Services Overview (Organic Grid)
- 6 services in asymmetrical grid layout
- Varying column spans (7/5, 6/6, 4/8 patterns)
- Subtle hover animations and rotations
- Medical icons for visual enhancement

### 4. Health Concerns Section
- Bulleted list of common conditions
- Checkmark icons with teal accents
- Two-column responsive layout

### 5. Physician Team
- 3-physician card layout
- Professional headshots
- Credentials and specialties
- Hover elevation effects

### 6. Patient Testimonials
- Carousel or rotating testimonials
- 5-star rating display
- Patient success stories

### 7. Appointment Booking Form
- Comprehensive contact form
- Service selection dropdown
- Date/time preference fields
- HIPAA-compliant styling considerations

### 8. Contact & Location
- Practice information
- Business hours
- Map integration placeholder
- Social media links

## Technical Requirements

### File Structure
```
src/app/demo/physician/
├── page.tsx (main component)
├── layout.tsx (optional, if needed)
└── components/ (page-specific components if necessary)
```

### Required Imports
- Framer Motion for animations
- Next.js Image component
- Shadcn UI components (Button, Card, Carousel, Input, etc.)
- Custom organic animations following existing patterns

### Animation Patterns
Use existing animation variants from other demo pages:
- `staggerContainer`
- `fadeInUp` 
- `fadeInLeft`
- `fadeInRight`
- Hover effects with `whileHover`

### Responsive Design
- Mobile-first approach
- Organic grid adaptation for mobile
- Touch-friendly interface elements
- Accessible navigation

## SEO & Accessibility

### Structured Data
```json
{
  "@context": "https://schema.org",
  "@type": "MedicalOrganization",
  "name": "Compassionate Care Medical Group",
  "medicalSpecialty": ["Primary Care", "Internal Medicine", "Family Medicine"],
  "serviceType": ["General Medicine", "Chronic Disease Management", "Preventive Care"]
}
```

### Accessibility Features
- ARIA labels for all interactive elements
- Keyboard navigation support
- Screen reader compatibility
- High contrast color ratios
- Focus indicators

## Integration Requirements

### Navigation Update
Add to [`src/components/ui/NavBar.tsx`](src/components/ui/NavBar.tsx:40) demo dropdown:
```typescript
{ label: 'Physician Demo', href: '/demo/physician' }
```

### File Location
Create page at: [`src/app/demo/physician/page.tsx`](src/app/demo/physician/page.tsx:1)

## Quality Assurance Checklist

- [ ] Organic asymmetrical layout implemented
- [ ] Playfair Display font used for hero text
- [ ] Teal color palette (#008080) applied correctly
- [ ] No gradients or blur effects used
- [ ] High contrast maintained (4.5:1 ratio)
- [ ] All animations smooth and performant
- [ ] Mobile-responsive design
- [ ] SEO structured data included
- [ ] Navigation link added to demo menu
- [ ] Page loads without errors
- [ ] All images optimized with Next.js Image

## Inspiration References
- Dental demo: [`src/app/demo/dental/page.tsx`](src/app/demo/dental/page.tsx:1)
- Gym demo: [`src/app/demo/gym/page.tsx`](src/app/demo/gym/page.tsx:1) 
- Yoga studio demo: [`src/app/demo/yoga-studio/page.tsx`](src/app/demo/yoga-studio/page.tsx:1)
- Organic design guide: [`docs/robofy-organic-design-guide.md`](docs/robofy-organic-design-guide.md:1)

## Implementation Timeline
1. Set up page structure and basic layout
2. Implement hero section with organic design
3. Build services grid with asymmetrical layout
4. Add physician team section
5. Implement appointment booking form
6. Add testimonials and contact sections
7. Apply animations and polish
8. Test responsiveness and accessibility
9. Update navigation and deploy

This specification provides complete clarity for implementation while maintaining Robofy's organic design principles and creating a unique, professional physician landing page.