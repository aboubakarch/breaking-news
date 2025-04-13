import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ArticleList from '../components/ArticleList/ArticleList';
import useArticles from '../hooks/useArticles';
import { vi } from 'vitest';

vi.mock('../hooks/useArticles');

// Mock data
const mockArticles = [
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
            height: 140,
            width: 210,
          },
        ],
      },
    ],
    des_facet: ['Test Tag'],
  },
];

const renderArticleList = () => {
  return render(
    <BrowserRouter>
      <ArticleList />
    </BrowserRouter>
  );
};

describe('ArticleList Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state correctly', () => {
    useArticles.mockReturnValue({
      loading: true,
      articles: [],
      error: null,
    });

    renderArticleList();

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByAltText('logo')).toBeInTheDocument();
    expect(screen.getByAltText('logo')).toHaveAttribute(
      'src',
      'https://1000logos.net/wp-content/uploads/2017/04/Symbol-New-York-Times.png'
    );
  });

  it('renders error state correctly', () => {
    const errorMessage = 'Failed to fetch articles';
    useArticles.mockReturnValue({
      loading: false,
      articles: [],
      error: errorMessage,
    });

    renderArticleList();

    expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
  });

  it('renders articles list correctly', () => {
    useArticles.mockReturnValue({
      loading: false,
      articles: mockArticles,
      error: null,
    });

    renderArticleList();

    // Check header
    expect(
      screen.getByText('NY Times Most Popular Articles')
    ).toBeInTheDocument();

    // Check if grid container exists
    const gridContainer = screen.getByTestId('list-article');
    expect(gridContainer).toHaveClass(
      'grid-cols-2',
      'md:grid-cols-3',
      'lg:grid-cols-5'
    );

    // Check if article is rendered
    expect(screen.getByText('Test Article')).toBeInTheDocument();
  });

  it('renders empty list when no articles available', () => {
    (useArticles as vi.Mock).mockReturnValue({
      loading: false,
      articles: [],
      error: null,
    });

    renderArticleList();

    expect(
      screen.getByText('NY Times Most Popular Articles')
    ).toBeInTheDocument();
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
  });

  it('handles null articles gracefully', () => {
    (useArticles as vi.Mock).mockReturnValue({
      loading: false,
      articles: null,
      error: null,
    });

    renderArticleList();

    expect(
      screen.getByText('NY Times Most Popular Articles')
    ).toBeInTheDocument();
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
  });
});
