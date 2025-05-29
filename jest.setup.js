import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    pathname: '/',
    query: {},
  }),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

jest.mock('@clerk/nextjs', () => ({
  auth: () => ({ 
    userId: 'test-user-id',
    getToken: jest.fn(() => 'test-token'),
  }),
  currentUser: () => ({
    id: 'test-user-id',
    firstName: 'Test',
    lastName: 'User',
    emailAddresses: [{ emailAddress: 'test@example.com' }],
  }),
  useAuth: () => ({
    isLoaded: true,
    isSignedIn: true,
    userId: 'test-user-id',
  }),
  useUser: () => ({
    isLoaded: true,
    isSignedIn: true,
    user: {
      id: 'test-user-id',
      firstName: 'Test',
      lastName: 'User',
      emailAddresses: [{ emailAddress: 'test@example.com' }],   
    },
  }),
})); 