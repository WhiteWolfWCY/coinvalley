import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGetCategories } from '@/features/categories/api/use-get-categories';
import { client } from '@/lib/hono';
import React from 'react';

jest.mock('@/lib/hono', () => ({
  client: {
    api: {
      categories: {
        $get: jest.fn(),
      },
    },
  },
}));

const mockClientGet = client.api.categories.$get as jest.Mock;

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

describe('useGetCategories', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch categories successfully', async () => {
    const mockCategories = [
      { id: 'cat_1', name: 'Food & Dining' },
      { id: 'cat_2', name: 'Transportation' },
    ];

    mockClientGet.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ data: mockCategories }),
    });

    const { result } = renderHook(() => useGetCategories(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockCategories);
    expect(mockClientGet).toHaveBeenCalledTimes(1);
  });

  it('should handle error when fetching categories fails', async () => {
    mockClientGet.mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue({ error: 'Failed to fetch' }),
    });

    const { result } = renderHook(() => useGetCategories(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
  });
}); 