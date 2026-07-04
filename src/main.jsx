import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import NotificationService from './api/notificationService.js'
import DataService from './api/dataService.js'

// Init data persistence
DataService.initSettings()

// Apply saved theme on load
const savedSettings = DataService.getSettings()
if (savedSettings?.theme === 'dark') {
  document.documentElement.classList.add('dark')
}

// Init notifications on app load (non-blocking)
NotificationService.init().then(() => console.log('Notifications initialized'))

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
