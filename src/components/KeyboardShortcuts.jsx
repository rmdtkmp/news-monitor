import React, { useEffect, useState } from 'react';
import useThemeStore from '../store/themeStore.js';

const KeyboardShortcuts = ({ onSearchFocus }) => {
  const { theme } = useThemeStore();
  const [showHelp, setShowHelp] = useState(false);
  const isDark = theme === 'dark';

  useEffect(() => {
    const handleKeyDown = (e) => {
      // "/" - Focus search
      if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
        const activeElement = document.activeElement;
        const isInputFocused = activeElement?.tagName === 'INPUT' || activeElement?.tagName === 'TEXTAREA';
        if (!isInputFocused) {
          e.preventDefault();
          onSearchFocus?.();
        }
      }
      
      // "?" - Show help
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        const activeElement = document.activeElement;
        const isInputFocused = activeElement?.tagName === 'INPUT' || activeElement?.tagName === 'TEXTAREA';
        if (!isInputFocused) {
          e.preventDefault();
          setShowHelp(prev => !prev);
        }
      }

      // "Escape" - Close help
      if (e.key === 'Escape') {
        setShowHelp(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSearchFocus]);

  const shortcuts = [
    { key: '/', description: 'Focus search bar' },
    { key: '?', description: 'Show/hide keyboard shortcuts' },
    { key: 'Esc', description: 'Close modals' },
  ];

  if (!showHelp) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setShowHelp(false)}>
      <div className={`max-w-md w-full rounded-xl shadow-2xl p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>⌨️ Keyboard Shortcuts</h2>
          <button onClick={() => setShowHelp(false)} className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
            ✕
          </button>
        </div>
        <div className="space-y-3">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{shortcut.description}</span>
              <kbd className={`px-3 py-1 rounded font-mono text-sm ${isDark ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcuts;
