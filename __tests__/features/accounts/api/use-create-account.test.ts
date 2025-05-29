import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useCreateAccount } from '@/features/accounts/api/use-create-account';
import { client } from '@/lib/hono';
import React from 'react';

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('@/lib/hono', () => ({
  client: {
    api: {
      accounts: {
        $post: jest.fn(),
      },
    },
  },
}));

const mockClientPost = client.api.accounts.$post as jest.Mock;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  function QueryWrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(
      QueryClientProvider,
      { client: queryClient },
      children
    );
  }
  
  QueryWrapper.displayName = 'QueryClientWrapper';
  
  return QueryWrapper;
};

describe('useCreateAccount', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create an account successfully', async () => {
    mockClientPost.mockResolvedValue({
      json: jest.fn().mockResolvedValue({ id: 'acc_123', success: true }),
    });

    const { result } = renderHook(() => useCreateAccount(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      name: 'Test Account'
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockClientPost).toHaveBeenCalledWith({
      json: expect.objectContaining({
        name: 'Test Account'
      }),
    });

    expect(toast.success).toHaveBeenCalledWith('Your account has been created!');
  });

  it('should handle errors when creating an account', async () => {
    mockClientPost.mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useCreateAccount(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      name: 'Test Account'
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(toast.error).toHaveBeenCalledWith('Failed to create an account!');
  });
}); 