This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Form Handling & Validation Implementation

This project demonstrates advanced form handling using React Hook Form and Zod validation with modern, accessible UI components.

### Key Technologies Used

- **React Hook Form**: Manages form state and validation with minimal re-renders
- **Zod**: Provides declarative schema validation with TypeScript support
- **@hookform/resolvers**: Seamlessly connects Zod to React Hook Form
- **Tailwind CSS**: For modern, responsive styling
- **React Hot Toast**: For elegant toast notifications
- **Custom Modal Component**: For blocking confirmations

### Features Implemented

#### 1. Enhanced Login Form (`/app/login/page.tsx`)
- React Hook Form integration with Zod validation
- Modern gradient background and card-based design
- User icon and loading states
- Accessibility-focused form inputs
- Real-time validation feedback
- **NEW**: Confirmation modal before login
- **NEW**: Toast notifications for success/error states
- **NEW**: Comprehensive validation (name, email, password)

#### 2. Comprehensive Signup Form (`/app/signup/page.tsx`)
- Multi-field validation (name, email, password)
- Enhanced visual design with icons
- Form validation with specific error messages
- Loading states and transitions
- Terms of Service and Privacy Policy links
- **NEW**: Confirmation modal before account creation
- **NEW**: Toast notifications for success/error states

#### 3. Reusable FormInput Component (`/components/ui/FormInput.tsx`)
- TypeScript-based prop interface
- Icon support for visual enhancement
- Error state handling with visual feedback
- Focus states and transitions
- Accessibility features (labels, ARIA attributes)
- **NEW**: Matches existing UI design system perfectly

#### 4. Toast Notifications (`/components/ui/ToastProvider.tsx`)
- Global toast provider with react-hot-toast
- Custom styling for success, error, and loading states
- Accessible with proper ARIA roles
- Auto-dismiss after specified duration
- **NEW**: Integrated with all form operations

#### 5. Accessible Modal Component (`/components/ui/Modal.tsx`)
- Full accessibility support with ARIA attributes
- Focus trapping and restoration
- Keyboard navigation (ESC to close)
- Backdrop click to close
- Multiple size variants (sm, md, lg, xl)
- **NEW**: Used for confirmation dialogs

#### 6. Loader/Spinner Component (`/components/ui/Loader.tsx`)
- Multiple size variants (sm, md, lg)
- Optional text labels
- Full-screen or inline modes
- Accessible with `aria-live="polite"`
- **NEW**: Consistent loading states across app

### Validation Schemas

#### Login Schema
```typescript
const loginSchema = z.object({
  userName: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name cannot exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces")
    .trim()
    .refine((val) => val.trim().length > 0, "Name cannot be empty or just whitespace"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .max(100, "Email cannot exceed 100 characters")
    .toLowerCase()
    .refine((val) => val.includes('.'), "Email must contain a domain"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(128, "Password cannot exceed 128 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number")
    .refine((val) => !val.includes(' '), "Password cannot contain spaces"),
});
```

#### Signup Schema
```typescript
const signupSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});
```

## Feedback UI Implementation

This project demonstrates comprehensive user feedback patterns following modern UX principles:

### Feedback Types Implemented

#### 1. Instant Feedback (Toast Notifications)
**Use Cases**: Form submission success, errors, cancellations
**Implementation**: React Hot Toast with custom styling
**Features**:
- Auto-dismiss after 3-5 seconds
- Color-coded (success=green, error=red, loading=blue)
- Accessible with `aria-live="polite"`
- Position: top-right corner

**Examples**:
```typescript
// Success toast
toast.success(`Welcome back, ${userName}!`);

// Error toast
toast.error("Login failed. Please try again.");

// Loading toast
const loadingToast = toast.loading("Signing in...");
toast.dismiss(loadingToast);
```

#### 2. Blocking Feedback (Modal Dialogs)
**Use Cases**: Confirmation before critical actions
**Implementation**: Custom accessible Modal component
**Features**:
- Focus trapping inside modal
- ESC key to close
- Backdrop click to close
- Restore focus on close
- Multiple size variants

**Examples**:
- Login confirmation modal
- Account creation confirmation modal
- Shows user data for verification

#### 3. Process Feedback (Loaders/Spinners)
**Use Cases**: Async operations, form submissions
**Implementation**: Custom Loader component
**Features**:
- Multiple sizes (sm, md, lg)
- Optional text labels
- Full-screen or inline modes
- Accessible with `aria-live="polite"`

### User Flow Demonstrations

#### Login Flow:
1. **Form Validation** → Real-time error messages
2. **Submit** → Confirmation modal (blocking feedback)
3. **Confirm** → Loading toast + spinner (process feedback)
4. **Success** → Success toast (instant feedback)
5. **Redirect** → Navigate to dashboard

#### Signup Flow:
1. **Form Validation** → Real-time error messages  
2. **Submit** → Confirmation modal (blocking feedback)
3. **Confirm** → Loading toast + spinner (process feedback)
4. **Success** → Success toast (instant feedback)
5. **Redirect** → Navigate to dashboard

### Accessibility Features

#### Toast Notifications:
- `role="status"` and `aria-live="polite"` for screen readers
- High contrast colors for readability
- Keyboard dismissible
- Focus management

#### Modal Dialogs:
- `role="dialog"` and `aria-modal="true"`
- `aria-labelledby` for proper labeling
- Focus trapping and restoration
- Keyboard navigation support
- ESC key functionality

#### Loaders:
- `aria-live="polite"` for screen readers
- Descriptive text labels
- Non-blocking user experience

### UX Principles Followed

1. **Non-Intrusive**: Feedback doesn't block user flow unnecessarily
2. **Informative**: Clear, actionable messages for all states
3. **Accessible**: Full screen reader and keyboard support
4. **Consistent**: Unified design language across all feedback types
5. **Timely**: Immediate feedback for user actions
6. **Recoverable**: Users can cancel or retry actions

### Design Consistency

- **Color Scheme**: Success (green), Error (red), Loading (indigo)
- **Animation Speed**: Smooth transitions (200-300ms)
- **Typography**: Consistent with EDUVEXA design system
- **Spacing**: Follows established spacing patterns
- **Icons**: Consistent icon family and sizing

### Benefits of Implementation

1. **User Trust**: Clear communication builds confidence
2. **Error Reduction**: Confirmation modals prevent mistakes
3. **Accessibility**: WCAG-compliant feedback system
4. **Performance**: Optimized toast notifications
5. **Maintainability**: Reusable components
6. **User Experience**: Professional, responsive interface

### Validation Screenshots

The forms provide:
- Real-time validation feedback
- Clear error messages with visual indicators
- Loading states during submission
- Success feedback with toast notifications
- Confirmation modals for critical actions

### Reflection on Feedback UI Design

**Accessibility**: The implementation prioritizes accessibility through proper ARIA attributes, focus management, and keyboard navigation. All feedback elements are screen reader friendly and follow WCAG guidelines.

**User Experience**: The multi-layered feedback system ensures users always understand what's happening. Instant toasts provide quick feedback, modals prevent critical errors, and loaders show process status.

**Technical Excellence**: The components are reusable, type-safe, and follow React best practices. The toast system is performant and the modal system is fully accessible.

**Design Integration**: All feedback elements seamlessly integrate with the EDUVEXA design system, maintaining brand consistency while providing excellent user feedback.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
