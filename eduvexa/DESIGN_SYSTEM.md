# EDUVEXA Student Tracking Dashboard - Design System

## 🎨 Design Philosophy

A modern, clean, and highly professional SaaS interface focused on clarity, usability, and consistency. The design emphasizes minimal aesthetics with plenty of white space, subtle interactions, and enterprise-grade polish.

---

## 🎯 Color Palette

### Primary Colors - Professional Blue
```css
--primary-50:  #f0f9ff   /* Lightest blue for backgrounds */
--primary-100: #e0f2fe   /* Hover states */
--primary-200: #bae6fd   /* Active states */
--primary-300: #7dd3fc   /* Accent elements */
--primary-400: #38bdf8   /* Links, highlights */
--primary-500: #0ea5e9   /* Main primary color */
--primary-600: #0284c7   /* Primary buttons */
--primary-700: #0369a1   /* Primary hover */
--primary-800: #075985   /* Dark mode primary */
--primary-900: #0c4a6e   /* Dark mode primary hover */
```

### Neutral Colors - Clean Grays
```css
--neutral-50:  #fafafa   /* Page background */
--neutral-100: #f5f5f5   /* Card backgrounds */
--neutral-200: #e5e5e5   /* Borders */
--neutral-300: #d4d4d4   /* Dividers */
--neutral-400: #a3a3a3   /* Disabled text */
--neutral-500: #737373   /* Secondary text */
--neutral-600: #525252   /* Primary text */
--neutral-700: #404040   /* Headings */
--neutral-800: #262626   /* Dark text */
--neutral-900: #171717   /* Dark headings */
```

### Surface Colors
```css
--surface-0:   #ffffff   /* Main backgrounds */
--surface-50:  #fafafa   /* Card backgrounds */
--surface-100: #f5f5f5   /* Hover states */
--surface-200: #e5e5e5   /* Borders */
--surface-300: #d4d4d4   /* Dividers */
```

### Semantic Colors
```css
/* Success - Green */
--success-500: #22c55e   /* Success states */
--success-600: #16a34a   /* Success buttons */

/* Warning - Amber */
--warning-500: #f59e0b   /* Warning states */
--warning-600: #d97706   /* Warning buttons */

/* Error - Red */
--error-500: #ef4444    /* Error states */
--error-600: #dc2626    /* Error buttons */
```

---

## 📝 Typography

### Font Families
```css
--font-sans: 'Inter', system-ui, sans-serif;
--font-display: 'Inter Tight', 'Inter', system-ui, sans-serif;
```

### Font Size Scale
```css
--text-xs:    0.75rem   /* 12px - Captions */
--text-sm:    0.875rem  /* 14px - Body text */
--text-base:  1rem      /* 16px - Default */
--text-lg:    1.125rem  /* 18px - Large body */
--text-xl:    1.25rem   /* 20px - Small headings */
--text-2xl:   1.5rem    /* 24px - Medium headings */
--text-3xl:   1.875rem  /* 30px - Large headings */
--text-4xl:   2.25rem   /* 36px - Page titles */
--text-5xl:   3rem      /* 48px - Hero titles */
```

### Line Heights
```css
--leading-tight:    1.25   /* Headings */
--leading-normal:   1.5    /* Body text */
--leading-relaxed:  1.75   /* Extended reading */
```

### Font Weights
```css
--font-light:     300   /* Light text */
--font-normal:     400   /* Regular text */
--font-medium:     500   /* Medium emphasis */
--font-semibold:   600   /* Semibold */
--font-bold:       700   /* Bold */
--font-extrabold:  800   /* Extra bold */
```

---

## 📏 Spacing Scale

Based on 4px grid system for consistency:

```css
--space-0:  0        /* No spacing */
--space-1:  0.25rem   /* 4px */
--space-2:  0.5rem    /* 8px */
--space-3:  0.75rem   /* 12px */
--space-4:  1rem      /* 16px */
--space-5:  1.25rem   /* 20px */
--space-6:  1.5rem    /* 24px */
--space-8:  2rem      /* 32px */
--space-10: 2.5rem    /* 40px */
--space-12: 3rem      /* 48px */
--space-16: 4rem      /* 64px */
--space-20: 5rem      /* 80px */
--space-24: 6rem      /* 96px */
--space-32: 8rem      /* 128px */
```

---

## 🎭 Border Radius

Consistent rounded corners for modern aesthetics:

