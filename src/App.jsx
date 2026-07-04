import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    // Check if app is already installed
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', () => setIsInstalled(true))

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', () => setIsInstalled(true))
    }
  }, [])

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setIsInstalled(true)
      }
      setDeferredPrompt(null)
    }
  }

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={viteLogo} className="vite" alt="Vite logo" />
          <img src={reactLogo} className="framework" alt="React logo" />
        </div>
        <div>
          <h1>Welcome to PWA</h1>
          <p>
            This is a Progressive Web App built with <code>Vite + React</code>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="counter"
            onClick={() => setCount((count) => count + 1)}
          >
            Count is {count}
          </button>

          {deferredPrompt && !isInstalled && (
            <button
              type="button"
              className="counter"
              onClick={handleInstall}
              style={{ backgroundColor: '#4CAF50' }}
            >
              📱 Install App
            </button>
          )}

          {isInstalled && (
            <button
              type="button"
              className="counter"
              disabled
              style={{ backgroundColor: '#ccc' }}
            >
              ✅ App Installed
            </button>
          )}
        </div>

        <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
          <h3>PWA Features:</h3>
          <ul style={{ textAlign: 'left', margin: '0 auto', maxWidth: '400px' }}>
            <li>✨ Installable on home screen</li>
            <li>🔄 Works offline (service worker enabled)</li>
            <li>⚡ Fast loading with caching</li>
            <li>📱 Mobile-optimized experience</li>
            <li>🔔 Ready for push notifications</li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <h2>Get Started</h2>
          <p>Learn more about PWA development</p>
          <ul>
            <li>
              <a href="https://web.dev/progressive-web-apps/" target="_blank" rel="noopener noreferrer">
                📖 PWA Documentation
              </a>
            </li>
            <li>
              <a href="https://vite.dev/" target="_blank" rel="noopener noreferrer">
                ⚡ Vite Documentation
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank" rel="noopener noreferrer">
                ⚛️ React Documentation
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
