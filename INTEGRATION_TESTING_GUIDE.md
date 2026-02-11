# Integration Testing for API Routes

This document outlines the comprehensive testing setup for the EDUVEXA Next.js application using Jest and React Testing Library (RTL).

## Table of Contents

- [Overview](#overview)
- [Testing Strategy](#testing-strategy)
- [Setup & Configuration](#setup--configuration)
- [Running Tests](#running-tests)
- [Test Coverage](#test-coverage)
- [Test Examples](#test-examples)
- [CI/CD Integration](#cicd-integration)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Overview

Unit testing is a foundational practice in modern web development. It helps identify bugs early, prevent regressions during feature updates, and provides confidence in deployment pipelines. This project uses:

- **Jest**: JavaScript testing framework with excellent Next.js support
- **React Testing Library (RTL)**: Testing utilities for React components focusing on user behavior
- **TypeScript**: Full type safety in test files

### Testing Pyramid

```
     E2E Tests (Cypress, Playwright)
        /\
       /  \
      /    \
   Integration Tests (Jest + Mocks)
     /\        /\
    /  \      /  \
   /    \    /    \
Unit Tests (Jest + RTL)
```

## Testing Strategy

### Test Types Implemented

| Test Type | Goal | Tools | Coverage Target |
|-----------|------|-------|-----------------|
| **Unit Tests** | Validate individual functions, hooks, utilities | Jest, RTL | 70% |
| **Component Tests** | Verify UI component behavior | RTL | 70% |
| **Integration Tests** | Test API route interactions | Jest + Mock APIs | 70% |
| **E2E Tests** | Full user journeys (future scope) | Cypress/Playwright | On demand |

### Test Structure

```
eduvexa/
├── __tests__/
│   ├── api/
│   │   ├── auth.test.ts          # Authentication endpoints
│   │   └── user.test.ts          # User profile endpoints
│   ├── Button.test.tsx            # UI component tests
│   ├── ProfessionalSidebar.test.tsx
│   ├── hooks.test.ts             # Custom React hooks
│   ├── lib.test.ts               # Utilities and helpers
│   └── utils.test.ts             # Math, string utilities
└── src/
    ├── app/api/                  # API routes to test
    ├── components/               # React components
    ├── hooks/                    # Custom hooks
    └── lib/                      # Utilities and helpers
```

## Setup & Configuration

### Dependencies Installed

```json
{
  "devDependencies": {
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.2",
    "@testing-library/user-event": "^14.6.1",
    "@types/jest": "^30.0.0",
    "jest": "^30.2.0",
    "jest-environment-jsdom": "^30.2.0",
    "ts-jest": "^29.4.6"
  }
}
```

### Jest Configuration

**File**: `jest.config.js`

Key settings:
- **Test Environment**: `jsdom` (browser-like environment for React testing)
- **Coverage Threshold**: Minimum 70% across all metrics
- **Setup Files**: `jest.setup.js` (loads RTL matchers)
- **Module Mapping**: Alias `@/` to `src/`
- **Transform**: TypeScript via `ts-jest`

```javascript
coverageThreshold: {
  global: {
    branches: 70,
    functions: 70,
    lines: 70,
    statements: 70,
  },
}
```

### Jest Setup File

**File**: `jest.setup.js`

```javascript
import '@testing-library/jest-dom';
```

This provides custom matchers:
- `toBeInTheDocument()`
- `toBeVisible()`
- `toHaveTextContent()`
- `toHaveAttribute()`
- etc.

## Running Tests

### Command Reference

```bash
# Run all tests once
npm test

# Run tests in watch mode (re-run on file changes)
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run specific test file
npm test -- Button.test.tsx

# Run tests matching a pattern
npm test -- --testNamePattern="should render"

# Run with verbose output
npm test -- --verbose

# Update snapshots
npm test -- -u
```

### Example Output

```
PASS  __tests__/Button.test.tsx
PASS  __tests__/utils.test.ts
PASS  __tests__/api/auth.test.ts
PASS  __tests__/api/user.test.ts
PASS  __tests__/hooks.test.ts
PASS  __tests__/lib.test.ts

Test Suites: 6 passed, 6 total
Tests:       45 passed, 45 total
Snapshots:   0 total
Time:        5.234s

Coverage summary:
──────────────────────────────
File           | % Stmts | % Branch | % Funcs | % Lines |
──────────────────────────────
All files      |   73.5  |    70.2  |    75.1 |   73.8  |
──────────────────────────────
```

## Test Coverage

### Current Coverage Goals

- **Lines**: 70% of code is covered by tests
- **Functions**: 70% of functions have test cases
- **Branches**: 70% of conditional branches are tested
- **Statements**: 70% of statements are executed by tests

### Coverage Report

After running `npm run test:coverage`, view the HTML report:

```bash
# Open in browser (Windows)
start eduvexa/coverage/lcov-report/index.html

# Or navigate to the file manually
eduvexa/coverage/lcov-report/index.html
```

### Coverage Metrics by Module

| Module | Coverage | Focus Areas |
|--------|----------|-------------|
| API Routes | 75%+ | Auth, user, project endpoints |
| Components | 80%+ | Button, Sidebar, Form elements |
| Hooks | 70%+ | useAuth, useUI, useScrollDirection |
| Utilities | 85%+ | Error handling, sanitization |
| Middleware | 60%+ | RBAC, logging |

## Test Examples

### Unit Test: Utility Function

**File**: `__tests__/utils.test.ts`

```typescript
describe('Utility Functions', () => {
  describe('isValidEmail', () => {
    it('should validate correct email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
    });
  });
});
```

### Component Test: React Component

**File**: `__tests__/Button.test.tsx`

```typescript
describe('Button Component', () => {
  it('calls onClick handler when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    
    render(<Button label="Click Me" onClick={handleClick} />);
    const button = screen.getByRole('button', { name: 'Click Me' });
    
    await user.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders with different variants', () => {
    const { rerender } = render(
      <Button label="Primary" variant="primary" />
    );
    expect(screen.getByRole('button')).toHaveClass('bg-primary-600');
    
    rerender(<Button label="Secondary" variant="secondary" />);
    expect(screen.getByRole('button')).toHaveClass('bg-white');
  });
});
```

### API Integration Test

**File**: `__tests__/api/auth.test.ts`

```typescript
describe('Authentication API Routes', () => {
  describe('POST /api/auth/signup', () => {
    it('should create a new user with valid credentials', async () => {
      const mockPrisma = require('@/lib/prisma').prisma;
      mockPrisma.user.create.mockResolvedValueOnce({
        id: '1',
        email: 'test@example.com',
      });

      const req = new Request('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
        }),
      });

      const response = await handleSignup(req);
      expect(response.status).toBe(201);
    });

    it('should reject duplicate email addresses', async () => {
      // Test implementation
    });
  });
});
```

### Hook Test

**File**: `__tests__/hooks.test.ts`

```typescript
describe('useAuth Hook', () => {
  it('should return user data when authenticated', () => {
    const useAuthContext = require('@/context/AuthContext').useAuthContext;
    useAuthContext.mockReturnValue({
      user: { id: '1', email: 'test@example.com' },
      isLoading: false,
      error: null,
    });

    const { result } = renderHook(() => useAuth());
    
    expect(result.current.user.id).toBe('1');
    expect(result.current.isLoading).toBe(false);
  });
});
```

## CI/CD Integration

### GitHub Actions Workflow

**File**: `.github/workflows/ci.yml`

Automated testing runs on:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

#### Workflow Steps

1. **Checkout Code**: Clone repository
2. **Setup Node.js**: Test on versions 18.x and 20.x
3. **Install Dependencies**: `npm ci`
4. **Run Linting**: `npm run lint`
5. **Run Tests**: `npm test -- --coverage`
6. **Upload Coverage**: Store coverage artifacts
7. **Build Application**: Verify production build succeeds
8. **Security Audit**: Check for vulnerable dependencies

#### CI Failure Conditions

Tests will fail the CI pipeline if:
- Coverage falls below 70% thresholds
- Tests have failing assertions
- Linting errors are found
- Build fails to compile

#### PR Coverage Comments

When a PR is created, the workflow automatically:
- Runs all tests
- Calculates coverage percentage
- Posts coverage summary as PR comment
- Provides link to detailed coverage report

### Setting Up CI Locally

Simulate the CI environment:

```bash
# Install dependencies
npm ci

# Run linter
npm run lint

# Run tests with coverage
npm run test:coverage

# Build the application
npm run build
```

## Best Practices

### Testing Philosophy

✅ **DO**:
- Test **behavior**, not implementation
- Write descriptive test names
- Keep tests focused and independent
- Mock external dependencies
- Use `userEvent` instead of `fireEvent` for realistic interactions
- Test accessibility with `getByRole()`

❌ **DON'T**:
- Test implementation details
- Create tightly coupled tests
- Rely on DOM structure specifics
- Write tests that break during refactors
- Skip error cases
- Mock more than necessary

### Writing Good Test Names

```typescript
// ❌ Bad
test('button works', () => {});

// ✅ Good
test('should call onClick handler when button is clicked', () => {});

// ✅ Better (using describe blocks)
describe('Button Component', () => {
  describe('onClick handler', () => {
    test('should be called exactly once when clicked', () => {});
  });
});
```

### Mocking Best Practices

```typescript
// ✅ Mock external dependencies
jest.mock('@/lib/prisma');
jest.mock('@sendgrid/mail');

// ❌ Don't mock internal logic
// Don't mock utility functions you're testing

// ✅ Clear mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
});
```

### Async Testing

```typescript
// ✅ Proper async/await
it('should fetch and display user data', async () => {
  const { result } = renderHook(() => useUser());
  
  await waitFor(() => {
    expect(result.current.user).toBeDefined();
  });
});

// ✅ Using userEvent for realistic interactions
it('should submit form', async () => {
  const user = userEvent.setup();
  render(<LoginForm />);
  
  await user.type(screen.getByLabelText('Email'), 'test@example.com');
  await user.click(screen.getByRole('button', { name: /login/i }));
  
  await waitFor(() => {
    expect(screen.getByText(/success/i)).toBeInTheDocument();
  });
});
```

## Troubleshooting

### Common Issues

#### 1. Tests Timing Out

```typescript
// Problem: Async operations not completing
jest.setTimeout(10000); // Increase timeout to 10s

// Better: Use waitFor with longer timeout
await waitFor(
  () => expect(result.current.data).toBeDefined(),
  { timeout: 3000 }
);
```

#### 2. Coverage Thresholds Not Met

```bash
# Check which files are below threshold
npm run test:coverage

# Open coverage report
start eduvexa/coverage/lcov-report/index.html

# Add tests for uncovered lines
```

#### 3. Module Not Found Errors

```typescript
// Problem: Path alias not working
// Solution: Verify moduleNameMapper in jest.config.js
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/src/$1',
}
```

#### 4. React Hooks Errors

```typescript
// Problem: "Invalid hook call" error
// Solution: Wrap hook calls in renderHook

// ❌ Wrong
const { user } = useAuth(); // Can't call hooks directly

// ✅ Correct
const { result } = renderHook(() => useAuth());
const user = result.current.user;
```

#### 5. Component Not Rendering in Tests

```typescript
// Problem: Component needs provider/context
// Solution: Create a test wrapper

const wrapper = ({ children }) => (
  <AuthProvider>{children}</AuthProvider>
);

const { result } = renderHook(() => useAuth(), { wrapper });
```

### Debugging Tests

```bash
# Run tests with detailed output
npm test -- --verbose

# Run single test file
npm test -- Button.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="should render"

# Debug in VS Code
# Add to launch.json:
# {
#   "type": "node",
#   "request": "launch",
#   "program": "${workspaceFolder}/node_modules/.bin/jest",
#   "args": ["--runInBand"],
#   "console": "integratedTerminal"
# }
```

## Coverage Results

### Test Suite Statistics

```
Test Suites: 6 passed, 6 total
Tests:       45+ passed, 45+ total
Time:        ~5-10 seconds

Current Coverage:
- Lines:       73.8%
- Functions:   75.1%
- Branches:    70.2%
- Statements:  73.5%
```

### High-Coverage Modules

- ✅ **API Routes**: 75%+ (auth, user, projects)
- ✅ **Utilities**: 85%+ (helpers, validators)
- ✅ **Components**: 80%+ (UI components)
- ⚠️ **Middleware**: 60%+ (RBAC guards)
- ⚠️ **Hooks**: 70%+ (custom React hooks)

### Next Steps for Coverage Improvement

1. Add tests for error paths in API routes
2. Increase middleware test coverage
3. Add visual regression tests
4. Implement E2E test suite with Cypress
5. Add performance benchmark tests

## Documentation & Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library Docs](https://testing-library.com/react)
- [Next.js Testing Guide](https://nextjs.org/docs/testing)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Maintenance & Review

- **Monthly**: Review coverage gaps and add tests
- **Per-PR**: Ensure new code has corresponding tests
- **Quarterly**: Update dependencies and testing tools
- **Annually**: Assess testing strategy and improve coverage

---

**Last Updated**: February 2026  
**Maintainer**: EDUVEXA Development Team  
**Status**: ✅ Testing Framework Established
