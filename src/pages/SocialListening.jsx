import React, { useState, useEffect, useMemo } from 'react';
import PostCard from '../components/PostCard.jsx';
import SocialCrawlerService from '../api/socialCrawlerService';
import useThemeStore from '../store/themeStore';

const socialCrawler = new SocialCrawlerService();

const TrendingHashtags = ({ hashtags, onSelect }) => (
  <div className="flex flex-wrap gap-2">
    {hashtags.map(({ tag, count }) => (
      <button
        key={tag}
        onClick={() => onSelect(tag)}
        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors hover:opacity-80 ${
          count > 100 ? 'bg-blue-100 text-blue-800' :
          count > 50 ? 'bg-indigo-100 text-indigo-800' :
          'bg-gray-100 text-gray-800'
        }`}
      >
        {tag} <span className="ml-1 opacity-60">{count}</span>
      </button>
    ))}
  </div>
);

const SocialListening = () => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeRegion, setActiveRegion] = useState("all");
  const [activeTopic, setActiveTopic] = useState("all");
  const [activeSentiment, setActiveSentiment] = useState("all");
  const [searchHashtag, setSearchHashtag] = useState('');

  const topics = ["all", "Technology", "Politics", "Economy", "Health", "Environment", "Sports", "Entertainment", "Science"];
  const sentiments = ["all", "positive", "neutral", "negative"];
  const regions = ["all", "Global", "Indonesia", "SEA", "Asia", "Europe", "Americas", "Africa", "MiddleEast"];

  useEffect(() => {
    const posts = socialCrawler.generatePosts(48, 5);
    setAllPosts(posts);
    setLoading(false);
  }, []);

  const filteredPosts = useMemo(() => {
    let posts = allPosts;
    if (activeRegion !== "all") posts = posts.filter(p => p.region === activeRegion);
    if (activeTopic !== "all") posts = posts.filter(p => p.topic === activeTopic);
    if (activeSentiment !== "all") posts = posts.filter(p => p.sentiment === activeSentiment);
    if (searchHashtag) posts = posts.filter(p => (p.hashtags || []).some(h => h.toLowerCase().includes(searchHashtag.toLowerCase())));
    return posts;
  }, [allPosts, activeRegion, activeTopic, activeSentiment, searchHashtag]);

  const trendingHashtags = useMemo(() => socialCrawler.getTrendingHashtags(filteredPosts, 20), [filteredPosts]);
  const sentimentStats = useMemo(() => ({
    positive: filteredPosts.filter(p => p.sentiment === 'positive').length,
    neutral: filteredPosts.filter(p => p.sentiment === 'neutral').length,
    negative: filteredPosts.filter(p => p.sentiment === 'negative').length
  }), [filteredPosts]);

  const totalInteractions = useMemo(() =>
    filteredPosts.reduce((s, p) => s + p.likes + p.retweets + p.comments, 0),
    [filteredPosts]
  );

  const handleHashtagSelect = (tag) => {
    setSearchHashtag(tag.startsWith('#') ? tag.slice(1) : tag);
  };

  if (loading) {
    return (
      <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        <div className="inline-block animate-spin text-2xl">💬</div>
        <p className="mt-2">Crawling social conversations (last 48 hours)...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Social Media Listening</h1>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Last 48 hours · {allPosts.length} posts · {trendingHashtags.length} unique hashtags
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-3 text-white">
            <div className="text-2xl font-bold">{sentimentStats.positive}</div>
            <div className="text-xs opacity-80">Positive</div>
          </div>
          <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl p-3 text-white">
            <div className="text-2xl font-bold">{sentimentStats.neutral}</div>
            <div className="text-xs opacity-80">Neutral</div>
          </div>
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-3 text-white">
            <div className="text-2xl font-bold">{sentimentStats.negative}</div>
            <div className="text-xs opacity-80">Negative</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-3 text-white">
            <div className="text-2xl font-bold">{filteredPosts.length}</div>
            <div className="text-xs opacity-80">Total Posts</div>
          </div>
        </div>

        <div className={`p-3 rounded-lg mb-4 ${isDark ? 'bg-gray-700' : 'bg-blue-50'}`}>
          <h3 className={`text-sm font-semibold mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
            🔥 Trending Hashtags ({trendingHashtags.length})
          </h3>
          <TrendingHashtags hashtags={trendingHashtags.slice(0, 15)} onSelect={handleHashtagSelect} />
          <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Click a hashtag to filter posts · {searchHashtag && `Filtering: #${searchHashtag}`}
          </p>
        </div>

        {searchHashtag && (
          <div className={`flex items-center gap-2 text-sm mb-3 ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
            <span>🔍 Filtered by: #{searchHashtag}</span>
            <button onClick={() => setSearchHashtag('')} className="underline hover:no-underline">Clear</button>
          </div>
        )}
      </div>

      <div className={`p-4 rounded-lg space-y-3 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className={`text-xs font-semibold block mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Region</label>
            <div className="flex flex-wrap gap-1">
              {regions.map(r => (
                <button key={r} onClick={() => setActiveRegion(r)}
                  className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                    activeRegion === r ? 'bg-blue-600 text-white'
                      : isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >{r === 'all' ? 'All' : r}</button>
              ))}
            </div>
          </div>
          <div>
            <label className={`text-xs font-semibold block mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Topic</label>
            <div className="flex flex-wrap gap-1">
              {topics.map(t => (
                <button key={t} onClick={() => setActiveTopic(t)}
                  className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                    activeTopic === t ? 'bg-blue-600 text-white'
                      : isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >{t}</button>
              ))}
            </div>
          </div>
          <div>
            <label className={`text-xs font-semibold block mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Sentiment</label>
            <div className="flex flex-wrap gap-1">
              {sentiments.map(s => (
                <button key={s} onClick={() => setActiveSentiment(s)}
                  className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                    activeSentiment === s ? 'bg-blue-600 text-white'
                      : isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >{s}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center justify-between mb-3">
          <h2 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            💬 Posts ({filteredPosts.length})
          </h2>
          <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {totalInteractions.toLocaleString()} total interactions
          </span>
        </div>
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
          {filteredPosts.slice(0, 50).map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
        {filteredPosts.length === 0 && (
          <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            No posts found matching your filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialListening;
