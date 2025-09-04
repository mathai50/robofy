# Robofy UX Style Guide & Component Library

## Overview
Comprehensive design system for the redesigned Robofy website, featuring AI-powered business automation with modern dark gradients and neon accents.

## Color Palette

### Primary Colors
- **Deep Blue**: `#1e40af` (RGB: 30, 64, 175)
- **Royal Purple**: `#7e22ce` (RGB: 126, 34, 206)
- **Electric Pink**: `#ec4899` (RGB: 236, 72, 153)

### Gradient Backgrounds
```css
/* Hero Section Gradient */
background: linear-gradient(135deg, #0f172a 0%, #1e40af 50%, #7e22ce 100%);

/* Section Gradient */
background: linear-gradient(135deg, #111827 0%, #1e40af 30%, #7e22ce 70%);

/* Card Gradient */
background: linear-gradient(135deg, rgba(30, 64, 175, 0.1) 0%, rgba(126, 34, 206, 0.1) 100%);
```

### Neon Accent Colors
- **Blue Neon**: `#3b82f6` (RGB: 59, 130, 246)
- **Purple Neon**: `#a855f7` (RGB: 59, 130, 246)
- **Green Neon**: `#10b981` (RGB: 16, 185, 129)
- **Pink Neon**: `#ec4899` (RGB: 236, 72, 153)
- **Cyan Neon**: `#06b6d4` (RGB: 6, 182, 212)

## Typography

### Font Families
- **Headings**: Roboto (Bold 700-900 weights)
- **Body Text**: Alegreya (Regular 400, Medium 500 weights)
- **Monospace**: JetBrains Mono (for code snippets)

### Font Sizes
```css
/* Hero Headings */
text-5xl sm:text-6xl lg:text-7xl font-extrabold

/* Section Headings */
text-3xl sm:text-4xl lg:text-5xl font-bold

/* Subheadings */
text-xl sm:text-2xl lg:text-3xl font-semibold

/* Body Text */
text-lg text-gray-300

/* Small Text */
text-sm text-gray-400
```

## Component Library

### Hero Section Components

#### Orbiting Animation System
```tsx
import { OrbitingCircles } from '@/components/magicui/orbiting-circles'
import { GoogleDriveIcon, NotionIcon, WhatsAppIcon, AIIcon } from '@/components/magicui/orbiting-icons'

<OrbitingCircles
  radius={150}
  duration={20}
  delay={0}
  iconSize={40}
  reverse={false}
>
  <div className="text-blue-400"><GoogleDriveIcon size={40} /></div>
  <div className="text-purple-400"><NotionIcon size={40} /></div>
  <div className="text-green-400"><WhatsAppIcon size={40} /></div>
  <div className="text-pink-400"><AIIcon size={40} /></div>
</OrbitingCircles>
```

#### Shimmer Button Component
```tsx
import { ShimmerButton } from '@/components/magicui/shimmer-button'

<ShimmerButton
  onClick={handleFormOpen}
  className="font-semibold text-lg px-8 py-4"
  background="linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899)"
  shimmerColor="#ffffff"
>
  Start Your Free Automation Audit
</ShimmerButton>
```

### Section Components

#### MagicBento Grid System
```tsx
import MagicBento from '@/components/MagicBento'

<MagicBento
  cards={sectors.map(sector => ({
    color: '#060010',
    title: sector.name,
    description: sector.description,
    label: sector.icon
  }))}
  enableStars={true}
  enableSpotlight={true}
  enableBorderGlow={true}
  enableTilt={true}
  clickEffect={true}
  enableMagnetism={true}
/>
```

#### Animated List Component
```tsx
import { AnimatedList } from '@/components/magicui/animated-list'

<AnimatedList delay={1000} className="mt-8">
  <div className="p-6 border border-blue-400/50 rounded-xl bg-blue-500/20 backdrop-blur-sm shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300">
    <h3 className="text-xl font-semibold text-white mb-2">New Feature</h3>
    <p className="text-blue-100">Description text</p>
  </div>
</AnimatedList>
```

### Navigation & Interaction

