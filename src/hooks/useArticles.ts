import { useEffect, useState } from 'react';
import { fetchMostPopularArticles } from '../api/nytimes';

const useArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getArticles = async () => {
      try {
        const data = await fetchMostPopularArticles();
        setArticles(data);
      } catch (err) {
        setError('Failed to fetch articles');
      } finally {
        setLoading(false);
      }
    };

    getArticles();
  }, []);

  console.log('Articles:', articles);

  return { articles, loading, error };
};

export default useArticles;
