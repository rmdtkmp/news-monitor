// Mock data for news articles
export const mockNewsArticles = [
  {
    id: 1,
    title: "Major Tech Summit Concludes in Singapore",
    source: "Reuters",
    region: "SEA",
    country: "Singapore",
    category: "Technology",
    sentiment: "positive",
    published: new Date(Date.now() - 2 * 60 * 60 * 1000),
    url: "#",
    image: "https://via.placeholder.com/300x200?text=Tech+Summit",
    description: "Leading tech companies announce new initiatives in Southeast Asia",
    mentions: 1245,
    engagement: 3200
  },
  {
    id: 2,
    title: "Indonesia's Economy Grows Faster Than Expected",
    source: "Bloomberg",
    region: "Indonesia",
    country: "Indonesia",
    category: "Economy",
    sentiment: "positive",
    published: new Date(Date.now() - 4 * 60 * 60 * 1000),
    url: "#",
    image: "https://via.placeholder.com/300x200?text=Economy",
    description: "Q2 GDP figures exceed analyst expectations with 5.1% growth",
    mentions: 892,
    engagement: 2150
  },
  {
    id: 3,
    title: "Regional Trade Agreement Signed",
    source: "AP News",
    region: "Asia",
    country: "Multiple",
    category: "Politics",
    sentiment: "neutral",
    published: new Date(Date.now() - 6 * 60 * 60 * 1000),
    url: "#",
    image: "https://via.placeholder.com/300x200?text=Trade",
    description: "10 Asian nations finalize historic trade framework",
    mentions: 756,
    engagement: 1890
  },
  {
    id: 4,
    title: "Bangkok Hosts International Climate Conference",
    source: "BBC",
    region: "SEA",
    country: "Thailand",
    category: "Environment",
    sentiment: "positive",
    published: new Date(Date.now() - 8 * 60 * 60 * 1000),
    url: "#",
    image: "https://via.placeholder.com/300x200?text=Climate",
    description: "World leaders discuss climate action targets for 2030",
    mentions: 543,
    engagement: 1420
  },
  {
    id: 5,
    title: "Philippine Tech Startup Raises Series B Funding",
    source: "TechCrunch",
    region: "SEA",
    country: "Philippines",
    category: "Technology",
    sentiment: "positive",
    published: new Date(Date.now() - 10 * 60 * 60 * 1000),
    url: "#",
    image: "https://via.placeholder.com/300x200?text=Startup",
    description: "$50M funding round signals investor confidence in Southeast Asian tech",
    mentions: 634,
    engagement: 1789
  },
  {
    id: 6,
    title: "Global Markets React to Central Bank Decisions",
    source: "Financial Times",
    region: "Global",
    country: "Multiple",
    category: "Finance",
    sentiment: "negative",
    published: new Date(Date.now() - 12 * 60 * 60 * 1000),
    url: "#",
    image: "https://via.placeholder.com/300x200?text=Markets",
    description: "Asian markets drop 2% following unexpected policy announcements",
    mentions: 1089,
    engagement: 2534
  },
  {
    id: 7,
    title: "Vietnam Becomes Manufacturing Hub",
    source: "Reuters",
    region: "SEA",
    country: "Vietnam",
    category: "Business",
    sentiment: "positive",
    published: new Date(Date.now() - 14 * 60 * 60 * 1000),
    url: "#",
    image: "https://via.placeholder.com/300x200?text=Manufacturing",
    description: "Foreign direct investment in manufacturing reaches record highs",
    mentions: 723,
    engagement: 1956
  },
  {
    id: 8,
    title: "Indonesia Launches Digital Payment Initiative",
    source: "Jakarta Post",
    region: "Indonesia",
    country: "Indonesia",
    category: "Technology",
    sentiment: "positive",
    published: new Date(Date.now() - 16 * 60 * 60 * 1000),
    url: "#",
    image: "https://via.placeholder.com/300x200?text=Digital",
    description: "Government backs fintech expansion to boost financial inclusion",
    mentions: 445,
    engagement: 1123
  }
];

