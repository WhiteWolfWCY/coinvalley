# Testing Guide for CoinValley

This guide will help you set up and write tests for the CoinValley application.

## Setup

We use Jest and React Testing Library for testing our application. These have already been set up with the following configuration:

- **Jest configuration**: `jest.config.mjs` - Configures Jest to work with Next.js and TypeScript
- **Jest setup**: `jest.setup.js` - Sets up common mocks for Next.js, Clerk authentication, etc.

## Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode (for development)
pnpm test:watch

# Run tests with coverage report
pnpm test:coverage
```

## Directory Structure

Tests are organized in the `__tests__` directory, mirroring the structure of the main codebase:

```
__tests__/
  components/     # Tests for UI components
  features/       # Tests for feature-specific components and hooks
  lib/            # Tests for utility functions
  mocks/          # Mock data and services for testing
  utils/          # Test utilities
```

## Writing Tests

### Component Tests

For testing React components:

```tsx
// Import the component and testing utilities
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { YourComponent } from '@/path/to/your/component';

describe('YourComponent', () => {
  it('renders correctly', () => {
    render(<YourComponent prop1="value" />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('handles user interactions', async () => {
    const mockFn = jest.fn();
    const user = userEvent.setup();
    
    render(<YourComponent onClick={mockFn} />);
    await user.click(screen.getByRole('button'));
    
    expect(mockFn).toHaveBeenCalled();
  });
});
```

### API/Hook Tests

For testing API hooks (like those using React Query):

```tsx
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useYourHook } from '@/path/to/your/hook';

// Create a wrapper for the React Query context
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  return function Wrapper({ children }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };
};

describe('useYourHook', () => {
  it('works correctly', async () => {
    // Mock any dependencies
    jest.spyOn(dependencies, 'method').mockImplementation(() => mockData);
    
    const { result } = renderHook(() => useYourHook(), {
      wrapper: createWrapper(),
    });
    
    // Wait for the hook to finish
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    
    // Assert on the result
    expect(result.current.data).toEqual(expectedData);
  });
});
```

### Mocking Dependencies

#### Mocking Clerk Authentication

In `jest.setup.js`, we've set up mocks for Clerk authentication:

```javascript
jest.mock('@clerk/nextjs', () => ({
  auth: () => ({ userId: 'test-user-id' }),
  useAuth: () => ({
    isLoaded: true,
    isSignedIn: true,
    userId: 'test-user-id',
  }),
  // ... other mocks
}));
```

#### Mocking Drizzle ORM

For database tests, use the mock implementation in `__tests__/mocks/db.ts`:

```typescript
import { mockDb } from '@/__tests__/mocks/db';

// In your test
jest.mock('@/db/drizzle', () => ({
  db: mockDb,
}));
```

## Best Practices

1. **Test behavior, not implementation**: Focus on what the component/hook does, not how it does it.

2. **Mock external dependencies**: Always mock API calls, authentication, and database interactions.

3. **Use data-testid sparingly**: Prefer using accessible queries like `getByRole`, `getByText`, etc.

4. **Keep tests isolated**: Each test should be independent and not rely on the state from other tests.

5. **Test edge cases**: Include tests for error states, loading states, and empty states.

## Debugging Tests

If a test is failing, you can use the following approaches to debug:

```javascript
// Console logging in tests
console.log('Debug info:', someValue);

// Using the debug utility
import { screen } from '@testing-library/react';

// ... in your test
screen.debug(); // Prints the current DOM
```

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [User Event Documentation](https://testing-library.com/docs/user-event/intro) 