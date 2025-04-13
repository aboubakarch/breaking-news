import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { fetchMostPopularArticles } from '../api/nytimes';

// Mock axios
vi.mock('axios');

// Mock response data
const mockArticlesResponse = {
  data: {
    results: [
      {
        uri: 'nyt://article/123',
        id: '123',
        title: 'Test Article',
        abstract: 'Test Abstract',
        byline: 'By Test Author',
        published_date: '2025-04-13',
        section: 'Technology',
        media: [
          {
            'media-metadata': [
              {
                url: 'test-image.jpg',
                format: 'mediumThreeByTwo210',
              },
            ],
          },
        ],
        des_facet: ['Test Tag'],
      },
    ],
  },
};

describe('NY Times API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch most popular articles successfully', async () => {
    // Setup mock response
    vi.mocked(axios.get).mockResolvedValueOnce(mockArticlesResponse);

    // Call the function
    const articles = await fetchMostPopularArticles();

    // Verify the API was called with correct parameters
    expect(axios.get).toHaveBeenCalledWith(
      'https://api.nytimes.com/svc/mostpopular/v2/viewed/1.json',
      {
        params: {
          'api-key': expect.any(String),
        },
      }
    );

    // Verify the returned data
    expect(articles).toEqual(mockArticlesResponse.data.results);
    expect(axios.get).toHaveBeenCalledTimes(1);
  });

  it('should handle API errors correctly', async () => {
    // Setup mock error
    const error = new Error('API Error');
    vi.mocked(axios.get).mockRejectedValueOnce(error);

    // Verify error handling
    await expect(fetchMostPopularArticles()).rejects.toThrow('API Error');

    // Verify the API was called
    expect(axios.get).toHaveBeenCalledTimes(1);
  });

  it('should use correct base URL and API key', async () => {
    // Setup mock response
    vi.mocked(axios.get).mockResolvedValueOnce(mockArticlesResponse);

    // Call the function
    await fetchMostPopularArticles();

    // Get the call arguments
    const [url, config] = vi.mocked(axios.get).mock.calls[0];

    // Verify URL and API key
    expect(url).toContain('https://api.nytimes.com/svc');
    expect(url).toContain('mostpopular/v2/viewed/1.json');
    expect('2GXsHw1KJFWGubt6SSXUCmWZYM4cRjo3').toBeTruthy();
  });
});