#### Dock Navigation
```tsx
import { Dock, DockIcon } from '@/components/magicui/dock'
import { Share2, Bot, Mail, Linkedin, Twitter, Instagram } from 'lucide-react'

<Dock direction="middle" iconSize={60} iconMagnification={100} iconDistance={140}>
  <DockIcon>
    <div className="text-blue-400 hover:text-blue-300 transition-all duration-300">
      <Share2 size={28} />
    </div>
  </DockIcon>
  {/* Additional icons... */}
</Dock>
```

#### Marquee Component
```tsx
import { Marquee } from '@/components/ui/Marquee'

<Marquee speed={40} pauseOnHover={true} className="py-6">
  <div className="flex items-center justify-center mx-8 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-blue-400/20">
    <span className="text-2xl">🏢</span>
    <span className="ml-2 text-white font-semibold">Enterprise Clients</span>
  </div>
</Marquee>
```

## Layout Guidelines

### Section Spacing
```css
/* Standard section padding */
py-20 px-4 sm:px-6 lg:px-8

/* Container max width */
max-w-7xl mx-auto

/* Grid layouts */
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8
```

### Card Design Patterns
```css
/* Standard card */
bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-gray-700

/* Hover effects */
hover:border-blue-400 transition-all duration-300 hover:scale-105

/* Gradient borders */
border border-blue-400/30 hover:border-blue-400/60
```

## Responsive Design

### Breakpoints
- **Mobile**: < 640px (sm:)
- **Tablet**: 640px - 1023px (md:)
- **Desktop**: 1024px+ (lg:)

### Mobile-First Patterns
```tsx
{/* Grid responsive pattern */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

{/* Text responsive pattern */}
<h1 className="text-5xl sm:text-6xl lg:text-7xl">

{/* Padding responsive pattern */}
<div className="px-4 sm:px-6 lg:px-8">
```

## Animation & Micro-interactions

### Hover Effects
```css
/* Standard hover */
transition-all duration-300 hover:scale-105

/* Border glow */
hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-500/20

/* Background transitions */
hover:bg-blue-500/30
```

### Entrance Animations
```css
/* Fade in */
opacity-0 animate-fade-in

/* Slide up */
transform translate-y-4 animate-slide-up

/* Staggered children */
[&>*]:animate-stagger
```

## Performance Optimization

### Image Optimization
- WebP format with fallbacks
- Lazy loading with blur placeholders
- Responsive srcset attributes

### Animation Performance
- GPU-accelerated transforms
- Will-change properties
- Reduced motion support

### Bundle Optimization
- Tree shaking enabled
- Code splitting implemented
- Component lazy loading

## Accessibility Guidelines

### Color Contrast
- Minimum 4.5:1 contrast ratio
- AAA compliance for text elements
- High contrast mode support

### Keyboard Navigation
- Full tab index support
- Focus visible indicators
- Skip navigation links

### Screen Reader Support
- ARIA labels on interactive elements
- Semantic HTML structure
- Live region announcements

## Implementation Examples

### Service Tab Interface
```tsx
{/* Tabbed Service Interface */}
<div className="bg-white/5 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
  <div className="flex flex-wrap gap-2 mb-8">
    <button className="px-6 py-3 bg-blue-500/20 border border-blue-400/50 rounded-lg text-blue-400 font-semibold hover:bg-blue-500/30 transition-all duration-300">
      AI Marketing Automation
    </button>
    {/* Additional tabs... */}
  </div>
  
  {/* Tab content... */}
</div>
```

### Stats Display Component
```tsx
{/* Stats grid */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto py-8">
  <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-blue-400/30 hover:border-blue-400/60 transition-all duration-300">
    <div className="text-3xl font-bold text-blue-400 mb-2">500+</div>
    <div className="text-sm text-gray-300">Happy Clients</div>
  </div>
  {/* Additional stats... */}
</div>
```

## Browser Support

### Supported Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Fallback Strategies
- CSS custom properties fallbacks
- Feature detection with @supports
- Progressive enhancement approach

## Maintenance Guidelines

### Component Updates
- Follow semantic versioning
- Maintain backward compatibility
- Document breaking changes

### Design Token Updates
- Update tokens in tailwind.config.js
- Regenerate design system documentation
- Test across all components

### Performance Monitoring
- Regular Lighthouse audits
- Bundle size tracking
- Core Web Vitals monitoring