import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'light',
      toggleTheme: () => set((state) => ({
        theme: state.theme === 'light' ? 'dark' : 'light'
      })),
      setTheme: (theme) => set({ theme }),
      isDark: (state) => state.theme === 'dark'
    }),
    {
      name: 'theme-storage',
      getStorage: () => ({
        getItem: (key) => {
          try {
            return localStorage.getItem(key);
          } catch (e) {
            return null;
          }
        },
        setItem: (key, value) => {
          try {
            localStorage.setItem(key, value);
          } catch (e) {
            // Ignore
          }
        },
        removeItem: (key) => {
          try {
            localStorage.removeItem(key);
          } catch (e) {
            // Ignore
          }
        }
      })
    }
  )
);

export default useThemeStore;
