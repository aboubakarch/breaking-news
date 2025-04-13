import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ArticleItemProps {
  article: Article;
}

const ArticleItem: React.FC<ArticleItemProps> = ({ article }) => {
  const navigate = useNavigate();

  const thumbnail = article.media[0]?.['media-metadata'].find(
    (meta) => meta.format === 'mediumThreeByTwo210'
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
      onClick={() => navigate(`/article/${article.id}`, { state: { article } })}
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        {thumbnail ? (
          <img
            src={thumbnail.url}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
        {/* Category Badge */}
        {article.section && (
          <span className="absolute top-4 left-4 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
            {article.section}
          </span>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 flex-grow flex flex-col">
        {/* Title */}
        <h3 className="font-bold text-lg mb-2 line-clamp-2 hover:text-blue-600">
          {article.title}
        </h3>

        {/* Abstract */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {article.abstract}
        </p>

        {/* Keywords */}
        <div className="flex flex-wrap gap-1 mb-4">
          {article.des_facet?.slice(0, 3).map((keyword, index) => (
            <span
              key={index}
              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
            >
              {keyword}
            </span>
          ))}
        </div>

        {/* Footer Section */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            {/* Author */}
            <span className="line-clamp-1">{article.byline}</span>
            {/* Date */}
            <span>{formatDate(article.published_date)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleItem;