```css
--radius-sm:   0.25rem   /* 4px - Small elements */
--radius-md:   0.375rem  /* 6px - Inputs */
--radius-lg:   0.5rem    /* 8px - Buttons */
--radius-xl:   0.75rem   /* 12px - Cards */
--radius-2xl:  1rem      /* 16px - Large cards */
--radius-3xl:  1.5rem    /* 24px - Hero elements */
--radius-full: 9999px    /* Pills, avatars */
```

---

## 🌟 Shadows

Subtle shadows for depth and hierarchy:

```css
--shadow-sm:  0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md:  0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg:  0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl:  0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
--shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
```

---

## ⚡ Transitions

Consistent timing for smooth interactions:

```css
--transition-fast:   150ms ease;
--transition-normal: 250ms ease;
--transition-slow:   350ms ease;
```

---

## 🧩 Component Library

### Buttons
```tsx
// Primary Button
<button className="btn btn-primary">Submit</button>

// Secondary Button
<button className="btn btn-secondary">Cancel</button>

// Ghost Button
<button className="btn btn-ghost">Edit</button>

// Sizes
<button className="btn btn-primary btn-sm">Small</button>
<button className="btn btn-primary btn-lg">Large</button>
```

### Input Fields
```tsx
// Standard Input
<input className="input" placeholder="Enter text" />

// With Icon
<div className="relative">
  <Icon className="absolute left-3 text-neutral-400" />
  <input className="input pl-10" placeholder="Search" />
</div>
```

### Cards
```tsx
// Basic Card
<div className="card">
  <div className="card-header">
    <h3>Card Title</h3>
  </div>
  <div className="card-body">
    <p>Card content goes here.</p>
  </div>
</div>
```

### Tables
```tsx
<table className="table">
  <thead>
    <tr>
      <th>Name</th>
      <th>Status</th>
      <th>Progress</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>John Doe</td>
      <td><span className="badge badge-success">Active</span></td>
      <td><div className="progress"><div className="progress-bar" style={{width: '75%'}}></div></div></td>
    </tr>
  </tbody>
</table>
```

### Badges
```tsx
<span className="badge badge-primary">Primary</span>
<span className="badge badge-success">Success</span>
<span className="badge badge-warning">Warning</span>
<span className="badge badge-error">Error</span>
```

### Progress Bars
```tsx
<div className="progress">
  <div className="progress-bar" style={{width: '60%'}}></div>
</div>
```

---

## 📱 Layout Structure

### Grid System
```css
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

.grid {
  display: grid;
  gap: 1.5rem;
}

.grid-cols-1 { grid-template-columns: repeat(1, 1fr); }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
.grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
```

### Flexbox Utilities
```css
.flex { display: flex; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.gap-4 { gap: 1rem; }
```

---

## 🎯 Usage Guidelines

### 1. Color Usage
- **Primary Blue**: Main CTAs, links, important actions
- **Neutral Grays**: Text, borders, backgrounds
- **Success Green**: Positive feedback, completed states
- **Warning Amber**: Caution, pending states
- **Error Red**: Errors, destructive actions

### 2. Typography Hierarchy
- **Page Titles**: `text-4xl font-bold text-neutral-900`
- **Section Headers**: `text-2xl font-semibold text-neutral-800`
- **Card Titles**: `text-lg font-semibold text-neutral-700`
- **Body Text**: `text-sm text-neutral-600`
- **Captions**: `text-xs text-neutral-500`

### 3. Spacing Rules
- Use 4px grid system
- Maintain consistent padding/margins
- Cards: `p-6` padding
- Sections: `space-y-8` between sections
- Form elements: `space-y-4` between fields

### 4. Component Patterns
- **Cards**: Always use `bg-surface-0 border border-neutral-200 rounded-xl`
- **Buttons**: Always include hover states and transitions
- **Inputs**: Always include focus states with `focus:ring-2 focus:ring-primary-500`
- **Tables**: Always include hover states on rows

---

## 🚀 Implementation Notes

### Google Fonts
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Inter+Tight:wght@600;700;800&display=swap" rel="stylesheet">
```

### Tailwind Configuration
All colors, spacing, and utilities are pre-configured in `tailwind.config.js` for immediate use.

### Responsive Design
- Mobile-first approach
- Breakpoints: `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`
- Use responsive prefixes: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

---

## ✅ Accessibility

- **Contrast Ratios**: All text meets WCAG AA standards (4.5:1 minimum)
- **Focus States**: All interactive elements have visible focus indicators
- **Semantic HTML**: Use proper HTML5 elements for structure
- **ARIA Labels**: Add labels where needed for screen readers
- **Keyboard Navigation**: Ensure all functionality works with keyboard

---

This design system provides a solid foundation for building a professional, scalable, and accessible Student Tracking Dashboard that meets modern SaaS standards.
