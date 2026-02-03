# EDUVEXA

EDUVEXA is a modern, full-stack educational collaboration platform designed to improve visibility into student engagement and project progress. It leverages dashboards, peer feedback mechanisms, and analytics to enhance collaboration, accountability, and learning outcomes.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd EDUVEXA
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your database URL in `.env.local`:
   ```bash
   DATABASE_URL="postgresql://username:password@localhost:5432/eduvexa"
   JWT_SECRET="your-secret-key-here"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma migrate dev
   
   # Seed the database with test data
   npx prisma db seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 🧪 Testing

EDUVEXA includes a comprehensive testing setup using Jest and React Testing Library.

### Testing Setup

- **Jest**: Test runner with coverage reporting
- **React Testing Library**: Component testing utilities
- **User Event**: Advanced user interaction simulation
- **TypeScript**: Full TypeScript support

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run specific test file
npm test __tests__/utils.test.ts
```

### Test Structure

```
__tests__/
├── utils.test.ts          # Utility function tests
├── Button.test.tsx        # Component tests
└── ProfessionalSidebar.test.tsx  # Complex component tests
```

### Coverage Configuration

The test suite is configured with coverage thresholds:
- **Statements**: 80%
- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%

Coverage reports are generated in the `coverage/` directory.

### Sample Test Output

```
 PASS  __tests__/utils.test.ts
  Utility Functions
    sum
      ✓ should add two positive numbers correctly (3 ms)
      ✓ should handle negative numbers
      ✓ should handle zero
      ✓ should handle decimal numbers
    isValidEmail
      ✓ should validate correct email addresses (4 ms)
      ✓ should reject invalid email addresses
      ✓ should reject emails with spaces (1 ms)
    capitalize
      ✓ should capitalize first letter of a string (3 ms)
      ✓ should handle empty string (1 ms)
      ✓ should handle single character (1 ms)
      ✓ should handle strings with spaces

Test Suites: 1 passed, 1 total
Tests:       11 passed, 11 total
```

### CI/CD Integration

The project includes automated testing through GitHub Actions:

- **Unit Tests**: Run on every push and pull request
- **Coverage Reports**: Automatically uploaded to Codecov
- **Security Audits**: Automated vulnerability scanning
- **Multi-node Testing**: Tests run on Node.js 18.x and 20.x

### Writing Tests

#### Utility Function Example
```typescript
// src/utils/helpers.ts
export const sum = (a: number, b: number): number => a + b;

// __tests__/utils.test.ts
import { sum } from '../src/utils/helpers';

test('adds two numbers', () => {
  expect(sum(2, 3)).toBe(5);
});
```

#### Component Example
```typescript
// __tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../src/components/ui/Button';

test('renders button and responds to click', async () => {
  const handleClick = jest.fn();
  render(<Button label="Click Me" onClick={handleClick} />);
  
  const button = screen.getByRole('button', { name: 'Click Me' });
  await userEvent.click(button);
  
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### Best Practices

1. **Test Behavior, Not Implementation**: Focus on what users see and do
2. **Use Meaningful Assertions**: Test user-visible outcomes
3. **Mock External Dependencies**: Isolate components from external services
4. **Maintain High Coverage**: Aim for 80%+ coverage across all metrics
5. **Write Descriptive Tests**: Clear test names that explain the behavior

### Testing Pyramid

```
    /\
   /  \  E2E Tests (Cypress/Playwright)
  /____\
 /      \ Integration Tests
/________\
Unit Tests (Jest + RTL) - Fast, Isolated, Comprehensive
```

- **Unit Tests**: Fast, isolated tests for individual functions/components
- **Integration Tests**: Test how modules work together
- **E2E Tests**: Full user workflows in a real browser

### Troubleshooting

#### Common Issues

1. **Jest DOM Matchers Not Found**
   ```bash
   npm install --save-dev @testing-library/jest-dom
   ```

2. **Module Resolution Errors**
   - Check `jest.config.js` `moduleNameMapper` configuration
   - Ensure TypeScript paths are properly mapped

3. **Coverage Threshold Failures**
   - Write more tests for uncovered code
   - Adjust thresholds in `jest.config.js` if necessary

#### Debugging Tests

```bash
# Run tests with debugger
node --inspect-brk node_modules/.bin/jest --runInBand

# Run specific test in debug mode
node --inspect-brk node_modules/.bin/jest __tests__/utils.test.ts --runInBand
```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Test Accounts

After seeding the database, you can use these test accounts:

| Role | Email | Password |
|------|-------|----------|
| Student | alice@example.com | password123 |
| Instructor | bob@example.com | password123 |
| Admin | david@example.com | password123 |

## 🧩 Key Features

- **📊 Real-time Dashboard** - Engagement metrics, task tracking, and activity monitoring
- **🤝 Peer Feedback System** - Structured reviews with ratings and comments
- **👥 Team Management** - User profiles, search, and statistics
- **🚀 Project Management** - Task tracking with progress visualization
- **🔐 Secure Authentication** - JWT-based auth with role-based access control
- **🎨 Modern UI/UX** - Dark mode, responsive design, and smooth animations

## �️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with HTTP-only cookies, bcrypt
- **UI**: Custom components with Lucide React icons

## 📁 Project Structure

```
EDUVEXA/
├── eduvexa/                    # Next.js app
│   ├── src/
│   │   ├── app/               # App Router pages
│   │   │   ├── api/          # API routes
│   │   │   ├── dashboard/    # Dashboard page
│   │   │   ├── profile/      # Profile page
│   │   │   ├── users/        # Team members page
│   │   │   ├── projects/     # Projects page
│   │   │   └── ...
│   │   ├── components/        # Reusable components
│   │   ├── context/          # React contexts
│   │   ├── hooks/            # Custom hooks
│   │   └── lib/              # Utilities
│   └── ...
├── prisma/
│   ├── schema.prisma         # Database schema
│   ├── migrations/           # Database migrations
│   └── seed.ts              # Seed data
├── .env.example              # Environment variables template
└── README.md                # This file
```

## 🎯 Learning Outcomes

By working on EDUVEXA, developers gain hands-on experience with:
- Full-stack Next.js development with App Router
- TypeScript for type safety
- Prisma ORM for database operations
- JWT authentication and security best practices
- Modern React patterns (Context, Hooks, Forms)
- Responsive design with Tailwind CSS
- Database design and relationships
- API development with Next.js API routes

---

> *"You're not just building an app — you're learning how the modern web runs."*
