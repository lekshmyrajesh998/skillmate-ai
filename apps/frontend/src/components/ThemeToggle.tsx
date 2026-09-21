import { Sun, Moon } from 'lucide-react'
import { useThemeStore } from '../store/themeStore'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore()

  return (
    <button
      onClick={toggleTheme}
      title="Toggle theme"
      className="w-9 h-9 rounded-full flex items-center justify-center border transition-colors"
      style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
    >
      {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  )
}