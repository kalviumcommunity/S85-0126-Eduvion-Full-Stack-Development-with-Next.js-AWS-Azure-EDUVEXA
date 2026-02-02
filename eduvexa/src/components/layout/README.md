# Professional SaaS Layout System

A clean, scalable dashboard layout used by professional SaaS products.

## Layout Structure

```
┌────────────────────────────────────────┐
│               TOP NAVBAR                │
├─────────────┬──────────────────────────┤
│             │                          │
│   SIDEBAR   │      MAIN CONTENT        │
│             │                          │
│             │   Page content changes   │
│             │                          │
└─────────────┴──────────────────────────┘
```

## Components

### 1. SaaSLayout
The main layout component that orchestrates the entire structure.

**Features:**
- Sticky top navbar with hide/show on scroll
- Fixed sidebar (220px expanded, 64px collapsed)
- Responsive design with mobile sidebar collapse
- Professional SaaS styling

**Props:**
```tsx
interface SaaSLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}
```

### 2. ProfessionalSidebar
Enhanced sidebar with professional navigation items.

**Features:**
- Icons + labels
- Active item highlighting with indicator bar
- Badge support for notifications
- Collapsible on mobile
- Logout functionality

**Props:**
```tsx
interface ProfessionalSidebarProps {
  isCollapsed?: boolean;
}
```

### 3. MainContent
Wrapper for main content area with consistent styling.

**Features:**
- Max-width control (up to 1280px)
- Horizontal centering
- Consistent padding
- Theme-aware styling

**Props:**
```tsx
interface MainContentProps {
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'sm' | 'md' | 'lg';
  className?: string;
}
```

## Usage Examples

### Basic Usage
```tsx
import SaaSLayout from '@/components/layout/SaaSLayout';
import ProfessionalSidebar from '@/components/layout/ProfessionalSidebar';

export default function DashboardPage() {
  return (
    <SaaSLayout sidebar={<ProfessionalSidebar />}>
      <div>
        <h1>Dashboard</h1>
        <p>Your content here</p>
      </div>
    </SaaSLayout>
  );
}
```

### With MainContent Wrapper
```tsx
import SaaSLayout from '@/components/layout/SaaSLayout';
import ProfessionalSidebar from '@/components/layout/ProfessionalSidebar';
import MainContent from '@/components/layout/MainContent';

export default function AnalyticsPage() {
  return (
    <SaaSLayout sidebar={<ProfessionalSidebar />}>
      <MainContent maxWidth="xl">
        <h1>Analytics</h1>
        <p>Centered content with max-width</p>
      </MainContent>
    </SaaSLayout>
  );
}
```

## Layout Rules

### ✅ DO:
- Use flexbox for layout structure
- Keep sidebar width fixed (220px expanded, 64px collapsed)
- Center main content horizontally
- Use consistent padding throughout
- Maintain professional SaaS styling

### ❌ DON'T:
- Use margin-left hacks for layout
- Hardcode responsive breakpoints
- Mix different layout systems
- Override core layout classes

## Styling Guidelines

### Colors
- Primary: Blue gradient (#3B82F6 to #8B5CF6)
- Surface: White/Light Gray (light), Dark Gray (dark)
- Text: Gray-900 (light), Gray-100 (dark)

### Shadows
- Soft: `0 1px 2px 0 rgb(0 0 0 / 0.05)`
- Medium: `0 4px 6px -1px rgb(0 0 0 / 0.1)`

### Border Radius
- Small: `0.375rem` (6px)
- Medium: `0.5rem` (8px)
- Large: `0.75rem` (12px)
- XL: `1rem` (16px)

## Responsive Behavior

### Desktop (md+)
- Sidebar always visible
- Full navbar with search
- Hover states and transitions

### Mobile (sm)
- Sidebar hidden behind hamburger menu
- Compact navbar
- Touch-friendly interactions

## Customization

### Adding New Navigation Items
```tsx
const navItems: NavItem[] = [
  // ... existing items
  {
    id: 'new-item',
    label: 'New Item',
    icon: <NewIcon className="w-5 h-5" />,
    href: '/new-item',
    badge: 5 // optional
  }
];
```

### Custom Main Content Width
```tsx
<MainContent maxWidth="lg" padding="md">
  {/* Content */}
</MainContent>
```

### Theme Customization
The layout automatically adapts to your theme context. Ensure you have:
- `useTheme` hook from `@/contexts/ThemeContext`
- Theme provider in your app root

## Dependencies

- React 18+
- Next.js 13+ (App Router)
- Tailwind CSS
- Lucide React (icons)
- Theme context
- Auth context (for user state)

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- Uses CSS transforms for smooth animations
- Lazy loading for dropdown content
- Optimized re-renders with proper state management
- Minimal bundle impact
