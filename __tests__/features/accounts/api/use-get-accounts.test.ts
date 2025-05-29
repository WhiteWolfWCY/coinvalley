import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGetAccounts } from '@/features/accounts/api/use-get-accounts';
import { client } from '@/lib/hono';
import React from 'react';

jest.mock('@/lib/hono', () => ({
  client: {
    api: {
      accounts: {
        $get: jest.fn(),
      },
    },
  },
}));

const mockClientGet = client.api.accounts.$get as jest.Mock;

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

describe('useGetAccounts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch accounts successfully', async () => {
    const mockAccounts = [
      { id: 'acc_1', name: 'Checking Account' },
      { id: 'acc_2', name: 'Savings Account' },
    ];

    mockClientGet.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ data: mockAccounts }),
    });

    const { result } = renderHook(() => useGetAccounts(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockAccounts);
    expect(mockClientGet).toHaveBeenCalledTimes(1);
  });

  it('should handle error when fetching accounts fails', async () => {
    mockClientGet.mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue({ error: 'Failed to fetch' }),
    });

    const { result } = renderHook(() => useGetAccounts(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
  });
}); 