// Mock data for social media mentions
export const mockSocialMentions = [
  {
    id: 1,
    platform: "Twitter",
    author: "@TechNewsAsia",
    text: "Breaking: New tech hub announced in Singapore with $500M investment",
    sentiment: "positive",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    likes: 2340,
    retweets: 1200,
    region: "SEA",
    topic: "Technology"
  },
  {
    id: 2,
    platform: "LinkedIn",
    author: "Business Daily",
    text: "Indonesia's startup ecosystem continues to attract global investors",
    sentiment: "positive",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    likes: 5600,
    retweets: 890,
    region: "Indonesia",
    topic: "Startup"
  },
  {
    id: 3,
    platform: "Twitter",
    author: "@AsiaEconomics",
    text: "Mixed signals from Asian markets as investors await clarity",
    sentiment: "neutral",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    likes: 1240,
    retweets: 567,
    region: "Asia",
    topic: "Finance"
  },
  {
    id: 4,
    platform: "Facebook",
    author: "Asian News Network",
    text: "Historic trade deal brings hope for regional cooperation",
    sentiment: "positive",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    likes: 8900,
    retweets: 3400,
    region: "Global",
    topic: "Trade"
  },
  {
    id: 5,
    platform: "Twitter",
    author: "@ClimateAction",
    text: "Bangkok climate conference shows renewed commitment to sustainability",
    sentiment: "positive",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    likes: 3450,
    retweets: 2100,
    region: "SEA",
    topic: "Environment"
  }
];

// Mock analytics data
export const mockAnalyticsData = {
  dailyStats: [
    { date: "Jul 01", articles: 245, mentions: 3400, positive: 1800, negative: 800, neutral: 800 },
    { date: "Jul 02", articles: 289, mentions: 4100, positive: 2200, negative: 950, neutral: 950 },
    { date: "Jul 03", articles: 267, mentions: 3800, positive: 2050, negative: 900, neutral: 850 },
    { date: "Jul 04", articles: 312, mentions: 4500, positive: 2400, negative: 1050, neutral: 1050 }
  ],
  regionStats: [
    { region: "Indonesia", articles: 145, mentions: 2340, engagement: 5600 },
    { region: "SEA", articles: 234, mentions: 3890, engagement: 8900 },
    { region: "Asia", articles: 189, mentions: 3120, engagement: 6780 },
    { region: "Global", articles: 298, mentions: 4560, engagement: 10240 }
  ],
  sourceStats: [
    { source: "Reuters", articles: 89, reach: 45000 },
    { source: "Bloomberg", articles: 76, reach: 42000 },
    { source: "AP News", articles: 65, reach: 38000 },
    { source: "BBC", articles: 58, reach: 35000 },
    { source: "TechCrunch", articles: 54, reach: 32000 }
  ],
  topTopics: [
    { topic: "Technology", count: 145, trend: "up" },
    { topic: "Economy", count: 98, trend: "up" },
    { topic: "Politics", count: 76, trend: "down" },
    { topic: "Environment", count: 64, trend: "up" },
    { topic: "Finance", count: 89, trend: "down" }
  ]
};

// Helper functions
export const getArticlesByRegion = (region) => {
  if (region === "all") return mockNewsArticles;
  return mockNewsArticles.filter(article => article.region === region);
};

export const getTrendingTopics = () => {
  return mockAnalyticsData.topTopics.slice(0, 5);
};

export const getSentimentDistribution = (articles = mockNewsArticles) => {
  const positive = articles.filter(a => a.sentiment === "positive").length;
  const negative = articles.filter(a => a.sentiment === "negative").length;
  const neutral = articles.filter(a => a.sentiment === "neutral").length;
  
  return { positive, negative, neutral };
};
