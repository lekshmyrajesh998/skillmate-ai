import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { api } from '../lib/api'

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
  if (!name || !email || !password) {
    setError('Fill in all fields to create your account')
    return
  }
  if (password.length < 6) {
    setError('Password must be at least 6 characters')
    return
  }

  try {
    const res = await api.post('/auth/signup', { name, email, password })
    setAuth(res.data.token, res.data.user.email)
    navigate('/dashboard')
  } catch (err: any) {
    setError(err.response?.data?.error || 'Something went wrong. Please try again.')
  }
}

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault()
  //   setError('')
  //   if (!name || !email || !password) {
  //     setError('Fill in all fields to create your account')
  //     return
  //   }
  //   if (password.length < 6) {
  //     setError('Password must be at least 6 characters')
  //     return
  //   }
  //   setAuth('fake-token-for-now', email)
  //   navigate('/dashboard')
  // }

  return (
    <div className="relative min-h-screen bg-[#0A0A0F] text-white overflow-hidden flex items-center justify-center px-6">
      <div className="pointer-events-none absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#22D3EE] opacity-20 blur-[120px] animate-[drift_15s_ease-in-out_infinite_reverse]" />
      <div className="pointer-events-none absolute bottom-0 -left-40 w-[500px] h-[500px] rounded-full bg-[#7C5CFF] opacity-25 blur-[120px] animate-[drift_12s_ease-in-out_infinite]" />

      <div className="relative z-10 w-full max-w-sm">
        <Link to="/" className="font-display text-lg block text-center mb-10">
          SkillMate <span className="bg-gradient-to-r from-[#7C5CFF] to-[#22D3EE] bg-clip-text text-transparent">AI</span>
        </Link>

        <form
          onSubmit={handleSubmit}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-[0_0_60px_rgba(34,211,238,0.1)] space-y-5"
        >
          <div>
            <h1 className="font-display text-2xl">Create your account</h1>
            <p className="text-white/50 text-sm mt-1">Set up SkillMate in under a minute.</p>
          </div>

          {error && (
            <p className="text-sm text-red-300 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <div>
            <label className="block text-sm text-white/50 mb-1.5">Full name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Lekshmy MS"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C5CFF]/50 focus:border-[#7C5CFF]/50 placeholder:text-white/30"
            />
          </div>

          <div>
            <label className="block text-sm text-white/50 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C5CFF]/50 focus:border-[#7C5CFF]/50 placeholder:text-white/30"
            />
          </div>

          <div>
            <label className="block text-sm text-white/50 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C5CFF]/50 focus:border-[#7C5CFF]/50 placeholder:text-white/30"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#7C5CFF] to-[#22D3EE] rounded-lg py-2.5 font-medium shadow-[0_0_25px_rgba(124,92,255,0.35)] hover:shadow-[0_0_35px_rgba(124,92,255,0.5)] transition-shadow"
          >
            Create account
          </button>

          <p className="text-sm text-center text-white/50">
            Already have an account?{' '}
            <Link to="/login" className="text-[#22D3EE] font-medium">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}