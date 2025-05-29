import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGetSummary } from '@/features/summary/api/use-get-summary';
import { client } from '@/lib/hono';
import { convertAmountFromMiliunits } from '@/lib/utils';
import React from 'react';

// Mock next/navigation
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
      summary: {
        $get: jest.fn(),
      },
    },
  },
}));

const mockClientGet = client.api.summary.$get as jest.Mock;

// Create a wrapper for the React Query context
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

describe('useGetSummary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch summary data successfully', async () => {
    // Mock response data
    const mockSummaryResponse = {
      incomeAmount: 5000000, // 5000 in miliunits
      expensesAmount: -2000000, // -2000 in miliunits
      remainingAmount: 3000000, // 3000 in miliunits
      incomeChange: 10,
      expensesChange: -5,
      remainingChange: 15,
      categories: [
        { name: 'Food', value: 1000000 }, // 1000 in miliunits
        { name: 'Transport', value: 500000 }, // 500 in miliunits
      ],
      days: [
        { date: '2023-01-01', income: 1000000, expenses: 500000 }, // 1000 and 500 in miliunits
        { date: '2023-01-02', income: 2000000, expenses: 700000 }, // 2000 and 700 in miliunits
      ],
    };

    const expectedConvertedData = {
      incomeAmount: 5000,
      expensesAmount: -2000,
      remainingAmount: 3000,
      incomeChange: 10,
      expensesChange: -5,
      remainingChange: 15,
      categories: [
        { name: 'Food', value: 1000 },
        { name: 'Transport', value: 500 },
      ],
      days: [
        { date: '2023-01-01', income: 1000, expenses: 500 },
        { date: '2023-01-02', income: 2000, expenses: 700 },
      ],
    };

    // Mock successful response
    mockClientGet.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ data: mockSummaryResponse }),
    });

    // Render the hook
    const { result } = renderHook(() => useGetSummary(), {
      wrapper: createWrapper(),
    });

    // Initially should be loading
    expect(result.current.isLoading).toBe(true);

    // Wait for the query to complete
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Verify data is correctly transformed
    expect(result.current.data).toEqual(expectedConvertedData);
    
    // Verify API was called with correct parameters
    expect(mockClientGet).toHaveBeenCalledWith({
      query: {
        from: '2023-01-01',
        to: '2023-01-31',
        accountId: 'acc_123',
      },
    });
    
    // Verify amount conversion was called
    expect(convertAmountFromMiliunits).toHaveBeenCalledWith(mockSummaryResponse.incomeAmount);
    expect(convertAmountFromMiliunits).toHaveBeenCalledWith(mockSummaryResponse.expensesAmount);
    expect(convertAmountFromMiliunits).toHaveBeenCalledWith(mockSummaryResponse.remainingAmount);
  });

  it('should handle error when fetching summary fails', async () => {
    // Mock error response
    mockClientGet.mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue({ error: 'Failed to fetch' }),
    });

    // Render the hook
    const { result } = renderHook(() => useGetSummary(), {
      wrapper: createWrapper(),
    });

    // Wait for the query to complete with error
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    // Verify error state
    expect(result.current.error).toBeDefined();
  });
}); 