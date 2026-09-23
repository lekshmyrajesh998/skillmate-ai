import { Moon, Sun } from 'lucide-react'
import { useThemeStore } from '../store/themeStore'

export default function ThemeToggle() {
  const theme = useThemeStore((state) => state.theme)
  const toggleTheme = useThemeStore((state) => state.toggleTheme)

  const isLight = theme === 'light'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      className="group flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-200 hover:scale-105"
      style={{
        borderColor: 'var(--border)',
        color: 'var(--text-secondary)',
        background: 'var(--bg-page-2)',
      }}
    >
      <span className="transition-transform duration-300 group-hover:rotate-12">
        {isLight ? <Moon size={16} /> : <Sun size={16} />}
      </span>
    </button>
  )
}