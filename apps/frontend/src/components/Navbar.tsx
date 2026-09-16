import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const { pathname } = useLocation()

  const linkClass = (path: string) =>
    pathname === path ? 'text-white font-medium' : 'text-white/50 hover:text-white transition-colors'

  if (['/', '/login', '/signup'].includes(pathname)) return null

  return (
    <nav className="flex items-center gap-8 px-8 py-5 border-b border-white/10 bg-[#0A0A0F] text-white sticky top-0 z-50">
      <Link to="/dashboard" className="font-display text-lg tracking-tight">
        SkillMate <span className="bg-gradient-to-r from-[#7C5CFF] to-[#22D3EE] bg-clip-text text-transparent">AI</span>
      </Link>
      <div className="flex gap-6 text-sm">
        <Link to="/dashboard" className={linkClass('/dashboard')}>Dashboard</Link>
        <Link to="/interview" className={linkClass('/interview')}>Interview</Link>
        <Link to="/feedback" className={linkClass('/feedback')}>Feedback</Link>
      </div>
      <Link to="/login" className="ml-auto text-sm font-medium text-[#22D3EE]">
        Log out
      </Link>
    </nav>
  )
}