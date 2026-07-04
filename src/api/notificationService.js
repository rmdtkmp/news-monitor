class NotificationService {
  constructor() {
    this.permission = Notification.permission;
    this.isSupported = 'Notification' in window && 'serviceWorker' in navigator;
    this.subscribers = new Set();
    this.notificationQueue = [];
  }

  async init() {
    if (!this.isSupported) {
      console.log('Notifications not supported');
      return false;
    }

    try {
      if (Notification.permission === 'default') {
        this.permission = await Notification.requestPermission();
      }
      return this.permission === 'granted';
    } catch (error) {
      console.error('Error initializing notifications:', error);
      return false;
    }
  }

  isNotificationEnabled() {
    return this.isSupported && this.permission === 'granted';
  }

  async requestPermission() {
    if (!this.isSupported) {
      console.log('Notifications not supported');
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      this.permission = result;
      return result === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notifySubscribers(data) {
    this.subscribers.forEach(callback => callback(data));
  }

  async showNotification(title, options = {}) {
    if (!this.isNotificationEnabled()) {
      console.log('Notifications not enabled');
      return null;
    }

    const defaultOptions = {
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      vibrate: [100, 50, 100],
      requireInteraction: false,
      silent: false
    };

    const notificationOptions = { ...defaultOptions, ...options };

    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification(title, notificationOptions);
      } else {
        new Notification(title, notificationOptions);
      }

      this.notifySubscribers({ type: 'shown', title, options: notificationOptions });
      return true;
    } catch (error) {
      console.error('Error showing notification:', error);
      return false;
    }
  }

  async notifyBreakingNews(article) {
    return this.showNotification('Breaking News', {
      body: article.title,
      icon: article.image || '/pwa-192x192.png',
      tag: `news-${article.id}`,
      data: { url: article.url, id: article.id },
      actions: [
        { action: 'open', title: 'Read Now' },
        { action: 'dismiss', title: 'Dismiss' }
      ]
    });
  }

  async notifyNewArticles(articles, region) {
    if (!articles.length) return;

    const count = articles.length;
    const firstArticle = articles[0];
    
    return this.showNotification(`${count} New Articles from ${region}`, {
      body: firstArticle.title,
      icon: firstArticle.image || '/pwa-192x192.png',
      tag: `new-articles-${region}`,
      renotify: false,
      data: { region, count }
    });
  }

  async notifyTrendingTopic(topic, count) {
    return this.showNotification('Trending Topic', {
      body: `"${topic}" is trending with ${count} mentions`,
      icon: '/pwa-192x192.png',
      tag: `trending-${topic}`,
      vibrate: [200, 100, 200]
    });
  }

  async notifyAlert(message, type = 'info') {
    const icons = {
      info: 'ℹ️',
      warning: '⚠️',
      error: '❌',
      success: '✅'
    };

    return this.showNotification(`Alert: ${type.toUpperCase()}`, {
      body: message,
      icon: '/pwa-192x192.png',
      tag: `alert-${Date.now()}`
    });
  }

  setupBackgroundSync(callback, interval = 300000) {
    if (!this.isSupported) return null;

    const intervalId = setInterval(async () => {
      const result = await callback();
      if (result && result.hasNew) {
        this.notifyNewArticles(result.articles, result.region || 'Global');
      }
    }, interval);

    return () => clearInterval(intervalId);
  }

  async handleNotificationClick(event) {
    event.notification.close();

    if (event.action === 'open' || !event.action) {
      const url = event.notification.data?.url;
      if (url) {
        window.open(url, '_blank');
      }
    }

    this.notifySubscribers({
      type: 'clicked',
      action: event.action,
      data: event.notification.data
    });
  }

  getPermissionStatus() {
    return this.permission;
  }
}

export default new NotificationService();
