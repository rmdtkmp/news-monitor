import React, { useState, useMemo } from 'react';
import NewsCard from '../components/NewsCard.jsx';
import { mockNewsArticles } from '../data/mockData.js';

const NewsFeed = () => {
  const [activeRegion, setActiveRegion] = useState("all");
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const regions = ["all", "Global", "Asia", "SEA", "Indonesia"];
  const categories = ["all", "Technology", "Economy", "Politics", "Finance", "Business", "Environment"];

  const filteredArticles = useMemo(() => {
    let articles = mockNewsArticles;
    if (activeRegion !== "all") {
      articles = articles.filter(a => a.region === activeRegion);
    }
    if (activeCategory !== "all") {
      articles = articles.filter(a => a.category === activeCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      articles = articles.filter(a => 
        a.title.toLowerCase().includes(q) || 
        a.description.toLowerCase().includes(q) ||
        a.source.toLowerCase().includes(q)
      );
    }
    return articles;
  }, [activeRegion, activeCategory, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <h1 className="text-2xl font-bold">News Monitoring</h1>
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm pl-10 bg-white shadow-sm"
          />
          <svg className="w-4 h-4 absolute left-3 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {regions.map(region => (
          <button
            key={region}
            onClick={() => setActiveRegion(region)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeRegion === region 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {region === "all" ? "All Regions" : region === "SEA" ? "Southeast Asia" : region}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              activeCategory === cat 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat === "all" ? "All Categories" : cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map(article => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No articles found matching your filters.
        </div>
      )}
    </div>
  );
};

export default NewsFeed;
