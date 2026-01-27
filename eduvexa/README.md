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

### Features Implemented

#### 1. Enhanced Login Form (`/app/login/page.tsx`)
- React Hook Form integration with Zod validation
- Modern gradient background and card-based design
- User icon and loading states
- Accessibility-focused form inputs
- Real-time validation feedback

#### 2. Comprehensive Signup Form (`/app/signup/page.tsx`)
- Multi-field validation (name, email, password)
- Enhanced visual design with icons
- Form validation with specific error messages
- Loading states and transitions
- Terms of Service and Privacy Policy links

#### 3. Reusable FormInput Component (`/components/ui/FormInput.tsx`)
- TypeScript-based prop interface
- Icon support for visual enhancement
- Error state handling with visual feedback
- Focus states and transitions
- Accessibility features (labels, ARIA attributes)

### Validation Schemas

#### Login Schema
```typescript
const loginSchema = z.object({
  userName: z.string().min(2, "Name must be at least 2 characters long"),
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

### Accessibility Features

- **Semantic HTML**: Proper use of `<label>`, `<input>`, and `<form>` elements
- **Screen Reader Support**: Clear labels and error messages
- **Keyboard Navigation**: Focus states and logical tab order
- **Visual Feedback**: Error states, loading indicators, and hover effects
- **Color Contrast**: High contrast text for readability

### UI/UX Enhancements

- **Modern Design**: Gradient backgrounds, rounded corners, and shadows
- **Micro-interactions**: Smooth transitions and hover effects
- **Loading States**: Animated spinners during form submission
- **Error Handling**: Clear, actionable error messages with icons
- **Responsive Design**: Mobile-friendly layouts
- **Visual Hierarchy**: Clear typography and spacing

### Benefits of Implementation

1. **Type Safety**: Full TypeScript integration with Zod schemas
2. **Performance**: Optimized re-renders with React Hook Form
3. **Reusability**: Modular FormInput component for consistent forms
4. **Accessibility**: WCAG-compliant form design
5. **User Experience**: Modern, intuitive interface with clear feedback
6. **Maintainability**: Clean separation of concerns and validation logic

### Validation Screenshots

The forms provide:
- Real-time validation feedback
- Clear error messages with visual indicators
- Loading states during submission
- Success feedback and navigation

### Reflection on Accessibility and Reusability

**Accessibility**: The implementation prioritizes accessibility through proper semantic HTML, ARIA attributes, keyboard navigation support, and clear visual feedback. Error messages are descriptive and associated with their respective form fields.

**Reusability**: The FormInput component demonstrates excellent reusability by accepting props for different input types, icons, labels, and error states. This approach reduces code duplication and ensures consistent form behavior across the application.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
