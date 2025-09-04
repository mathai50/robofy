# Robofy Design System

A comprehensive design system for the Robofy application, providing consistent and reusable UI components.

## Installation

All components are available through the main export:

```typescript
import { Button, Input, Card, Alert, Select, Dialog, Spinner, Tabs, Badge } from '@/components/ui';
```

## Components

### Button

A versatile button component with multiple variants and sizes.

```typescript
import { Button } from '@/components/ui';

// Usage
<Button variant="primary" size="md" onClick={() => console.log('Clicked')}>
  Click me
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost' (default: 'primary')
- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- All standard button attributes supported

### Input

A form input field with label and error support.

```typescript
import { Input } from '@/components/ui';

// Usage
<Input
  label="Email Address"
  type="email"
  placeholder="Enter your email"
  error={errors.email}
/>
```

**Props:**
- `label`: string (optional)
- `error`: string (optional)
- All standard input attributes supported

### Card

A container component for grouping related content.

```typescript
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui';

// Usage
<Card>
  <CardHeader>
    <h3>Card Title</h3>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Alert

A notification component for displaying messages.

```typescript
import { Alert } from '@/components/ui';

// Usage
<Alert variant="success" title="Success">
  Your action was completed successfully.
</Alert>
```

**Props:**
- `variant`: 'default' | 'destructive' | 'success' (default: 'default')
- `title`: string (optional)

### Select

A dropdown select component.

```typescript
import { Select } from '@/components/ui';

// Usage
<Select
  label="Industry"
  options={[
    { value: 'beauty', label: 'Beauty' },
    { value: 'healthcare', label: 'Healthcare' }
  ]}
  error={errors.industry}
/>
```

**Props:**
- `label`: string (optional)
- `options`: Array<{ value: string; label: string }>
- `error`: string (optional)

### Dialog

A modal dialog component.

```typescript
import { Dialog } from '@/components/ui';

// Usage
<Dialog
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Dialog Title"
>
  <p>Dialog content goes here</p>
</Dialog>
```

**Props:**
- `isOpen`: boolean
- `onClose`: () => void
- `title`: string

### Spinner

A loading spinner component.

```typescript
import { Spinner } from '@/components/ui';

// Usage
<Spinner size="md" />
```

**Props:**
- `size`: 'sm' | 'md' | 'lg' (default: 'md')

### Tabs

A tabbed interface component.

```typescript
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui';

// Usage
<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content for tab 1</TabsContent>
  <TabsContent value="tab2">Content for tab 2</TabsContent>
</Tabs>
```

### Badge

A small status indicator component.

```typescript
import { Badge } from '@/components/ui';

// Usage
<Badge variant="success">Active</Badge>
```

**Props:**
- `variant`: 'default' | 'secondary' | 'destructive' | 'outline' (default: 'default')

## Styling

All components use Tailwind CSS for styling and follow the Robofy design guidelines:

- **Primary Color**: Blue (#2563eb)
- **Secondary Color**: Gray (#6b7280)
- **Success Color**: Green (#059669)
- **Error Color**: Red (#dc2626)
- **Border Radius**: 0.375rem (6px)
- **Font Family**: System UI

## Usage Guidelines

1. **Consistency**: Use the same component variants throughout the application
2. **Accessibility**: All components include proper ARIA attributes
3. **Responsive**: Components are designed to work on all screen sizes
4. **Performance**: Components are optimized with React.memo where appropriate

## Theme Customization

To customize the theme, modify the Tailwind configuration in `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#your-color',
          600: '#your-dark-color',
        }
      }
    }
  }
}
```

## Additional Component Libraries

### ⚠️ Security Notice: Aceternity UI Alternative
**Aceternity UI has known security vulnerabilities** (lodash.template command injection). Use these secure alternatives instead:

### Framer Motion (Recommended Alternative)
For animations and interactive components:
```bash
npm install framer-motion
```
Usage: Create smooth animations safely
```typescript
import { motion } from 'framer-motion';

export function AnimatedComponent() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      Your content
    </motion.div>
  );
}
```

### Magic UI
For magical effects and animations (check for security updates):
```bash
npm install magic-ui
```
Usage: Import magic effects and components
```typescript
import { MagicButton, SparkleText } from 'magic-ui';
```

### ReactBits
For utility components and hooks:
```bash
npm install react-bits
```
Usage: Import utilities and components
```typescript
import { useDebounce, Tooltip } from 'react-bits';
```

### Tailark
For Tailwind-based components:
```bash
npm install tailark
```
Usage: Import Tailwind components
```typescript
import { GradientButton, GlassCard } from 'tailark';
```

## Secure Integration Example

Combine secure libraries with shadcn/ui:

```typescript
import { Button } from '@/components/ui/button';
import { MagicButton } from 'magic-ui';
import { motion } from 'framer-motion';

export function EnhancedComponent() {
  return (
    <motion.div
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <MagicButton>
        <Button variant="outline">Secure Animation</Button>
      </MagicButton>
    </motion.div>
  );
}
```

## Security Best Practices

1. **Regularly audit dependencies**: Run `npm audit` frequently
2. **Use security-focused alternatives**: Prefer Framer Motion over vulnerable animation libraries
3. **Keep dependencies updated**: Use `npm update` regularly
4. **Check for security patches**: Monitor GitHub security advisories

## Contributing

When adding new components:

1. Follow the existing patterns and prop interfaces
2. Include proper TypeScript types
3. Add JSDoc comments for documentation
4. Export from `src/components/ui/index.ts`
5. Update this documentation file