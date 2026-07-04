import React, { useState, useMemo, useEffect } from 'react';
import NewsCard from '../components/NewsCard.jsx';
import useThemeStore from '../store/themeStore.js';
import DataService from '../api/dataService.js';
import { REGIONS } from '../api/newsService.js';

const NewsFeed = () => {
  const { theme } = useThemeStore();
  const [activeRegion, setActiveRegion] = useState("Global");
  const [activeCategory, setActiveCategory] = useState("general");
  const [searchQuery, setSearchQuery] = useState("");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [useAPI, setUseAPI] = useState(true);
  const [useRSS, setUseRSS] = useState(true);

  const regions = Object.keys(REGIONS);
  const categories = ['general', 'business', 'entertainment', 'health', 'science', 'sports', 'technology'];

  useEffect(() => {
    fetchNews();
  }, [activeRegion, activeCategory, useAPI, useRSS]);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await DataService.fetchNews(activeRegion, activeCategory, useAPI, useRSS);
      setArticles(data);
    } catch (err) {
      setError('Failed to load news. Using cached data...');
      console.error(err);
    }
    setLoading(false);
  };

  const filteredArticles = useMemo(() => {
    let filtered = articles;
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(a => 
        a.title.toLowerCase().includes(q) || 
        a.description.toLowerCase().includes(q) ||
        a.source.toLowerCase().includes(q)
      );
    }
    
    return filtered;
  }, [articles, searchQuery]);

  const isDark = theme === 'dark';

  return (
    <div className="space-y-6">
      <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>News Monitoring</h1>
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg text-sm pl-10 shadow-sm ${
              isDark 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
          <svg className={`w-4 h-4 absolute left-3 top-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
      </div>

      {error && (
        <div className={`p-4 rounded-lg ${isDark ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'}`}>
          {error}
        </div>
      )}

      <div className={`p-4 rounded-lg space-y-3 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div>
          <label className={`text-sm font-semibold mb-2 block ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Region</label>
          <div className="flex flex-wrap gap-2">
            {regions.map(region => (
              <button
                key={region}
                onClick={() => setActiveRegion(region)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeRegion === region 
                    ? 'bg-blue-600 text-white' 
                    : isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className={`text-sm font-semibold mb-2 block ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Category</label>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  activeCategory === cat 
                    ? 'bg-blue-600 text-white' 
                    : isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className={`text-sm font-semibold mb-2 block ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Data Sources</label>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={useAPI}
                onChange={(e) => setUseAPI(e.target.checked)}
                className="w-4 h-4"
              />
              <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>News API</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={useRSS}
                onChange={(e) => setUseRSS(e.target.checked)}
                className="w-4 h-4"
              />
              <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>RSS Feeds</span>
            </label>
          </div>
        </div>
      </div>

      {loading && (
        <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          <div className="inline-block animate-spin">⏳</div>
          <p className="mt-2">Loading articles...</p>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map(article => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      )}

      {!loading && filteredArticles.length === 0 && (
        <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          No articles found matching your filters.
        </div>
      )}
    </div>
  );
};

export default NewsFeed;
