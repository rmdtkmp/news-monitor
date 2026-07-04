const platforms = ['Twitter', 'LinkedIn', 'Reddit', 'Facebook', 'Instagram'];
const sentiments = ['positive', 'neutral', 'negative'];
const regions = ['Global', 'Indonesia', 'SEA', 'Asia', 'Europe', 'Americas', 'Africa', 'MiddleEast'];

const topics = ['Technology', 'Politics', 'Economy', 'Health', 'Environment', 'Sports', 'Entertainment', 'Science'];

const hashtagPool = [
  '#technews', '#AI', '#Indonesia', '#ASEAN', '#AsiaPacific', '#DigitalTransformation',
  '#Startup', '#Economy', '#Politics', '#ClimateAction', '#Innovation', '#Investment',
  '#Cybersecurity', '#Sustainability', '#GlobalTrade', '#HealthTech', '#Fintech', '#Ecommerce',
  '#Blockchain', '#DataScience', '#NetZero', '#RenewableEnergy', '#SupplyChain', '#SmartCity',
  '#MICE', '#Tourism', '#Manufacturing', '#Agriculture', '#Education', '#Healthcare',
  '#DigitalEconomy', '#GreenTech', '#BigData', '#IoT', '#5G', '#CloudComputing',
  '#AIforGood', '#DigitalInclusion', '#WomenInTech', '#FutureOfWork', '#RemoteWork',
  '#DigitalHealth', '#EdTech', '#AgriTech', '#FoodTech', '#CleanEnergy'
];

const templates = [
  'Exciting developments in {topic} across {region} today! {hashtag}',
  'Breaking: New {topic} initiative launched in {region}. {hashtag}',
  '{region} leads the way in {topic} innovation. {hashtag} {hashtag}',
  'Report: {topic} sector grows 15% in {region}. {hashtag}',
  'Experts discuss future of {topic} at {region} summit. {hashtag}',
  'Big announcement: {topic} partnership between {region} companies. {hashtag}',
  '{region} invests billions in {topic} infrastructure. {hashtag} {hashtag}',
  'New study shows {topic} impact in {region}. {hashtag}',
  '{region} ranks top in {topic} readiness index. {hashtag}',
  'Startup ecosystem booming in {region}: {topic} edition. {hashtag}'
];

const authors = {
  Indonesia: ['@detikcom', '@kompascom', '@tribunnews', '@tempo_english', '@JakartaPost', '@liputan6'],
  SEA: ['@ChannelNewsAsia', '@TheStarOnline', '@PhilstarNews', '@BangkokPost', '@VnExpressNews'],
  Asia: ['@SCMPNews', '@NikkeiAsia', '@TheHindu', '@JapanTimes', '@KoreaHerald'],
  Global: ['@Reuters', '@AP', '@BBCWorld', '@CNN', '@FinancialTimes', '@Bloomberg'],
  Europe: ['@TheGuardian', '@lemondefr', '@DWNews', '@ElPais', '@Corriere'],
  Americas: ['@nytimes', '@washingtonpost', '@globo', '@Folha'],
  Africa: ['@MailAndGuardian', '@NationAfrica', '@DailyMaverick', '@TheCitizen'],
  MiddleEast: ['@AlJazeera', '@TimesofIsrael', '@GulfNews', '@ArabNews']
};

export default class SocialCrawlerService {
  constructor() {
    this.posts = [];
  }

  _sample(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  _generateText(topic, region) {
    const template = this._sample(templates);
    const hashtags = Array.from({ length: 2 + Math.floor(Math.random() * 3) }, () => this._sample(hashtagPool));
    const text = template
      .replace(/{topic}/g, topic)
      .replace(/{region}/g, region)
      .replace(/{hashtag}/g, () => hashtags.shift());

    // Extract unique hashtags
    const matchedHashtags = text.match(/#\w+/g) || [];
    return { text, hashtags: [...new Set(matchedHashtags)] };
  }

  generatePosts(hoursBack = 48, postsPerHour = 4) {
    const now = Date.now();
    const totalPosts = hoursBack * postsPerHour;
    const posts = [];

    for (let i = 0; i < totalPosts; i++) {
      const region = this._sample(regions);
      const topic = this._sample(topics);
      const platform = this._sample(platforms);
      const sentiment = this._sample(sentiments);
      const { text, hashtags } = this._generateText(topic, region);

      const authorPool = authors[region] || authors['Global'];
      const author = this._sample(Array.isArray(authorPool) ? authorPool : authors['Global']);

      const timestamp = new Date(now - Math.random() * hoursBack * 60 * 60 * 1000);

      posts.push({
        id: `social_${i}`,
        platform,
        author: typeof author === 'string' && author.startsWith('@') ? author : `@${author}`,
        text,
        hashtags,
        sentiment,
        timestamp,
        region,
        topic,
        likes: Math.floor(Math.random() * 15000) + 50,
        retweets: Math.floor(Math.random() * 5000) + 10,
        comments: Math.floor(Math.random() * 2000) + 5
      });
    }

    return posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  getTrendingHashtags(posts, limit = 15) {
    const tagCount = {};
    posts.forEach(p => {
      (p.hashtags || []).forEach(tag => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    });
    return Object.entries(tagCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([tag, count]) => ({ tag, count }));
  }

  getTopicDistribution(posts) {
    const topicCount = {};
    posts.forEach(p => {
      topicCount[p.topic] = (topicCount[p.topic] || 0) + 1;
    });
    return Object.entries(topicCount)
      .sort((a, b) => b[1] - a[1])
      .map(([topic, count]) => ({ topic, count, percentage: (count / posts.length * 100).toFixed(1) }));
  }

  getPlatformBreakdown(posts) {
    const breakdown = {};
    posts.forEach(p => {
      breakdown[p.platform] = (breakdown[p.platform] || 0) + 1;
    });
    return Object.entries(breakdown).map(([platform, count]) => ({ platform, count }));
  }

  getHourlyVolume(posts) {
    const hourly = {};
    const now = Date.now();
    for (let h = 0; h < 48; h++) {
      const start = new Date(now - (h + 1) * 60 * 60 * 1000);
      const end = new Date(now - h * 60 * 60 * 1000);
      const label = `${String(start.getHours()).padStart(2, '0')}:00`;

      hourly[label] = posts.filter(p => {
        const t = new Date(p.timestamp);
        return t >= start && t < end;
      }).length;
    }
    return Object.entries(hourly).map(([hour, count]) => ({ hour, count }));
  }

  getTopAuthors(posts, limit = 8) {
    const authorCount = {};
    posts.forEach(p => {
      const key = `${p.author} (${p.platform})`;
      authorCount[key] = (authorCount[key] || 0) + 1;
    });
    return Object.entries(authorCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([author, count]) => ({ author, count }));
  }
}
