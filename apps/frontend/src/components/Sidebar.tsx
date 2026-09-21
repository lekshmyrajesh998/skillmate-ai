import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, MessageSquare, BarChart3, History as HistoryIcon, User, Settings as SettingsIcon, LogOut, Circle } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import ThemeToggle from './ThemeToggle'

export default function Sidebar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const logout = useAuthStore((s) => s.logout)

  if (['/', '/login', '/signup'].includes(pathname)) return null

  const links = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/interview', icon: MessageSquare, label: 'Interview' },
    { path: '/feedback', icon: BarChart3, label: 'Feedback' },
    { path: '/history', icon: HistoryIcon, label: 'History' },
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/settings', icon: SettingsIcon, label: 'Settings' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      <aside
        className="hidden md:flex fixed left-0 top-0 h-screen w-56 flex-col p-4 z-40 shadow-sm"
        style={{ background: 'var(--bg-page)', borderRight: '1px solid var(--border)' }}
      >
        <div className="flex items-center justify-between mb-8 px-2">
          <Link to="/dashboard" className="font-display text-lg" style={{ color: 'var(--text-primary)' }}>
            SkillMate <span className="text-gradient">AI</span>
          </Link>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {links.map(({ path, icon: Icon, label }) => {
            const active = pathname === path
            return (
              <Link
                key={path}
                to={path}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors"
                style={{
                  color: active ? 'var(--accent-1)' : 'var(--text-secondary)',
                  background: active ? 'color-mix(in srgb, var(--accent-1) 12%, transparent)' : 'transparent',
                  fontWeight: active ? 500 : 400,
                }}
              >
                <Icon size={17} />
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center justify-between px-2 mb-4">
          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
            <Circle size={7} style={{ fill: 'var(--accent-3)', color: 'var(--accent-3)' }} className="animate-pulse" />
            AI online
          </div>
          <ThemeToggle />
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left"
          style={{ color: 'var(--text-secondary)' }}
        >
          <LogOut size={17} />
          Log out
        </button>
      </aside>

      <header
        className="md:hidden fixed top-0 left-0 right-0 flex items-center justify-between px-4 py-3 z-40 shadow-sm"
        style={{ background: 'var(--bg-page)', borderBottom: '1px solid var(--border)' }}
      >
        <Link to="/dashboard" className="font-display text-base" style={{ color: 'var(--text-primary)' }}>
          SkillMate <span className="text-gradient">AI</span>
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button onClick={handleLogout} className="text-sm flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
            <LogOut size={16} />
          </button>
        </div>
      </header>

      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 flex items-center justify-around py-2.5 z-40"
        style={{ background: 'var(--bg-page)', borderTop: '1px solid var(--border)' }}
      >
        {links.map(({ path, icon: Icon, label }) => {
          const active = pathname === path
          return (
            <Link
              key={path}
              to={path}
              className="flex flex-col items-center gap-1 px-4 py-1.5 rounded-lg text-xs transition-colors"
              style={{ color: active ? 'var(--accent-1)' : 'var(--text-secondary)', fontWeight: active ? 500 : 400 }}
            >
              <Icon size={20} />
              {label}
            </Link>
          )
        })}
      </nav>
    </>
  )
}