import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useCreateTransaction } from '@/features/transactions/api/use-create-transaction';
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
      transactions: {
        $post: jest.fn(),
      },
    },
  },
}));

const mockClientPost = client.api.transactions.$post as jest.Mock;

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

describe('useCreateTransaction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a transaction successfully', async () => {
    mockClientPost.mockResolvedValue({
      json: jest.fn().mockResolvedValue({ id: 'txn_123', success: true }),
    });

    const { result } = renderHook(() => useCreateTransaction(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      amount: 5000,
      payee: 'Test Payee',
      date: new Date(),
      accountId: 'acc_123',
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockClientPost).toHaveBeenCalledWith({
      json: expect.objectContaining({
        amount: 5000,
        payee: 'Test Payee',
        accountId: 'acc_123',
      }),
    });

    expect(toast.success).toHaveBeenCalledWith('Your transaction has been created!');
  });

  it('should handle errors when creating a transaction', async () => {
    mockClientPost.mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useCreateTransaction(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      amount: 5000,
      payee: 'Test Payee',
      date: new Date(),
      accountId: 'acc_123',
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(toast.error).toHaveBeenCalledWith('Failed to create a transaction!');
  });
}); 