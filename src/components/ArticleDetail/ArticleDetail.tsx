import { useLocation, useParams } from 'react-router-dom';
import React, { useEffect } from 'react';

const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = React.useState<Article | null>(null);
  const loaction = useLocation() as LocationState;

  useEffect(() => {
    if (loaction.state?.article) {
      setArticle(loaction.state.article);
      localStorage.setItem('article', JSON.stringify(loaction.state.article));
    } else {
      const storedArticle = localStorage.getItem('article');
      if (storedArticle) {
        setArticle(JSON.parse(storedArticle));
      }
    }
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (!article) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div
          data-testid="loader"
          className="animate-spin rounded-full h-[400px] w-[400px] border-b-2 border-gray-900"
        />
      </div>
    );
  }

  const mainImage = article.media[0]?.['media-metadata'].find(
    (meta) => meta.format === 'mediumThreeByTwo440'
  );

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Header Section */}
      <header className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span>{article.section}</span>
          <span>•</span>
          <time>{formatDate(article.published_date)}</time>
        </div>
        <h1 className="text-4xl font-serif font-bold mb-4">{article.title}</h1>
        <p className="text-xl text-gray-700 mb-4">{article.abstract}</p>
        <div className="flex items-center gap-4 text-sm">
          <span className="font-medium">{article.byline}</span>
        </div>
      </header>

      {/* Main Image */}
      {mainImage && (
        <figure className="mb-8">
          <img
            src={mainImage.url}
            alt={article.title}
            className="w-full h-auto rounded-lg"
          />
          {article.media[0]?.caption && (
            <figcaption className="mt-2 text-sm text-gray-600">
              {article.media[0].caption}
              {article.media[0].copyright && (
                <span className="text-gray-500">
                  {' '}
                  {article.media[0].copyright}
                </span>
              )}
            </figcaption>
          )}
        </figure>
      )}

      {/* Keywords/Tags */}
      <div className="my-8">
        <h2 className="text-sm font-semibold text-gray-600 mb-2">
          Related Topics
        </h2>
        <div className="flex flex-wrap gap-2">
          {article.des_facet?.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Additional Information */}
      <footer className="mt-8 pt-8 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <p className="font-semibold">Published</p>
            <p>{formatDate(article.published_date)}</p>
          </div>
          <div>
            <p className="font-semibold">Section</p>
            <p>{article.section}</p>
          </div>
        </div>
      </footer>

      {/* Read More Link */}
      <div className="mt-8">
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Read Full Article on NY Times
        </a>
      </div>
    </article>
  );
};

export default ArticleDetail;
