import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import NewsCard from '../components/NewsCard.jsx';
import PostCard from '../components/PostCard.jsx';
import { mockNewsArticles, mockSocialMentions, mockAnalyticsData } from '../data/mockData.js';

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
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredArticles = useMemo(() => {
    let articles = mockNewsArticles;
    if (selectedRegion !== "all") {
      articles = articles.filter(a => a.region === selectedRegion);
    }
    if (selectedCategory !== "all") {
      articles = articles.filter(a => a.category === selectedCategory);
    }
    return articles;
  }, [selectedRegion, selectedCategory]);

  const trending = mockAnalyticsData.topTopics;

  const stats = [
    { label: "Articles Today", value: 312, icon: "📰", color: "bg-gradient-to-br from-blue-500 to-blue-600" },
    { label: "Social Mentions", value: 4500, icon: "💬", color: "bg-gradient-to-br from-purple-500 to-purple-600" },
    { label: "Total Engagement", value: 24560, icon: "🔥", color: "bg-gradient-to-br from-orange-500 to-orange-600" },
    { label: "Sources Tracked", value: 48, icon: "🌐", color: "bg-gradient-to-br from-green-500 to-green-600" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <div className="flex gap-2">
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white shadow-sm"
          >
            <option value="all">All Regions</option>
            <option value="Indonesia">Indonesia</option>
            <option value="SEA">Southeast Asia</option>
            <option value="Asia">Asia</option>
            <option value="Global">Global</option>
          </select>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white shadow-sm"
          >
            <option value="all">All Categories</option>
            <option value="Technology">Technology</option>
            <option value="Economy">Economy</option>
            <option value="Politics">Politics</option>
            <option value="Finance">Finance</option>
            <option value="Environment">Environment</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-4 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Latest News</h2>
              <Link to="/news" className="text-blue-600 text-sm hover:underline">View All</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredArticles.slice(0, 4).map(article => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-xl shadow-md p-4 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Trending Topics</h2>
              <Link to="/analytics" className="text-blue-600 text-sm hover:underline">Details</Link>
            </div>
            <div className="space-y-3">
              {trending.map((topic, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">{topic.topic}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">{topic.count} posts</span>
                    <span className={`text-xs ${topic.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {topic.trend === 'up' ? '↑' : '↓'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Recent Social</h2>
              <Link to="/social" className="text-blue-600 text-sm hover:underline">View All</Link>
            </div>
            <div className="space-y-3">
              {mockSocialMentions.slice(0, 3).map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
