import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import NewsCard from '../components/NewsCard.jsx';
import PostCard from '../components/PostCard.jsx';
import useThemeStore from '../store/themeStore.js';
import DataService from '../api/dataService.js';
import { REGIONS } from '../api/newsService.js';

const StatCard = ({ label, value, icon, color }) => (
  <div className={`${color} rounded-xl p-4 text-white shadow-md`}>
    <div className="flex items-center justify-between mb-2">
      <span className="text-3xl">{icon}</span>
    </div>
    <div className="text-2xl font-bold">{value.toLocaleString()}</div>
    <div className="text-sm opacity-80">{label}</div>
  </div>
);

const Dashboard = () => {
  const { theme } = useThemeStore();
  const [selectedRegion, setSelectedRegion] = useState("Global");
  const [selectedCategory, setSelectedCategory] = useState("general");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    articlesToday: 0,
    mentions: 0,
    engagement: 0,
    sources: 0
  });

  const isDark = theme === 'dark';
  const regions = Object.keys(REGIONS);
  const categories = ['general', 'business', 'technology', 'entertainment', 'health', 'science'];

  useEffect(() => {
    fetchDashboardData();
    
    // Set up auto-refresh every 5 minutes
    const interval = setInterval(fetchDashboardData, 300000);
    return () => clearInterval(interval);
  }, [selectedRegion, selectedCategory]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const data = await DataService.fetchNews(selectedRegion, selectedCategory);
      setArticles(data);
      
      // Calculate stats
      setStats({
        articlesToday: data.length,
        mentions: data.reduce((sum, a) => sum + (a.mentions || 0), 0),
        engagement: data.reduce((sum, a) => sum + (a.engagement || 0), 0),
        sources: new Set(data.map(a => a.source)).size
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    }
    setLoading(false);
  };

  const trending = [
    { topic: "Technology", count: 145, trend: "up" },
    { topic: "Economy", count: 98, trend: "up" },
    { topic: "Politics", count: 76, trend: "down" },
    { topic: "Environment", count: 64, trend: "up" },
    { topic: "Finance", count: 89, trend: "down" }
  ];

  const statCards = [
    { label: "Articles Today", value: stats.articlesToday, icon: "📰", color: "bg-gradient-to-br from-blue-500 to-blue-600" },
    { label: "Social Mentions", value: stats.mentions, icon: "💬", color: "bg-gradient-to-br from-purple-500 to-purple-600" },
    { label: "Total Engagement", value: stats.engagement, icon: "🔥", color: "bg-gradient-to-br from-orange-500 to-orange-600" },
    { label: "Sources Tracked", value: stats.sources, icon: "🌐", color: "bg-gradient-to-br from-green-500 to-green-600" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Dashboard Overview</h1>
        <div className="flex gap-2">
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className={`px-3 py-2 border rounded-lg text-sm shadow-sm ${
              isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
            }`}
          >
            {regions.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`px-3 py-2 border rounded-lg text-sm shadow-sm ${
              isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
            }`}
          >
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className={`rounded-xl shadow-md p-4 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Latest News</h2>
              <Link to="/news" className="text-blue-400 text-sm hover:underline">View All</Link>
            </div>
            
            {loading ? (
              <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <div className="inline-block animate-spin">⏳</div>
                <p className="mt-2">Loading articles...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {articles.slice(0, 4).map(article => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className={`rounded-xl shadow-md p-4 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Trending Topics</h2>
              <Link to="/analytics" className="text-blue-400 text-sm hover:underline">Details</Link>
            </div>
            <div className="space-y-3">
              {trending.map((topic, i) => (
                <div key={i} className={`flex items-center justify-between p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{topic.topic}</span>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{topic.count} posts</span>
                    <span className={`text-xs ${topic.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                      {topic.trend === 'up' ? '↑' : '↓'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`rounded-xl shadow-md p-4 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Quick Stats</h2>
            </div>
            <div className="space-y-2 text-sm">
              <div className={`flex justify-between ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <span>Last Updated:</span>
                <span>{new Date().toLocaleTimeString()}</span>
              </div>
              <div className={`flex justify-between ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <span>Region:</span>
                <span>{selectedRegion}</span>
              </div>
              <div className={`flex justify-between ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <span>Category:</span>
                <span>{selectedCategory}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
