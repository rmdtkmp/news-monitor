import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import NewsFeed from './pages/NewsFeed'
import SocialListening from './pages/SocialListening'
import Analytics from './pages/Analytics'
import Bookmarks from './pages/Bookmarks'
import History from './pages/History'
import Settings from './pages/Settings'
import ErrorBoundary from './components/ErrorBoundary'
import useThemeStore from './store/themeStore'
import NotificationService from './api/notificationService'
import './App.css'

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const location = useLocation()
  const { theme, toggleTheme } = useThemeStore()

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (isMobile) setSidebarOpen(false)
  }, [location, isMobile])

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/news', label: 'News Feed', icon: '📰' },
    { path: '/social', label: 'Social Listening', icon: '💬' },
    { path: '/analytics', label: 'Analytics', icon: '📈' },
    { path: '/bookmarks', label: 'Bookmarks', icon: '📚' },
    { path: '/history', label: 'History', icon: '📖' },
    { path: '/settings', label: 'Settings', icon: '⚙️' }
  ]

  const isActive = (path) => location.pathname === path

  const handleNotificationClick = async () => {
    if (!NotificationService.isNotificationEnabled()) {
      const granted = await NotificationService.requestPermission()
      if (granted) {
        NotificationService.showNotification('Notifications Enabled', {
          body: 'You will now receive alerts for breaking news',
          icon: '/pwa-192x192.png'
        })
      }
    }
  }

  return (
    <div className={`flex h-screen overflow-hidden ${theme === 'dark' ? 'dark' : ''}`}>
      {isMobile && sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`
        ${isMobile ? 'fixed inset-y-0 left-0 z-50' : 'relative'}
        ${sidebarOpen ? (isMobile ? 'w-64 translate-x-0' : 'w-64') : (isMobile ? '-translate-x-full w-64' : 'w-16')}
        bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 shadow-lg flex flex-col
      `}>
        <div className="p-4 flex items-center justify-between border-b border-gray-700 min-h-[60px]">
          {sidebarOpen && <h1 className="text-lg font-bold truncate">📰 News Monitor</h1>}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-3 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Toggle sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menuItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors min-h-[44px] ${
                isActive(item.path) ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <span className="text-xl flex-shrink-0">{item.icon}</span>
              {sidebarOpen && <span className="text-sm font-medium truncate">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="border-t border-gray-700 p-3 space-y-1">
          <button onClick={toggleTheme}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors text-sm min-h-[44px]"
          >
            <span className="text-xl flex-shrink-0">{theme === 'dark' ? '☀️' : '🌙'}</span>
            {sidebarOpen && <span className="truncate">Dark Mode</span>}
          </button>
          <button onClick={handleNotificationClick}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors text-sm min-h-[44px]"
          >
            <span className="text-xl flex-shrink-0">🔔</span>
            {sidebarOpen && <span className="truncate">Notifications</span>}
          </button>
        </div>

        <div className="border-t border-gray-700 p-3">
          <div className={`flex items-center space-x-3 ${!sidebarOpen && 'justify-center'}`}>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">NM</div>
            {sidebarOpen && (
              <div className="text-xs min-w-0">
                <div className="font-semibold truncate">News Monitor</div>
                <div className="text-gray-400">v3.0</div>
              </div>
            )}
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b sticky top-0 z-30`}>
          <div className="px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3 min-w-0">
              {isMobile && (
                <button onClick={() => setSidebarOpen(true)}
                  className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex-shrink-0"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              )}
              <div className="min-w-0">
                <h2 className={`text-lg md:text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} truncate`}>
                  {menuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
                </h2>
                {!isMobile && (
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mt-0.5`}>
                    Real-time news monitoring
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0">
              <button onClick={() => window.location.reload()}
                className={`p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-lg transition-colors`}
                title="Refresh"
              >
                <svg className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <Link to="/settings"
                className={`p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-lg transition-colors`}
              >
                <svg className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <div className={`flex-1 overflow-y-auto p-4 md:p-6 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/news" element={<NewsFeed />} />
            <Route path="/social" element={<SocialListening />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/history" element={<History />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AppContent />
      </Router>
    </ErrorBoundary>
  )
}

export default App
