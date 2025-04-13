import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import ArticleItem from '../components//ArticleList/ArticleItem';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock article data
const mockArticle = {
  uri: 'nyt://article/123',
  id: '123',
  title: 'Test Article Title',
  abstract: 'Test article abstract text',
  byline: 'By John Doe',
  published_date: '2025-04-13',
  section: 'Technology',
  media: [
    {
      'media-metadata': [
        {
          url: 'test-image.jpg',
          format: 'mediumThreeByTwo210',
          height: 140,
          width: 210,
        },
      ],
    },
  ],
  des_facet: ['Tech', 'Science', 'Innovation'],
};

const renderArticleItem = (article = mockArticle) => {
  return render(
    <BrowserRouter>
      <ArticleItem article={article} />
    </BrowserRouter>
  );
};

describe('ArticleItem Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders article details correctly', () => {
    renderArticleItem();

    expect(screen.getByText('Test Article Title')).toBeInTheDocument();
    expect(screen.getByText('Test article abstract text')).toBeInTheDocument();
    expect(screen.getByText('By John Doe')).toBeInTheDocument();
    expect(screen.getByText('Apr 13, 2025')).toBeInTheDocument();
  });

  it('navigates to article detail page on click', () => {
    renderArticleItem();

    const articleCard = screen.getByText('Test Article Title').closest('div');
    fireEvent.click(articleCard!);

    expect(mockNavigate).toHaveBeenCalledWith(
      '/article/123',
      expect.objectContaining({
        state: { article: mockArticle },
      })
    );
  });

  it('renders thumbnail image when available', () => {
    renderArticleItem();

    const image = screen.getByAltText('Test Article Title');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'test-image.jpg');
  });

  it('shows "No image available" when thumbnail is missing', () => {
    const articleWithoutImage = {
      ...mockArticle,
      media: [],
    };
    renderArticleItem(articleWithoutImage);

    expect(screen.getByText('No image available')).toBeInTheDocument();
  });

  it('renders section badge correctly', () => {
    renderArticleItem();

    expect(screen.getByText('Technology')).toBeInTheDocument();
    expect(screen.getByText('Technology').className).toContain('bg-blue-600');
  });

  it('renders up to 3 keywords', () => {
    renderArticleItem();

    const keywords = mockArticle.des_facet.slice(0, 3);
    keywords.forEach((keyword) => {
      expect(screen.getByText(keyword)).toBeInTheDocument();
    });
  });

  it('handles missing des_facet gracefully', () => {
    const articleWithoutTags = {
      ...mockArticle,
      des_facet: undefined,
    };
    renderArticleItem(articleWithoutTags);

    // Ensure the component still renders without tags
    expect(screen.getByText('Test Article Title')).toBeInTheDocument();
  });

  it('formats date correctly', () => {
    renderArticleItem();

    expect(screen.getByText('Apr 13, 2025')).toBeInTheDocument();
  });
});
