import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGetTransactions } from '@/features/transactions/api/use-get-transactions';
import { client } from '@/lib/hono';
import { convertAmountFromMiliunits } from '@/lib/utils';
import React from 'react';

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn().mockImplementation(() => ({
    get: (param: string) => {
      const params: Record<string, string> = {
        from: '2023-01-01',
        to: '2023-01-31',
        accountId: 'acc_123',
      };
      return params[param] || '';
    },
  })),
}));

jest.mock('@/lib/utils', () => ({
  convertAmountFromMiliunits: jest.fn((amount) => amount / 1000),
}));

jest.mock('@/lib/hono', () => ({
  client: {
    api: {
      transactions: {
        $get: jest.fn(),
      },
    },
  },
}));

const mockClientGet = client.api.transactions.$get as jest.Mock;

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

describe('useGetTransactions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch transactions successfully', async () => {
    const mockTransactions = [
      { 
        id: 'txn_1', 
        date: '2023-01-15', 
        category: 'Food', 
        categoryId: 'cat_1',
        payee: 'Supermarket',
        amount: 2500,
        notes: 'Groceries',
        account: 'Checking',
        accountId: 'acc_1'
      },
      { 
        id: 'txn_2', 
        date: '2023-01-16', 
        category: 'Transport', 
        categoryId: 'cat_2',
        payee: 'Gas Station',
        amount: -5000,
        notes: 'Fuel',
        account: 'Credit Card',
        accountId: 'acc_2'
      },
    ];

    const expectedConvertedTransactions = [
      { 
        id: 'txn_1', 
        date: '2023-01-15', 
        category: 'Food', 
        categoryId: 'cat_1',
        payee: 'Supermarket',
        amount: 2.5,
        notes: 'Groceries',
        account: 'Checking',
        accountId: 'acc_1'
      },
      { 
        id: 'txn_2', 
        date: '2023-01-16', 
        category: 'Transport', 
        categoryId: 'cat_2',
        payee: 'Gas Station',
        amount: -5.0,
        notes: 'Fuel',
        account: 'Credit Card',
        accountId: 'acc_2'
      },
    ];

    mockClientGet.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ data: mockTransactions }),
    });

    const { result } = renderHook(() => useGetTransactions(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(expectedConvertedTransactions);
    
    expect(mockClientGet).toHaveBeenCalledWith({
      query: {
        from: '2023-01-01',
        to: '2023-01-31',
        accountId: 'acc_123',
      },
    });
    
    expect(convertAmountFromMiliunits).toHaveBeenCalledWith(mockTransactions[0].amount);
    expect(convertAmountFromMiliunits).toHaveBeenCalledWith(mockTransactions[1].amount);
  });

  it('should handle error when fetching transactions fails', async () => {    
    mockClientGet.mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue({ error: 'Failed to fetch' }),
    });

    const { result } = renderHook(() => useGetTransactions(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
  });
}); 