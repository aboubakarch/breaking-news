import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import ArticleDetail from '../components/ArticleDetail/ArticleDetail';

// Mock useLocation and useParams hooks
const mockUseLocation = vi.fn();
const mockUseParams = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useLocation: () => mockUseLocation(),
    useParams: () => mockUseParams(),
  };
});

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

// Mock article data
const mockArticle = {
  uri: 'nyt://article/123',
  url: 'https://www.nytimes.com/test-article',
  id: '123',
  title: 'Test Article Title',
  abstract: 'Test article abstract',
  byline: 'By John Doe',
  published_date: '2025-04-13',
  section: 'Tech',
  media: [
    {
      'media-metadata': [
        {
          url: 'test-image.jpg',
          format: 'mediumThreeByTwo440',
          height: 440,
          width: 660,
        },
      ],
      caption: 'Test Caption',
      copyright: '© 2025 NYT',
    },
  ],
  des_facet: ['Technology', 'Science'],
};

describe('ArticleDetail Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderArticleDetail = () => {
    return render(
      <BrowserRouter>
        <ArticleDetail />
      </BrowserRouter>
    );
  };

  it('shows loading spinner when article is not available', () => {
    mockUseLocation.mockReturnValue({ state: null });
    mockUseParams.mockReturnValue({ id: '123' });
    mockLocalStorage.getItem.mockReturnValue(null);

    renderArticleDetail();

    expect(screen.getByTestId('loader')).toHaveClass('animate-spin');
  });

  it('renders article from location state', () => {
    mockUseLocation.mockReturnValue({ state: { article: mockArticle } });
    mockUseParams.mockReturnValue({ id: '123' });

    renderArticleDetail();

    expect(screen.getByText(mockArticle.title)).toBeInTheDocument();
    expect(screen.getByText(mockArticle.abstract)).toBeInTheDocument();
    expect(screen.getByText(mockArticle.byline)).toBeInTheDocument();
    expect(screen.getByText('Technology')).toBeInTheDocument();
  });

  it('renders article from localStorage when no location state', () => {
    mockUseLocation.mockReturnValue({ state: null });
    mockUseParams.mockReturnValue({ id: '123' });
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockArticle));

    renderArticleDetail();

    expect(screen.getByText(mockArticle.title)).toBeInTheDocument();
  });

  it('renders main image with caption and copyright', () => {
    mockUseLocation.mockReturnValue({ state: { article: mockArticle } });
    mockUseParams.mockReturnValue({ id: '123' });

    renderArticleDetail();

    const image = screen.getByAltText(mockArticle.title);
    expect(image).toHaveAttribute('src', 'test-image.jpg');
    expect(screen.getByText('Test Caption')).toBeInTheDocument();
    expect(screen.getByText('© 2025 NYT')).toBeInTheDocument();
  });

  it('renders related topics correctly', () => {
    mockUseLocation.mockReturnValue({ state: { article: mockArticle } });
    mockUseParams.mockReturnValue({ id: '123' });

    renderArticleDetail();

    expect(screen.getByText('Related Topics')).toBeInTheDocument();
    mockArticle.des_facet.forEach((tag) => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });

  it('formats date correctly', async () => {
    mockUseLocation.mockReturnValue({ state: { article: mockArticle } });
    mockUseParams.mockReturnValue({ id: '123' });

    renderArticleDetail();
    const formattedDate = await screen.findAllByText('Apr 13, 2025');

    expect(formattedDate.length).toBe(2);
  });

  it('renders read more link correctly', () => {
    mockUseLocation.mockReturnValue({ state: { article: mockArticle } });
    mockUseParams.mockReturnValue({ id: '123' });

    renderArticleDetail();

    const link = screen.getByText('Read Full Article on NY Times');
    expect(link).toHaveAttribute('href', mockArticle.url);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('saves article to localStorage when received from location state', () => {
    mockUseLocation.mockReturnValue({ state: { article: mockArticle } });
    mockUseParams.mockReturnValue({ id: '123' });

    renderArticleDetail();

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'article',
      JSON.stringify(mockArticle)
    );
  });
});
