import React, { useState } from 'react';
import useThemeStore from '../store/themeStore.js';
import DataService from '../api/dataService.js';

const NewsCard = ({ article }) => {
  const { theme } = useThemeStore();
  const [isBookmarked, setIsBookmarked] = useState(DataService.isBookmarked(article.id));
  
  const isDark = theme === 'dark';

  const getSentimentColor = (sentiment) => {
    switch(sentiment) {
      case 'positive': return isDark ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800';
      case 'negative': return isDark ? 'bg-red-800 text-red-200' : 'bg-red-100 text-red-800';
      default: return isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800';
    }
  };

  const getAgeBadgeColor = (daysOld) => {
    if (daysOld === undefined || daysOld === null) return '';
    if (daysOld <= 1) return isDark ? 'bg-blue-700 text-blue-200' : 'bg-blue-100 text-blue-800';
    if (daysOld <= 3) return isDark ? 'bg-purple-700 text-purple-200' : 'bg-purple-100 text-purple-800';
    if (daysOld <= 7) return isDark ? 'bg-orange-700 text-orange-200' : 'bg-orange-100 text-orange-800';
    return isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700';
  };

  const formatAge = (daysOld) => {
    if (daysOld === undefined || daysOld === null) return null;
    if (daysOld === 0) return 'Today';
    if (daysOld === 1) return '1 day ago';
    return `${daysOld} days ago`;
  };

  const formatDate = (date) => {
    const now = new Date();
    const articleDate = new Date(date);
    const diffMs = now - articleDate;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    
    return articleDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isBookmarked) {
      DataService.removeBookmark(article.id);
    } else {
      DataService.addBookmark(article);
    }
    setIsBookmarked(!isBookmarked);
  };

  const handleClick = () => {
    DataService.addToHistory(article);
  };

  const daysOld = article.daysOld;

  return (
    <a 
      href={article.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className={`block rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 ${isDark ? 'bg-gray-800 text-white' : 'bg-white'}`}
      onClick={handleClick}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={article.image} 
          alt={article.title} 
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2 flex space-x-1">
          <button
            onClick={handleBookmark}
            className={`p-2 rounded-full ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-md`}
            title={isBookmarked ? "Remove bookmark" : "Bookmark article"}
          >
            {isBookmarked ? '🔖' : '📌'}
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white">{article.source}</span>
            <div className="flex items-center space-x-1">
              {daysOld !== undefined && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${getAgeBadgeColor(daysOld)}`}>
                  {formatAge(daysOld)}
                </span>
              )}
              <span className={`text-xs px-2 py-1 rounded-full ${getSentimentColor(article.sentiment)}`}>
                {article.sentiment}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold mb-2 line-clamp-2 hover:text-blue-400">{article.title}</h3>
        <p className={`text-sm mb-3 line-clamp-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{article.description}</p>
        <div className="flex items-center justify-between text-xs">
          <div className={`flex items-center space-x-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <span>{article.country}</span>
            <span>•</span>
            <span>{formatDate(article.published)}</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`flex items-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
              </svg>
              {article.mentions}
            </span>
            <span className={`flex items-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
              {article.engagement}
            </span>
          </div>
        </div>
      </div>
    </a>
  );
};

export default NewsCard;
