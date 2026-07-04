import React, { useState, useMemo, useEffect } from 'react';
import NewsCard from '../components/NewsCard.jsx';
import { NewsGridSkeleton } from '../components/LoadingSkeletons.jsx';
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
  const [suggestions] = useState(['technology', 'economy', 'politics', 'sports', 'health', 'business']);

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

  const showSuggestions = searchQuery && !filteredArticles.length;
  const isDark = theme === 'dark';

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
  };

  return (
    <div className="space-y-6">
      <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>📰 News Monitoring</h1>
        <div className="relative w-full sm:w-80">
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

      {loading && <NewsGridSkeleton />}

      {!loading && showSuggestions && (
        <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Search suggestions
          </h3>
          <div className="flex flex-wrap gap-2">
            {suggestions.map(s => (
              <button
                key={s}
                onClick={() => handleSuggestionClick(s)}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                  isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {!loading && !showSuggestions && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map(article => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      )}

      {!loading && !showSuggestions && filteredArticles.length === 0 && (
        <div className={`text-center py-12 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="text-5xl mb-4">🔍</div>
          <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            No articles found
          </h3>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            Try searching with different keywords
          </p>
        </div>
      )}
    </div>
  );
};

export default NewsFeed;
