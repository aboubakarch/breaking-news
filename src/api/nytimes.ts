import axios from 'axios';

const NYTIMES_API_KEY = '2GXsHw1KJFWGubt6SSXUCmWZYM4cRjo3';
const BASE_URL = 'https://api.nytimes.com/svc';

export const fetchMostPopularArticles = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/mostpopular/v2/viewed/1.json`,
      {
        params: {
          'api-key': NYTIMES_API_KEY,
        },
      }
    );
    return response.data.results;
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }
};
