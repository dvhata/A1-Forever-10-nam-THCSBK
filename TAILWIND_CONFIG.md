# Tailwind Configuration - Orange Energy Reunion Theme

## Custom Color Palette

The project uses a custom "Orange Energy" color scheme defined in `globals.css`. These colors should be used throughout the application for consistency.

### Color Variables (CSS Custom Properties)

```css
/* Primary Colors */
--color-orange-primary: #FF6B00;      /* Vibrant Orange - Main accent */
--color-orange-dark: #E55A00;         /* Dark Orange - Hover states */
--color-orange-light: #FFB84D;        /* Light Orange - Light backgrounds */

/* Secondary Colors */
--color-navy-primary: #0A1F44;        /* Deep Navy - Text and headers */
--color-cream-white: #FFFBF5;         /* Cream White - Main background */
--color-cream-light: #FFF5EB;         /* Light Cream - Section backgrounds */

/* Border & Accents */
--color-beige-border: #E8DDD0;        /* Beige - Borders */
--color-beige-light: #F5EFE7;         /* Light Beige - Light backgrounds */
```

### Usage in Tailwind Classes

Since these are CSS variables, you can use them with inline styles:

```jsx
// Using with style prop
<div style={{ backgroundColor: COLORS.primary }}>
  Content
</div>

// Alternative: Add to tailwind.config.ts for direct class usage
// This would allow: className="bg-orange-primary"
```

## Typography System

### Font Families

Three custom Google Fonts are configured:

1. **Playfair Display** - Headers and titles
   - Usage: `className="font-playfair"`
   - Use for: Main headings, section titles, teacher names

2. **Montserrat** - Body text (default)
   - Usage: `className="font-montserrat"`
   - Use for: Paragraphs, form labels, body content

3. **Dancing Script** - Emotional quotes and teacher names
   - Usage: `className="font-dancing"`
   - Use for: Quotes, special messages, decorative text

### Typography Examples

```jsx
// Main heading
<h1 className="font-playfair text-5xl font-bold text-[#0A1F44]">
  Danh Sách Toàn Thành Viên
</h1>

// Teacher names with Dancing Script
<p className="font-dancing text-lg text-[#0A1F44]">
  Nguyễn Thị Bích Huệ
</p>

// Body text with Montserrat
<p className="font-montserrat text-base text-[#0A1F44]">
  Regular paragraph text...
</p>
```

## Color Application Guidelines

### Primary Button & Highlights
```jsx
// Use vibrant orange for primary actions
style={{ backgroundColor: COLORS.primary }} // #FF6B00
```

### Headers & Typography
```jsx
// Use deep navy for all text
className="text-[#0A1F44]"
```

### Section Backgrounds
```jsx
// Use cream white or light variants
className="bg-[#FFFBF5]"  // Cream white
className="bg-[#FFF5EB]"  // Light cream
```

### Borders & Dividers
```jsx
// Use beige tones for subtle borders
className="border-[#E8DDD0]"
```

### Chart Colors Array
```js
const CHART_COLORS = [
  '#FF6B00',  // Orange primary
  '#E55A00',  // Orange dark
  '#FFB84D',  // Orange light
  '#FF8A3D',
  '#FFB366',
  '#FFD9B3',
];
```

## Layout Grid System

The application uses Tailwind's 12-column grid for responsive layouts:

- **Mobile (default)**: 2-column grid
- **Tablet (sm:)**: 3-4 column grid
- **Desktop (lg:)**: 4-6 column grid

### Example: MemoryLane Gallery
```jsx
<div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
  {/* Items automatically span appropriate columns */}
</div>
```

## Component Styling Patterns

### Card Components
```jsx
<div className="bg-white p-6 rounded-lg shadow-lg border-t-4" 
     style={{ borderTopColor: COLORS.orange }}>
  {/* Card content */}
</div>
```

### Form Inputs
```jsx
<input
  className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2"
  style={{
    borderColor: COLORS.border,
    '--tw-ring-color': COLORS.primary,
  } as React.CSSProperties}
/>
```

### Section Dividers
```jsx
<div className="w-16 h-1 bg-[#FF6B00] mx-auto mb-12"></div>
```

## Responsive Design

All components follow mobile-first responsive design:

```jsx
// Typography scaling
className="text-4xl sm:text-5xl"  // Larger on desktop

// Grid layout
className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"

// Padding scaling
className="p-4 sm:p-6 lg:p-8"

// Spacing
className="gap-4 sm:gap-6 lg:gap-8"
```

## Soft Shadows

Shadow classes for depth:

```jsx
className="shadow-lg"        // Subtle shadow
className="shadow-2xl"       // Prominent shadow
className="hover:shadow-2xl" // Shadow on hover
```

## Border Radius

Consistent rounding throughout:

```jsx
className="rounded-lg"   // Standard cards
className="rounded-xl"   // Gallery items
className="rounded-full" // Badges
```

## Gradient Usage

Subtle gradients for backgrounds:

```jsx
// Orange gradient (buttons, accents)
className="bg-gradient-to-r from-[#FFB84D] to-[#FF8A3D]"

// Cream gradient (card backgrounds)
className="bg-gradient-to-br from-[#FFFBF5] to-[#FFF5EB]"
```

## Implementation Checklist

When styling new components, ensure:

- [ ] Using Playfair Display for headings
- [ ] Using Montserrat for body text
- [ ] Using Dancing Script for special text
- [ ] Orange (#FF6B00) for primary actions
- [ ] Navy (#0A1F44) for text
- [ ] Cream (#FFFBF5) for backgrounds
- [ ] Proper shadow/depth with shadow classes
- [ ] Responsive design with sm: and lg: prefixes
- [ ] Border dividers in beige (#E8DDD0)
- [ ] Consistent spacing with gap/padding scales
