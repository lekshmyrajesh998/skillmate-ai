import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { api } from '../lib/api'
import ThemeToggle from '../components/ThemeToggle'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!name || !email || !password) { setError('Fill in all fields to create your account'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    try {
      const res = await api.post('/auth/signup', { name, email, password })
      setAuth(res.data.token, res.data.user.email, res.data.user.name)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.')
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center px-6" style={{ background: 'linear-gradient(180deg, var(--bg-page) 0%, var(--bg-page-2) 100%)', color: 'var(--text-primary)' }}>
      <div className="absolute top-6 right-6"><ThemeToggle /></div>
      <div className="pointer-events-none absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-15 blur-[130px] animate-[drift_15s_ease-in-out_infinite_reverse]" style={{ background: 'var(--accent-3)' }} />

      <div className="relative z-10 w-full max-w-sm">
        <Link to="/" className="font-display text-lg block text-center mb-10">
          SkillMate <span className="text-gradient">AI</span>
        </Link>

        <form onSubmit={handleSubmit} className="surface backdrop-blur-xl rounded-2xl p-8 shadow-lg space-y-5">
          <div>
            <h1 className="font-display text-2xl">Create your account</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Set up SkillMate in under a minute.</p>
          </div>

          {error && <p className="text-sm text-red-500 bg-red-500/10 border border-red-500/25 px-3 py-2 rounded-lg">{error}</p>}

          <div>
            <label className="block text-sm mb-1.5" style={{ color: 'var(--text-secondary)' }}>Full name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Lekshmy MS"
              className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2"
              style={{ background: 'var(--bg-page)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
          </div>
          <div>
            <label className="block text-sm mb-1.5" style={{ color: 'var(--text-secondary)' }}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
              className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2"
              style={{ background: 'var(--bg-page)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
          </div>
          <div>
            <label className="block text-sm mb-1.5" style={{ color: 'var(--text-secondary)' }}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters"
              className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2"
              style={{ background: 'var(--bg-page)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
          </div>

          <button type="submit" className="w-full bg-gradient-aurora text-white rounded-lg py-2.5 font-semibold shadow-md hover:shadow-lg transition-shadow">
            Create account
          </button>

          <p className="text-sm text-center" style={{ color: 'var(--text-secondary)' }}>
            Already have an account? <Link to="/login" className="font-semibold" style={{ color: 'var(--accent-3)' }}>Log in</Link>
          </p>
        </form>
      </div>
    </div>
  )
}