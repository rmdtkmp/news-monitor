import React, { useState, useEffect } from 'react';
import useThemeStore from '../store/themeStore.js';
import DataService from '../api/dataService.js';

const History = () => {
  const { theme } = useThemeStore();
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState('all');

  const isDark = theme === 'dark';

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    filterHistory();
  }, [history, searchQuery, filterBy]);

  const loadHistory = () => {
    const savedHistory = DataService.getHistory();
    setHistory(savedHistory);
    setLoading(false);
  };

  const filterHistory = () => {
    let filtered = [...history];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(h => 
        h.title?.toLowerCase().includes(q) ||
        h.description?.toLowerCase().includes(q) ||
        h.source?.toLowerCase().includes(q)
      );
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    if (filterBy === 'today') {
      filtered = filtered.filter(h => new Date(h.viewedAt) >= today);
    } else if (filterBy === 'week') {
      filtered = filtered.filter(h => new Date(h.viewedAt) >= weekAgo);
    } else if (filterBy === 'month') {
      filtered = filtered.filter(h => new Date(h.viewedAt) >= monthAgo);
    }

    setFilteredHistory(filtered);
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all reading history?')) {
      DataService.clearHistory();
      loadHistory();
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatFullDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const groupByDate = (items) => {
    const groups = {};
    const today = new Date();
    const todayStr = today.toDateString();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    items.forEach(item => {
      const date = new Date(item.viewedAt);
      const dateStr = date.toDateString();
      
      let label;
      if (dateStr === todayStr) {
        label = 'Today';
      } else if (dateStr === yesterdayStr) {
        label = 'Yesterday';
      } else {
        label = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
      }

      if (!groups[label]) groups[label] = [];
      groups[label].push(item);
    });

    return groups;
  };

  const groupedHistory = groupByDate(filteredHistory);

  if (loading) {
    return (
      <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        <div className="inline-block animate-spin">📖</div>
        <p className="mt-2">Loading history...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            📖 Reading History ({history.length})
          </h1>
          <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Articles you've read recently
          </p>
        </div>
        {history.length > 0 && (
          <button
            onClick={handleClearHistory}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isDark 
                ? 'bg-red-900 text-red-200 hover:bg-red-800' 
                : 'bg-red-100 text-red-700 hover:bg-red-200'
            }`}
          >
            🗑️ Clear History
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className={`text-center py-12 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="text-5xl mb-4">📰</div>
          <h2 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            No reading history yet
          </h2>
          <p className={`mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Start reading articles to build your history
          </p>
          <a 
            href="/news" 
            className={`inline-block px-4 py-2 rounded-lg font-medium ${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors`}
          >
            Browse News →
          </a>
        </div>
      ) : (
        <>
          <div className={`p-4 rounded-lg space-y-3 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={`text-sm font-semibold mb-2 block ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Search History
                </label>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg text-sm ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>
              <div>
                <label className={`text-sm font-semibold mb-2 block ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Time Range
                </label>
                <div className="flex flex-wrap gap-2">
                  {['all', 'today', 'week', 'month'].map(range => (
                    <button
                      key={range}
                      onClick={() => setFilterBy(range)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        filterBy === range 
                          ? 'bg-blue-600 text-white' 
                          : isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {range === 'all' ? 'All Time' : range === 'today' ? 'Today' : range === 'week' ? 'This Week' : 'This Month'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {searchQuery && (
              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Found {filteredHistory.length} articles
              </div>
            )}
          </div>

          {Object.entries(groupedHistory).map(([dateLabel, items]) => (
            <div key={dateLabel} className={`rounded-lg overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <div className={`px-4 py-2 border-b ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <h3 className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-700'}`}>
                  {dateLabel} ({items.length})
                </h3>
              </div>
              {items.map((item, index) => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block p-4 border-b ${isDark ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'} last:border-0 transition-colors`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <h4 className={`font-medium text-sm line-clamp-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {item.title}
                    </h4>
                    <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'} ml-2 whitespace-nowrap`}>
                      {formatDate(item.viewedAt)}
                    </span>
                  </div>
                  <div className={`flex items-center gap-2 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    <span>{item.source}</span>
                    <span>•</span>
                    <span title={formatFullDate(item.viewedAt)}>
                      {formatFullDate(item.viewedAt)}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          ))}

          {filteredHistory.length === 0 && searchQuery && (
            <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              No articles found for "{searchQuery}"
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default History;
