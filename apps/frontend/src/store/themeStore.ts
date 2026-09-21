import { create } from 'zustand'

type Theme = 'light' | 'dark'

interface ThemeState {
  theme: Theme
  toggleTheme: () => void
}

const getInitialTheme = (): Theme => {
  const stored = localStorage.getItem('skillmate-theme')
  if (stored === 'light' || stored === 'dark') return stored
  return 'light'
}

const initialTheme = getInitialTheme()
document.documentElement.setAttribute('data-theme', initialTheme)

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: initialTheme,
  toggleTheme: () => {
    const next: Theme = get().theme === 'light' ? 'dark' : 'light'
    localStorage.setItem('skillmate-theme', next)
    document.documentElement.setAttribute('data-theme', next)
    set({ theme: next })
  },
}))