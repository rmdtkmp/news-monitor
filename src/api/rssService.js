// Browser-compatible RSS/XML feed parser using native DOMParser
export const RSS_FEEDS = {
  Global: [
    { name: 'BBC News', url: 'https://feeds.bbci.co.uk/news/rss.xml', region: 'Global' },
    { name: 'CNN', url: 'https://rss.cnn.com/rss/edition.rss', region: 'Global' },
    { name: 'Reuters', url: 'https://www.reutersagency.com/feed/', region: 'Global' }
  ],
  Indonesia: [
    { name: 'Jakarta Post', url: 'https://www.thejakartapost.com/feed', region: 'Indonesia' },
    { name: 'Kompas', url: 'https://rss.kompas.com/feed', region: 'Indonesia' },
    { name: 'detikNews', url: 'https://www.detik.com/rss', region: 'Indonesia' }
  ],
  SEA: [
    { name: 'Channel NewsAsia', url: 'https://www.channelnewsasia.com/api/v1/rss/latest/rss.xml', region: 'SEA' },
    { name: 'Bangkok Post', url: 'https://www.bangkokpost.com/rss/world.xml', region: 'SEA' }
  ],
  Asia: [
    { name: 'SCMP', url: 'https://www.scmp.com/rss/latest/feed', region: 'Asia' },
    { name: 'Japan Times', url: 'https://www.japantimes.co.jp/feed/', region: 'Asia' },
    { name: 'The Hindu', url: 'https://www.thehindu.com/feeds/default.rss', region: 'Asia' }
  ],
  Europe: [
    { name: 'The Guardian', url: 'https://www.theguardian.com/international/rss', region: 'Europe' },
    { name: 'DW News', url: 'https://www.dw.com/en/feed/rss/world', region: 'Europe' },
    { name: 'Euronews', url: 'https://www.euronews.com/feed/rss', region: 'Europe' }
  ],
  Americas: [
    { name: 'NY Times', url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml', region: 'Americas' },
    { name: 'Folha', url: 'https://feeds.folha.uol.com.br/mundo/rss091.xml', region: 'Americas' },
    { name: 'Globo', url: 'https://www.globo.com/rss', region: 'Americas' }
  ],
  MiddleEast: [
    { name: 'Al Jazeera', url: 'https://www.aljazeera.com/xml/rss/all.xml', region: 'MiddleEast' },
    { name: 'Times of Israel', url: 'https://www.timesofisrael.com/feed/', region: 'MiddleEast' },
    { name: 'Gulf News', url: 'https://gulfnews.com/rss', region: 'MiddleEast' }
  ],
  Africa: [
    { name: 'Daily Maverick', url: 'https://www.dailymaverick.co.za/feed/', region: 'Africa' },
    { name: 'The Citizen', url: 'https://www.citizen.co.za/feed/', region: 'Africa' },
    { name: 'Nation Africa', url: 'https://nation.africa/rss', region: 'Africa' }
  ]
};

const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

class RSSService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 10 * 60 * 1000; // 10 minutes
  }

  async fetchXML(url) {
    try {
      const response = await fetch(CORS_PROXY + encodeURIComponent(url));
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.text();
    } catch (err) {
      // Fallback: try directly
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.text();
      } catch (err2) {
        throw new Error(`Failed to fetch: ${url}`);
      }
    }
  }

  parseRSS(xmlText) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, 'text/xml');
    
    const items = doc.querySelectorAll('item');
    const channel = doc.querySelector('channel');
    const feedTitle = channel?.querySelector('title')?.textContent || 'Unknown Feed';

    return Array.from(items).map(item => {
      const getTag = (tag) => item.querySelector(tag)?.textContent || '';
      const getTagAttr = (tag, attr) => item.querySelector(tag)?.getAttribute(attr) || '';
      
      return {
        title: getTag('title'),
        description: getTag('description'),
        link: getTag('link'),
        pubDate: getTag('pubDate'),
        creator: getTag('creator') || getTag('author'),
        categories: Array.from(item.querySelectorAll('category')).map(c => c.textContent),
        mediaContent: getTagAttr('media:content', 'url') || getTagAttr('enclosure', 'url'),
        feedTitle
      };
    });
  }

  parseAtom(xmlText) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, 'text/xml');
    
    const entries = doc.querySelectorAll('entry');
    const feedTitle = doc.querySelector('feed > title')?.textContent || 'Unknown Feed';

    return Array.from(entries).map(entry => {
      const getTag = (tag) => entry.querySelector(tag)?.textContent || '';
      const getLink = () => {
        const link = entry.querySelector('link[href]');
        return link?.getAttribute('href') || '';
      };
      const getMedia = () => {
        const media = entry.querySelector('media\\:content, content');
        return media?.getAttribute('url') || '';
      };

      return {
        title: getTag('title'),
        description: getTag('summary') || getTag('content'),
        link: getLink(),
        pubDate: getTag('published') || getTag('updated'),
        creator: getTag('author > name'),
        categories: Array.from(entry.querySelectorAll('category')).map(c => c.getAttribute('term') || c.textContent),
        mediaContent: getMedia(),
        feedTitle
      };
    });
  }

  parseFeed(xmlText) {
    if (!xmlText || xmlText.trim().length === 0) return [];

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(xmlText, 'text/xml');
      
      // Check for parser errors
      const parserError = doc.querySelector('parsererror');
      if (parserError) {
        console.warn('XML parse error:', parserError.textContent);
        return [];
      }

      // Detect RSS vs Atom
      if (doc.querySelector('rss')) {
        return this.parseRSS(xmlText);
      } else if (doc.querySelector('feed')) {
        return this.parseAtom(xmlText);
      }
    } catch (err) {
      console.error('Feed parse error:', err);
    }
    return [];
  }

  itemToArticle(item, feedConfig) {
    const cleanDesc = (item.description || '')
      .replace(/<[^>]+>/g, '')
      .replace(/&[^;]+;/g, ' ')
      .trim()
      .slice(0, 200);

    return {
      id: item.link || `${feedConfig.name}_${Date.now()}`,
      title: item.title || 'No title',
      source: item.feedTitle || feedConfig.name,
      region: feedConfig.region,
      country: feedConfig.region,
      category: item.categories?.[0] || 'general',
      sentiment: this.analyzeSentiment((item.title || '') + ' ' + cleanDesc),
      published: new Date(item.pubDate || Date.now()),
      url: item.link || '#',
      image: item.mediaContent || `https://via.placeholder.com/300x200?text=${encodeURIComponent(feedConfig.name)}`,
      description: cleanDesc || 'No description available',
      content: item.description || '',
      mentions: Math.floor(Math.random() * 1000) + 100,
      engagement: Math.floor(Math.random() * 5000) + 500,
      feedType: 'rss'
    };
  }

  async getFeedsForRegion(region) {
    const feeds = RSS_FEEDS[region] || [];
    const cacheKey = `rss_${region}`;

    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    const allArticles = [];

    for (const feed of feeds) {
      try {
        const xml = await this.fetchXML(feed.url);
        const items = this.parseFeed(xml);
        const articles = items.slice(0, 10).map(item => this.itemToArticle(item, feed));
        allArticles.push(...articles);
      } catch (err) {
        console.warn(`Failed to fetch ${feed.name}: ${err.message}`);
      }
    }

    allArticles.sort((a, b) => new Date(b.published) - new Date(a.published));

    this.cache.set(cacheKey, { data: allArticles, timestamp: Date.now() });
    return allArticles;
  }

  async getAllFeeds() {
    const allArticles = [];
    const regions = Object.keys(RSS_FEEDS);
    
    for (const region of regions) {
      const articles = await this.getFeedsForRegion(region);
      allArticles.push(...articles);
    }

    return allArticles.sort((a, b) => new Date(b.published) - new Date(a.published));
  }

  analyzeSentiment(text) {
    const positiveWords = ['good','great','excellent','amazing','positive','growth','increase','success','gain','profit','win','launch','breakthrough'];
    const negativeWords = ['bad','terrible','negative','loss','decrease','decline','failure','crisis','crash','poor','war','conflict','crisis'];
    
    const textLower = text.toLowerCase();
    const posCount = positiveWords.filter(w => textLower.includes(w)).length;
    const negCount = negativeWords.filter(w => textLower.includes(w)).length;
    
    if (posCount > negCount) return 'positive';
    if (negCount > posCount) return 'negative';
    return 'neutral';
  }

  clearCache() {
    this.cache.clear();
  }
}

export default new RSSService();
