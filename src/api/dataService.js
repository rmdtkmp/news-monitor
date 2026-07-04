import NewsService, { REGIONS } from './newsService.js';
import RSSService from './rssService.js';

class DataService {
  constructor() {
    this.storageKey = 'newsmonitor_data';
    this.bookmarksKey = 'newsmonitor_bookmarks';
    this.settingsKey = 'newsmonitor_settings';
    this.historyKey = 'newsmonitor_history';
    this.initSettings();
  }

  initSettings() {
    if (!this.getSettings()) {
      const defaultSettings = {
        theme: 'light',
        notifications: true,
        regions: ['Global', 'Indonesia', 'SEA'],
        autoRefresh: true,
        refreshInterval: 300000, // 5 minutes
        showImages: true,
        defaultView: 'dashboard',
        language: 'en',
        dateRange: '7days', // 7-day crawling default
        useTopHeadlines: true,
        useEverythingEndpoint: true
      };
      this.saveSettings(defaultSettings);
    }
  }

  async fetchNews(region = 'Global', category = 'general', useAPI = true, useRSS = true) {
    const articles = [];
    const settings = this.getSettings();
    
    if (useAPI) {
      const regionConfig = REGIONS[region];
      if (regionConfig) {
        let apiArticles = [];
        
        // Check which endpoints to use
        if (settings?.useTopHeadlines !== false) {
          const headlines = await Promise.all(
            regionConfig.countries.map(country => 
              NewsService.getTopHeadlines(country, category)
            )
          );
          apiArticles.push(...headlines.flat());
        }
        
        // Use /everything endpoint for 7-day historical data
        if (settings?.useEverythingEndpoint !== false && (settings?.dateRange === '7days' || settings?.dateRange === 'all')) {
          for (const country of regionConfig.countries) {
            try {
              const everythingArticles = await NewsService.getArticlesFromLastSevenDays(country, category);
              apiArticles.push(...everythingArticles);
            } catch (error) {
              console.log(`7-day crawl failed for ${country}, using headlines only`);
            }
          }
        }
        
        articles.push(...apiArticles);
      }
    }

    if (useRSS) {
      const rssArticles = await RSSService.getFeedsForRegion(region);
      articles.push(...rssArticles);
    }

    // Remove duplicates based on URL
    const uniqueArticles = [];
    const seenUrls = new Set();
    
    for (const article of articles) {
      if (article && article.url && !seenUrls.has(article.url)) {
        seenUrls.add(article.url);
        uniqueArticles.push(article);
      }
    }

    // Sort by date (newest first)
    return uniqueArticles.sort((a, b) => new Date(b.published) - new Date(a.published));
  }

  async fetchAllNews(regions = ['Global', 'Indonesia', 'SEA']) {
    const allArticles = [];
    
    for (const region of regions) {
      const articles = await this.fetchNews(region, 'general');
      allArticles.push(...articles);
    }

    return allArticles.sort((a, b) => new Date(b.published) - new Date(a.published));
  }

  async searchAll(query, region = 'Global') {
    try {
      const apiResults = await NewsService.searchArticles(query, REGIONS[region]?.code || 'us', 'relevancy', 7);
      const allArticles = [];
      
      for (const regionKey of Object.keys(REGIONS)) {
        const rssResults = await RSSService.getFeedsForRegion(regionKey);
        const filtered = rssResults.filter(item => 
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase())
        );
        allArticles.push(...filtered);
      }
      
      return [...apiResults, ...allArticles].sort((a, b) => new Date(b.published) - new Date(a.published));
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  }

  // Data persistence methods
  getStoredData(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }

  saveStoredData(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  }

  // Bookmarks
  getBookmarks() {
    return this.getStoredData(this.bookmarksKey) || [];
  }

  saveBookmarks(bookmarks) {
    return this.saveStoredData(this.bookmarksKey, bookmarks);
  }

  addBookmark(article) {
    const bookmarks = this.getBookmarks();
    if (!bookmarks.some(b => b.id === article.id)) {
      bookmarks.unshift({
        ...article,
        bookmarkedAt: new Date().toISOString()
      });
      return this.saveBookmarks(bookmarks.slice(0, 100)); // Keep only 100 most recent
    }
    return false;
  }

  removeBookmark(articleId) {
    const bookmarks = this.getBookmarks();
    const filtered = bookmarks.filter(b => b.id !== articleId);
    return this.saveBookmarks(filtered);
  }

  isBookmarked(articleId) {
    const bookmarks = this.getBookmarks();
    return bookmarks.some(b => b.id === articleId);
  }

  // Settings
  getSettings() {
    return this.getStoredData(this.settingsKey);
  }

  saveSettings(settings) {
    return this.saveStoredData(this.settingsKey, settings);
  }

  updateSettings(newSettings) {
    const currentSettings = this.getSettings();
    const updated = { ...currentSettings, ...newSettings };
    return this.saveSettings(updated);
  }

  // History
  addToHistory(article) {
    const history = this.getStoredData(this.historyKey) || [];
    history.unshift({
      ...article,
      viewedAt: new Date().toISOString()
    });
    // Keep only last 50 viewed articles
    return this.saveStoredData(this.historyKey, history.slice(0, 50));
  }

  getHistory() {
    return this.getStoredData(this.historyKey) || [];
  }

  clearHistory() {
    localStorage.removeItem(this.historyKey);
  }

  // Cache management
  clearAllCache() {
    NewsService.clearCache();
    RSSService.clearCache();
    // Don't clear bookmarks and settings
    console.log('All caches cleared');
  }

  // Statistics with 7-day focus
  getReadingStats() {
    const history = this.getHistory();
    const bookmarks = this.getBookmarks();
    
    // Calculate 7-day stats
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentHistory = history.filter(item => new Date(item.viewedAt) >= sevenDaysAgo);
    const recentBookmarks = bookmarks.filter(item => new Date(item.bookmarkedAt) >= sevenDaysAgo);
    
    return {
      totalArticlesRead: history.length,
      recentArticlesRead: recentHistory.length,
      totalBookmarks: bookmarks.length,
      recentBookmarks: recentBookmarks.length,
      favoriteSource: this.getFavoriteSource(history),
      readingTime: this.calculateReadingTime(history)
    };
  }

  getFavoriteSource(history) {
    if (!history.length) return null;
    const sourceCount = {};
    history.forEach(article => {
      sourceCount[article.source] = (sourceCount[article.source] || 0) + 1;
    });
    return Object.keys(sourceCount).reduce((a, b) => sourceCount[a] > sourceCount[b] ? a : b);
  }

  calculateReadingTime(history) {
    const avgReadingTimePerArticle = 3; // minutes
    return history.length * avgReadingTimePerArticle;
  }

  // Article age analysis
  getArticleAgeDistribution(articles) {
    const distribution = {
      last24h: 0,
      last3d: 0,
      last7d: 0,
      older: 0
    };

    const now = new Date();
    
    articles.forEach(article => {
      const publishDate = new Date(article.published);
      const diffMs = now.getTime() - publishDate.getTime();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);
      
      if (diffDays <= 1) distribution.last24h++;
      else if (diffDays <= 3) distribution.last3d++;
      else if (diffDays <= 7) distribution.last7d++;
      else distribution.older++;
    });

    return distribution;
  }
}

export default new DataService();
