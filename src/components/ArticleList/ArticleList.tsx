import useArticles from '../../hooks/useArticles';
import React from 'react';
import ArticleItem from './ArticleItem';

const ArticleList: React.FC = () => {
  const { loading, articles, error } = useArticles();

  console.log('List of articles', articles);

  if (loading) {
    return (
      <div className="flex relative justify-center items-center h-screen">
        <div className="absolute animate-pulse">
          <img
            className="w-[100px] h-[100px] object-contain mb-4"
            src="https://1000logos.net/wp-content/uploads/2017/04/Symbol-New-York-Times.png"
            alt="logo"
          />
          <p>Loading...</p>
        </div>
        <div className="animate-spin rounded-full h-[400px] w-[400px] border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8 text-center">
        NY Times Most Popular Articles
      </h2>
      <div
        data-testid="list-article"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
      >
        {articles?.map((article: Article) => (
          <ArticleItem key={article.uri} article={article} />
        ))}
      </div>
    </div>
  );
};

export default ArticleList;
