import axios from 'axios';

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY || 'demo';
const NEWS_API_URL = 'https://newsapi.org/v2';

// Regions mapping with country codes
export const REGIONS = {
  Global: { code: 'us', label: 'Global', countries: ['us', 'gb', 'au'] },
  Indonesia: { code: 'id', label: 'Indonesia', countries: ['id'] },
  SEA: { code: 'ph', label: 'Southeast Asia', countries: ['ph', 'th', 'vn', 'sg', 'my'] },
  Asia: { code: 'cn', label: 'Asia', countries: ['cn', 'in', 'jp', 'kr'] },
  Europe: { code: 'de', label: 'Europe', countries: ['de', 'fr', 'gb', 'it', 'es', 'nl'] },
  Americas: { code: 'us', label: 'Americas', countries: ['us', 'ca', 'br', 'mx'] },
  Africa: { code: 'za', label: 'Africa', countries: ['za', 'eg', 'ng', 'ke'] },
  MiddleEast: { code: 'ae', label: 'Middle East', countries: ['ae', 'sa', 'il', 'tr'] }
};

const categories = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'];

class NewsService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  getDateRange() {
    const today = new Date();
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const formatDate = (date) => date.toISOString().split('T')[0];
    
    return {
      from: formatDate(sevenDaysAgo),
      to: formatDate(today)
    };
  }

  async getArticlesFromLastSevenDays(region = 'us', category = 'general') {
    const cacheKey = `articles_7days_${region}_${category}`;
    
    if (this.cache.has(cacheKey)) {
      const { data, timestamp } = this.cache.get(cacheKey);
      if (Date.now() - timestamp < this.cacheTimeout) {
        return data;
      }
    }

    try {
      const { from, to } = this.getDateRange();
      
      // Build search query for region
      const regionCountries = REGIONS[this.getRegionFromCountry(region)]?.countries || [region];
      const countryCodes = regionCountries.join(' OR ');
      
      const response = await axios.get(`${NEWS_API_URL}/everything`, {
        params: {
          q: 'news',
          countries: countryCodes,
          category: category,
          from: from,
          to: to,
          sortBy: 'publishedAt',
          language: this.getLanguageCode(region),
          apiKey: NEWS_API_KEY,
          pageSize: 100
        },
        timeout: 15000
      });

      const articles = response.data.articles.map(article => ({
        id: article.url,
        title: article.title,
        source: article.source.name,
        region: this.getRegionFromCountry(region),
        country: region.toUpperCase(),
        category: category,
        sentiment: this.analyzeSentiment(article.title + ' ' + (article.description || '')),
        published: new Date(article.publishedAt),
        url: article.url,
        image: article.urlToImage || 'https://via.placeholder.com/300x200?text=News',
        description: article.description || 'No description available',
        content: article.content,
        mentions: Math.floor(Math.random() * 5000),
        engagement: Math.floor(Math.random() * 10000),
        daysOld: this.calculateDaysOld(new Date(article.publishedAt))
      }));

      this.cache.set(cacheKey, { data: articles, timestamp: Date.now() });
      return articles;
    } catch (error) {
      console.error('Error fetching 7-day articles:', error);
      return [];
    }
  }

  async getTopHeadlines(region = 'us', category = 'general') {
    const cacheKey = `headlines_${region}_${category}`;
    
    if (this.cache.has(cacheKey)) {
      const { data, timestamp } = this.cache.get(cacheKey);
      if (Date.now() - timestamp < this.cacheTimeout) {
        return data;
      }
    }

    try {
      const response = await axios.get(`${NEWS_API_URL}/top-headlines`, {
        params: {
          country: region,
          category: category,
          apiKey: NEWS_API_KEY,
          pageSize: 20
        },
        timeout: 10000
      });

      const articles = response.data.articles.map(article => ({
        id: article.url,
        title: article.title,
        source: article.source.name,
        region: this.getRegionFromCountry(region),
        country: region.toUpperCase(),
        category: category,
        sentiment: this.analyzeSentiment(article.title + ' ' + (article.description || '')),
        published: new Date(article.publishedAt),
        url: article.url,
        image: article.urlToImage || 'https://via.placeholder.com/300x200?text=News',
        description: article.description || 'No description available',
        content: article.content,
        mentions: Math.floor(Math.random() * 5000),
        engagement: Math.floor(Math.random() * 10000)
      }));

      this.cache.set(cacheKey, { data: articles, timestamp: Date.now() });
      return articles;
    } catch (error) {
      console.error('Error fetching headlines:', error);
      return [];
    }
  }

  async searchArticles(query, region = 'us', sortBy = 'relevancy', days = 7) {
    try {
      const { from } = this.getDateRange();
      
      const response = await axios.get(`${NEWS_API_URL}/everything`, {
        params: {
          q: query,
          from: from,
          sortBy: sortBy,
          language: this.getLanguageCode(region),
          apiKey: NEWS_API_KEY,
          pageSize: 100,
          page: 1
        },
        timeout: 15000
      });

      return response.data.articles.map(article => ({
        id: article.url,
        title: article.title,
        source: article.source.name,
        region: this.getRegionFromCountry(region),
        country: region.toUpperCase(),
        category: 'search',
        sentiment: this.analyzeSentiment(article.title + ' ' + (article.description || '')),
        published: new Date(article.publishedAt),
        url: article.url,
        image: article.urlToImage || 'https://via.placeholder.com/300x200?text=News',
        description: article.description || 'No description available',
        content: article.content,
        mentions: Math.floor(Math.random() * 5000),
        engagement: Math.floor(Math.random() * 10000),
        daysOld: this.calculateDaysOld(new Date(article.publishedAt))
      }));
    } catch (error) {
      console.error('Error searching articles:', error);
      return [];
    }
  }

  calculateDaysOld(publishDate) {
    const now = new Date();
    const diffMs = now.getTime() - publishDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  analyzeSentiment(text) {
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'positive', 'growth', 'increase', 'success', 'gain', 'profit'];
    const negativeWords = ['bad', 'terrible', 'negative', 'loss', 'decrease', 'decline', 'failure', 'crisis', 'crash', 'poor'];
    
    const textLower = text.toLowerCase();
    const posCount = positiveWords.filter(word => textLower.includes(word)).length;
    const negCount = negativeWords.filter(word => textLower.includes(word)).length;
    
    if (posCount > negCount) return 'positive';
    if (negCount > posCount) return 'negative';
    return 'neutral';
  }

  getRegionFromCountry(country) {
    for (const [region, data] of Object.entries(REGIONS)) {
      if (data.countries.includes(country)) {
        return region;
      }
    }
    return 'Global';
  }

  getLanguageCode(country) {
    const langMap = {
      id: 'id',
      en: 'en',
      default: 'en'
    };
    return langMap[country] || langMap.default;
  }

  getAllCategories() {
    return categories;
  }

  clearCache() {
    this.cache.clear();
  }
}

export default new NewsService();
