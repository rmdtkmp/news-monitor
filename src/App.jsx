import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import NewsFeed from './pages/NewsFeed'
import SocialListening from './pages/SocialListening'
import Analytics from './pages/Analytics'
import useThemeStore from './store/themeStore'
import NotificationService from './api/notificationService'
import './App.css'

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showNotifications, setShowNotifications] = useState(false)
  const location = useLocation()
  const { theme, toggleTheme } = useThemeStore()

  useEffect(() => {
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/news', label: 'News Feed', icon: '📰' },
    { path: '/social', label: 'Social Listening', icon: '💬' },
    { path: '/analytics', label: 'Analytics', icon: '📈' }
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
    setShowNotifications(!showNotifications)
  }

  return (
    <div className={`flex h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      <style>{`
        :root {
          --bg-primary: ${theme === 'dark' ? '#1f2937' : '#ffffff'};
          --bg-secondary: ${theme === 'dark' ? '#111827' : '#f3f4f6'};
          --text-primary: ${theme === 'dark' ? '#f3f4f6' : '#111827'};
          --text-secondary: ${theme === 'dark' ? '#9ca3af' : '#6b7280'};
          --border: ${theme === 'dark' ? '#374151' : '#e5e7eb'};
        }
      `}</style>

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b ${theme === 'dark' ? 'from-gray-900 to-gray-800' : 'from-gray-900 to-gray-800'} text-white transition-all duration-300 shadow-lg flex flex-col`}>
        <div className="p-4 flex items-center justify-between border-b border-gray-700">
          {sidebarOpen && <h1 className="text-lg font-bold">📰 News Monitor</h1>}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            title="Toggle sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="border-t border-gray-700 p-4 space-y-2">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors text-sm"
            title="Toggle dark mode"
          >
            <span className="text-xl">{theme === 'dark' ? '☀️' : '🌙'}</span>
            {sidebarOpen && <span>Dark Mode</span>}
          </button>
          
          <button
            onClick={handleNotificationClick}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors text-sm"
            title="Toggle notifications"
          >
            <span className="text-xl">🔔</span>
            {sidebarOpen && <span>Notifications</span>}
          </button>
        </div>

        <div className="border-t border-gray-700 p-4">
          <div className={`flex items-center space-x-3 ${!sidebarOpen && 'justify-center'}`}>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
              NM
            </div>
            {sidebarOpen && (
              <div className="text-xs">
                <div className="font-semibold">News Monitor</div>
                <div className="text-gray-400">v2.0</div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b sticky top-0 z-10`}>
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {menuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
              </h2>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mt-1`}>Real-time news monitoring and social listening</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className={`p-2 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-lg transition-colors`} title="Refresh">
                <svg className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
              </button>
              <button className={`p-2 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-lg transition-colors`} title="Settings">
                <svg className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className={`p-6 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/news" element={<NewsFeed />} />
            <Route path="/social" element={<SocialListening />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
