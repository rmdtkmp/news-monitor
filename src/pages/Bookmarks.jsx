import React, { useState, useEffect } from 'react';
import NewsCard from '../components/NewsCard.jsx';
import useThemeStore from '../store/themeStore.js';
import DataService from '../api/dataService.js';

const Bookmarks = () => {
  const { theme } = useThemeStore();
  const [bookmarks, setBookmarks] = useState([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const isDark = theme === 'dark';

  useEffect(() => {
    loadBookmarks();
  }, []);

  useEffect(() => {
    filterAndSortBookmarks();
  }, [bookmarks, searchQuery, sortBy]);

  const loadBookmarks = () => {
    const savedBookmarks = DataService.getBookmarks();
    setBookmarks(savedBookmarks);
    setFilteredBookmarks(savedBookmarks);
    setLoading(false);
  };

  const filterAndSortBookmarks = () => {
    let filtered = [...bookmarks];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(b => 
        b.title?.toLowerCase().includes(q) ||
        b.description?.toLowerCase().includes(q) ||
        b.source?.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.bookmarkedAt || b.published) - new Date(a.bookmarkedAt || a.published));
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.bookmarkedAt || a.published) - new Date(b.bookmarkedAt || b.published));
    } else if (sortBy === 'title') {
      filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    }

    setFilteredBookmarks(filtered);
  };

  const handleRemoveBookmark = (id) => {
    DataService.removeBookmark(id);
    loadBookmarks();
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to remove all bookmarks?')) {
      DataService.saveBookmarks([]);
      loadBookmarks();
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        <div className="inline-block animate-spin">📚</div>
        <p className="mt-2">Loading bookmarks...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            📚 Bookmarks ({bookmarks.length})
          </h1>
          <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Your saved articles for later reading
          </p>
        </div>

        {bookmarks.length > 0 && (
          <button
            onClick={handleClearAll}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isDark 
                ? 'bg-red-900 text-red-200 hover:bg-red-800' 
                : 'bg-red-100 text-red-700 hover:bg-red-200'
            }`}
          >
            🗑️ Clear All
          </button>
        )}
      </div>

      {bookmarks.length === 0 ? (
        <div className={`text-center py-12 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="text-5xl mb-4">📄</div>
          <h2 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            No bookmarks yet
          </h2>
          <p className={`mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Save interesting articles by clicking the 📌 button on any news card
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
            <div>
              <label className={`text-sm font-semibold mb-2 block ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Search Bookmarks
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search your bookmarks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg text-sm pl-10 ${
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

            <div>
              <label className={`text-sm font-semibold mb-2 block ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Sort By
              </label>
              <div className="flex flex-wrap gap-2">
                {['newest', 'oldest', 'title'].map(option => (
                  <button
                    key={option}
                    onClick={() => setSortBy(option)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      sortBy === option 
                        ? 'bg-blue-600 text-white' 
                        : isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {option === 'newest' ? 'Newest First' : option === 'oldest' ? 'Oldest First' : 'Title A-Z'}
                  </button>
                ))}
              </div>
            </div>

            {searchQuery && (
              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Found {filteredBookmarks.length} of {bookmarks.length} bookmarks
              </div>
            )}
          </div>

          <div className={`rounded-lg overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            {filteredBookmarks.map((bookmark, index) => (
              <div key={bookmark.id} className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} last:border-0`}>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-lg font-bold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {bookmark.title}
                      </h3>
                      <div className={`flex items-center gap-2 mt-1 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        <span>{bookmark.source}</span>
                        <span>•</span>
                        <span>Saved {formatDate(bookmark.bookmarkedAt)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveBookmark(bookmark.id)}
                      className={`ml-2 p-2 rounded-full hover:opacity-80 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                      title="Remove bookmark"
                    >
                      🗑️
                    </button>
                  </div>
                  <p className={`text-sm line-clamp-2 mb-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {bookmark.description}
                  </p>
                  <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center text-sm font-medium ${
                      isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                    }`}
                    onClick={() => DataService.addToHistory(bookmark)}
                  >
                    Read Article →
                  </a>
                </div>
              </div>
            ))}
          </div>

          {filteredBookmarks.length === 0 && searchQuery && (
            <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              No bookmarks found for "{searchQuery}"
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Bookmarks;
