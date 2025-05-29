import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useCreateCategory } from '@/features/categories/api/use-create-category';
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
      categories: {
        $post: jest.fn(),
      },
    },
  },
}));

const mockClientPost = client.api.categories.$post as jest.Mock;

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

describe('useCreateCategory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a category successfully', async () => {
    mockClientPost.mockResolvedValue({
      json: jest.fn().mockResolvedValue({ id: 'cat_123', success: true }),
    });

    const { result } = renderHook(() => useCreateCategory(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      name: 'Test Category'
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockClientPost).toHaveBeenCalledWith({
      json: expect.objectContaining({
        name: 'Test Category'
      }),
    });

    expect(toast.success).toHaveBeenCalledWith('Your category has been created!');
  });

  it('should handle errors when creating a category', async () => {
    mockClientPost.mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useCreateCategory(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      name: 'Test Category'
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(toast.error).toHaveBeenCalledWith('Failed to create a category!');
  });
}); 