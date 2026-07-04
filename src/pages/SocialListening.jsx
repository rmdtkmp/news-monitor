import React, { useState, useMemo } from 'react';
import PostCard from '../components/PostCard.jsx';
import { mockSocialMentions } from '../data/mockData.js';

const SocialListening = () => {
  const [activeRegion, setActiveRegion] = useState("all");
  const [activeTopic, setActiveTopic] = useState("all");
  const [activeSentiment, setActiveSentiment] = useState("all");

  const regions = ["all", "Global", "Asia", "SEA", "Indonesia"];
  const topics = ["all", "Technology", "Startup", "Finance", "Trade", "Environment"];
  const sentiments = ["all", "positive", "neutral", "negative"];

  const filteredPosts = useMemo(() => {
    let posts = mockSocialMentions;
    if (activeRegion !== "all") {
      posts = posts.filter(p => p.region === activeRegion);
    }
    if (activeTopic !== "all") {
      posts = posts.filter(p => p.topic === activeTopic);
    }
    if (activeSentiment !== "all") {
      posts = posts.filter(p => p.sentiment === activeSentiment);
    }
    return posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [activeRegion, activeTopic, activeSentiment]);

  const sentimentStats = {
    positive: mockSocialMentions.filter(p => p.sentiment === 'positive').length,
    neutral: mockSocialMentions.filter(p => p.sentiment === 'neutral').length,
    negative: mockSocialMentions.filter(p => p.sentiment === 'negative').length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Social Media Listening</h1>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md p-4 text-white">
          <div className="text-3xl font-bold">{sentimentStats.positive}</div>
          <div className="text-sm opacity-80">Positive Sentiment</div>
        </div>
        <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl shadow-md p-4 text-white">
          <div className="text-3xl font-bold">{sentimentStats.neutral}</div>
          <div className="text-sm opacity-80">Neutral Sentiment</div>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-md p-4 text-white">
          <div className="text-3xl font-bold">{sentimentStats.negative}</div>
          <div className="text-sm opacity-80">Negative Sentiment</div>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-sm font-semibold text-gray-600 mb-2 block">Region</label>
          <div className="flex flex-wrap gap-2">
            {regions.map(region => (
              <button
                key={region}
                onClick={() => setActiveRegion(region)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeRegion === region 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {region === "all" ? "All Regions" : region === "SEA" ? "SEA" : region}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-600 mb-2 block">Topic</label>
          <div className="flex flex-wrap gap-2">
            {topics.map(topic => (
              <button
                key={topic}
                onClick={() => setActiveTopic(topic)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeTopic === topic 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {topic === "all" ? "All Topics" : topic}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-600 mb-2 block">Sentiment</label>
          <div className="flex flex-wrap gap-2">
            {sentiments.map(sentiment => (
              <button
                key={sentiment}
                onClick={() => setActiveSentiment(sentiment)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeSentiment === sentiment 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {sentiment === "all" ? "All Sentiments" : sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {filteredPosts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No posts found matching your filters.
        </div>
      )}
    </div>
  );
};

export default SocialListening;
