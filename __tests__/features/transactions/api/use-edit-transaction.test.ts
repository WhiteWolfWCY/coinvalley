import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useEditTransaction } from '@/features/transactions/api/use-edit-transaction';
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
        ":id": {
          $patch: jest.fn(),
        },
      },
    },
  },
}));

const mockClientPatch = client.api.transactions[":id"].$patch as jest.Mock;

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

describe('useEditTransaction', () => {
  const transactionId = 'txn_123';
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should edit a transaction successfully', async () => {
    mockClientPatch.mockResolvedValue({
      json: jest.fn().mockResolvedValue({ data: { id: transactionId }, success: true }),
    });

    const { result } = renderHook(() => useEditTransaction(transactionId), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      amount: 5000,
      payee: 'Updated Payee',
      date: new Date('2023-04-15'),
      accountId: 'acc_123',
      categoryId: 'cat_456',
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockClientPatch).toHaveBeenCalledWith({
      param: { id: transactionId },
      json: expect.objectContaining({
        amount: 5000,
        payee: 'Updated Payee',
        accountId: 'acc_123',
        categoryId: 'cat_456',
      }),
    });

    expect(toast.success).toHaveBeenCalledWith('Your transaction has been updated!');
  });

  it('should handle errors when editing a transaction', async () => {
    mockClientPatch.mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useEditTransaction(transactionId), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      amount: 5000,
      payee: 'Updated Payee',
      date: new Date('2023-04-15'),
      accountId: 'acc_123',
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(toast.error).toHaveBeenCalledWith('Failed to edit a transaction!');
  });
}); 