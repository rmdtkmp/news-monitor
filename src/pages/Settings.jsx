import React, { useState, useEffect } from 'react';
import useThemeStore from '../store/themeStore.js';
import DataService from '../api/dataService.js';
import { REGIONS } from '../api/newsService.js';

const Settings = () => {
  const { theme, toggleTheme } = useThemeStore();
  const [settings, setSettings] = useState(DataService.getSettings());
  const [regions, setRegions] = useState(['Global', 'Indonesia', 'SEA']);
  const [loading, setLoading] = useState(true);

  const isDark = theme === 'dark';

  useEffect(() => {
    const savedSettings = DataService.getSettings();
    setSettings(savedSettings);
    setRegions(savedSettings?.regions || ['Global', 'Indonesia', 'SEA']);
    setLoading(false);
  }, []);

  const handleChange = (key, value) => {
    const updated = { ...settings, [key]: value };
    DataService.updateSettings(updated);
    setSettings(updated);
  };

  const toggleRegion = (region) => {
    const newRegions = regions.includes(region) 
      ? regions.filter(r => r !== region)
      : [...regions, region];
    setRegions(newRegions);
    handleChange('regions', newRegions);
  };

  const clearAllData = () => {
    if (window.confirm('This will clear bookmarks, history, and settings. Continue?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  if (loading) {
    return (
      <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        <div className="inline-block animate-spin">⚙️</div>
        <p className="mt-2">Loading settings...</p>
      </div>
    );
  }

  const stats = DataService.getReadingStats();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          ⚙️ Application Settings
        </h1>
        <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Customize your News Monitor experience
        </p>
      </div>

      {/* Theme Settings */}
      <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          🎨 Appearance
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Dark Mode
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Toggle between light and dark themes
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              theme === 'dark'
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
      </div>

      {/* Content Settings */}
      <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          📰 Content Settings
        </h2>

        <div className="space-y-4">
          <div>
            <h3 className={`font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Default Regions
            </h3>
            <p className={`text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Select regions to display by default in the dashboard
            </p>
            <div className="flex flex-wrap gap-2">
              {Object.keys(REGIONS).map(region => (
                <button
                  key={region}
                  onClick={() => toggleRegion(region)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    regions.includes(region)
                      ? 'bg-blue-600 text-white'
                      : isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Show Images
              </h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Display article thumbnails
              </p>
            </div>
            <button
              onClick={() => handleChange('showImages', !settings.showImages)}
              className={`w-12 h-6 rounded-full relative transition-colors ${
                settings.showImages ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                settings.showImages ? 'left-7' : 'left-1'
              }`}></div>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Auto-Refresh
              </h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Automatically refresh data every 5 minutes
              </p>
            </div>
            <button
              onClick={() => handleChange('autoRefresh', !settings.autoRefresh)}
              className={`w-12 h-6 rounded-full relative transition-colors ${
                settings.autoRefresh ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                settings.autoRefresh ? 'left-7' : 'left-1'
              }`}></div>
            </button>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          🔔 Notifications
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Enable Notifications
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Receive alerts for breaking news and trending topics
            </p>
          </div>
          <button
            onClick={() => handleChange('notifications', !settings.notifications)}
            className={`w-12 h-6 rounded-full relative transition-colors ${
              settings.notifications ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
              settings.notifications ? 'left-7' : 'left-1'
            }`}></div>
          </button>
        </div>
      </div>

      {/* Data Settings */}
      <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          💾 Data & Storage
        </h2>
        <div className="space-y-3">
          <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Bookmarks
              </span>
              <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {stats.totalBookmarks} articles
              </span>
            </div>
          </div>

          <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Reading History
              </span>
              <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {stats.totalArticlesRead} articles
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={clearAllData}
            className="w-full bg-red-900 text-red-200 hover:bg-red-800 font-medium py-3 px-4 rounded-lg transition-colors"
          >
            🗑️ Clear All Data (Bookmarks + History + Settings)
          </button>
        </div>
      </div>

      {/* About Section */}
      <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          ℹ️ About
        </h2>
        <div className={`text-sm space-y-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          <p><strong>News Monitor v2.1</strong></p>
          <p>A Progressive Web App for global news monitoring and social listening.</p>
          <p>
            <strong>GitHub:</strong>{' '}
            <a
              href="https://github.com/rmdtkmp/news-monitor"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              github.com/rmdtkmp/news-monitor
            </a>
          </p>
          <p className="text-xs opacity-60">
            Data from NewsAPI.org and RSS feeds. Shows last 7 days of publications.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
