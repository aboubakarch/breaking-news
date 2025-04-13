import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import useArticles from '../hooks/useArticles';
import { fetchMostPopularArticles } from '../api/nytimes';

// Mock the API function
vi.mock('../api/nytimes'); // Fix the path and simplify mock

// Mock article data
const mockArticles = [
  {
    uri: 'nyt://article/123',
    id: '123',
    title: 'Test Article',
    // ...rest of mock data
  },
];

describe('useArticles Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock implementation for each test
    vi.mocked(fetchMostPopularArticles).mockReset();
  });

  it('should initialize with loading state', () => {
    const { result } = renderHook(() => useArticles());

    expect(result.current.loading).toBe(true);
    expect(result.current.articles).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('should fetch and set articles successfully', async () => {
    // Set up mock implementation
    const mockFetch = vi.mocked(fetchMostPopularArticles);
    mockFetch.mockResolvedValue(mockArticles);

    const { result } = renderHook(() => useArticles());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.articles).toEqual(mockArticles);
    expect(result.current.error).toBeNull();
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('should handle API error correctly', async () => {
    // Set up mock implementation for error case
    const mockFetch = vi.mocked(fetchMostPopularArticles);
    mockFetch.mockRejectedValue(new Error('Failed to fetch articles'));

    const { result } = renderHook(() => useArticles());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.articles).toEqual([]);
    expect(result.current.error).toBe('Failed to fetch articles');
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('should set loading to false after fetch completion', async () => {
    const mockFetch = vi.mocked(fetchMostPopularArticles);
    mockFetch.mockResolvedValue(mockArticles);

    const { result } = renderHook(() => useArticles());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });
});
