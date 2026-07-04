import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import NewsCard from '../components/NewsCard.jsx';
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
  const [dateRange, setDateRange] = useState("7days");
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
  const dateRanges = [
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
    { value: '90days', label: 'Last 90 Days' },
    { value: '100days', label: 'Last 100 Days' }
  ];

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 300000);
    return () => clearInterval(interval);
  }, [selectedRegion, selectedCategory, dateRange]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const days = parseInt(dateRange.replace('days', '')) || 7;
      const data = days > 7 
        ? await DataService.fetchNewsExtended(selectedRegion, days, selectedCategory)
        : await DataService.fetchNews(selectedRegion, selectedCategory);
      
      setArticles(data);
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

  // Article age distribution
  const ageDistribution = useMemo(() => {
    return DataService.getArticleAgeDistribution(articles);
  }, [articles]);

  const dateRangeLabel = dateRange.replace('days', ' Days');
  const extendedStats = DataService.getExtendedReadingStats(parseInt(dateRange.replace('days', '')) || 7);
  const trending = extendedStats.trendingTopics.slice(0, 5).map((t, i) => ({
    ...t,
    trend: i % 2 === 0 ? 'up' : 'down'
  }));

  const statCards = [
    { label: `Articles (${dateRangeLabel})`, value: stats.articlesToday, icon: "📰", color: "bg-gradient-to-br from-blue-500 to-blue-600" },
    { label: "Social Mentions", value: stats.mentions, icon: "💬", color: "bg-gradient-to-br from-purple-500 to-purple-600" },
    { label: "Total Engagement", value: stats.engagement, icon: "🔥", color: "bg-gradient-to-br from-orange-500 to-orange-600" },
    { label: "Sources Tracked", value: stats.sources, icon: "🌐", color: "bg-gradient-to-br from-green-500 to-green-600" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Dashboard Overview</h1>
        <div className="flex flex-wrap gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className={`px-3 py-2 border rounded-lg text-sm shadow-sm ${
              isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
            }`}
          >
            {dateRanges.map(r => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className={`px-3 py-2 border rounded-lg text-sm shadow-sm ${
              isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
            }`}
          >
            {regions.map(r => (
              <option key={r} value={r}>{r === 'SEA' ? 'Southeast Asia' : r}</option>
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

      {/* Article Age Distribution */}
      <div className={`rounded-xl shadow-md p-4 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className={`text-lg font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          📊 Publication Age Distribution {dateRange.replace('days', ' Days')}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <div className={`p-3 rounded-lg ${isDark ? 'bg-blue-900' : 'bg-blue-100'}`}>
            <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-blue-800'}`}>{ageDistribution.last24h}</div>
            <div className={`text-xs ${isDark ? 'text-blue-200' : 'text-blue-700'}`}>Last 24h</div>
          </div>
          <div className={`p-3 rounded-lg ${isDark ? 'bg-purple-900' : 'bg-purple-100'}`}>
            <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-purple-800'}`}>{ageDistribution.last3d}</div>
            <div className={`text-xs ${isDark ? 'text-purple-200' : 'text-purple-700'}`}>Days 2-3</div>
          </div>
          <div className={`p-3 rounded-lg ${isDark ? 'bg-orange-900' : 'bg-orange-100'}`}>
            <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-orange-800'}`}>{ageDistribution.last7d}</div>
            <div className={`text-xs ${isDark ? 'text-orange-200' : 'text-orange-700'}`}>Days 4-7</div>
          </div>
          <div className={`p-3 rounded-lg ${isDark ? 'bg-teal-900' : 'bg-teal-100'}`}>
            <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-teal-800'}`}>{ageDistribution.last30d}</div>
            <div className={`text-xs ${isDark ? 'text-teal-200' : 'text-teal-700'}`}>Days 8-30</div>
          </div>
          <div className={`p-3 rounded-lg ${isDark ? 'bg-indigo-900' : 'bg-indigo-100'}`}>
            <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-indigo-800'}`}>{ageDistribution.last90d}</div>
            <div className={`text-xs ${isDark ? 'text-indigo-200' : 'text-indigo-700'}`}>Days 31-90</div>
          </div>
          <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-700'}`}>{ageDistribution.older}</div>
            <div className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Older</div>
          </div>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      {/* Latest News Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className={`rounded-xl shadow-md p-4 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Latest News ({dateRangeLabel})</h2>
              <Link to="/news" className="text-blue-400 text-sm hover:underline">View All</Link>
            </div>
            
            {loading ? (
              <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <div className="inline-block animate-spin">⏳</div>
                <p className="mt-2">Loading articles from last 7 days...</p>
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

        {/* Trending & Quick Stats */}
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
                <span>Time Range:</span>
                <span className="text-blue-400 font-medium">{dateRangeLabel}</span>
              </div>
              <div className={`flex justify-between ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <span>Articles Read (history):</span>
                <span className="text-blue-400 font-medium">{extendedStats.totalArticlesRead}</span>
              </div>
              <div className={`flex justify-between ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <span>Last Updated:</span>
                <span>{new Date().toLocaleTimeString()}</span>
              </div>
              <div className={`flex justify-between ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <span>Region:</span>
                <span>{selectedRegion === 'SEA' ? 'Southeast Asia' : selectedRegion}</span>
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
