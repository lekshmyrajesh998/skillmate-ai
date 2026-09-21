import { useEffect, useState } from 'react'
import { User, Award, TrendingUp, Target } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { api } from '../lib/api'
import { useAuthStore } from '../store/authStore'
import { Skeleton } from '../components/Skeleton'

interface Stats { totalInterviews: number; avgScore: number; bestScore: number; trend: { date: string; score: number }[] }

function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="surface rounded-lg px-3 py-2 text-xs shadow-lg">
        Score: <span className="font-semibold" style={{ color: 'var(--accent-3)' }}>{payload[0].value}</span>
      </div>
    )
  }
  return null
}

export default function Profile() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const userEmail = useAuthStore((s) => s.userEmail)
  const userName = useAuthStore((s) => s.userName)

  useEffect(() => {
    api.get('/sessions/stats').then((res) => setStats(res.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const chartData = stats?.trend.slice(-10).map((point, i) => ({ name: `#${i + 1}`, score: point.score })) || []

  return (
    <div className="min-h-screen relative overflow-hidden md:pl-56 pt-16 pb-20 md:pt-0 md:pb-0" style={{ background: 'linear-gradient(180deg, var(--bg-page) 0%, var(--bg-page-2) 100%)', color: 'var(--text-primary)' }}>
      <div className="relative z-10 max-w-3xl mx-auto px-6 py-12">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-16 h-16 rounded-full bg-gradient-aurora flex items-center justify-center shrink-0 text-white">
            <User size={28} />
          </div>
          <div>
            <h1 className="font-display text-2xl">{userName}</h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{userEmail}</p>
          </div>
        </div>

        {loading ? (
          <>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="surface rounded-2xl p-5 text-center">
                  <Skeleton className="w-5 h-5 mx-auto mb-2 rounded-full" />
                  <Skeleton className="h-7 w-10 mx-auto mb-2" />
                  <Skeleton className="h-3 w-14 mx-auto" />
                </div>
              ))}
            </div>
            <Skeleton className="h-64" />
          </>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="surface rounded-2xl p-5 text-center">
                <Target className="mx-auto mb-2" size={20} style={{ color: 'var(--accent-3)' }} />
                <p className="font-display text-2xl">{stats?.totalInterviews ?? 0}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>Interviews</p>
              </div>
              <div className="surface rounded-2xl p-5 text-center">
                <TrendingUp className="mx-auto mb-2" size={20} style={{ color: 'var(--accent-2)' }} />
                <p className="font-display text-2xl">{stats?.avgScore ?? 0}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>Avg score</p>
              </div>
              <div className="surface rounded-2xl p-5 text-center">
                <Award className="mx-auto mb-2 text-[#F5B942]" size={20} />
                <p className="font-display text-2xl">{stats?.bestScore ?? 0}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>Best score</p>
              </div>
            </div>

            <div className="surface rounded-2xl p-6">
              <h2 className="font-semibold mb-4">Score trend</h2>
              {chartData.length === 0 ? (
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Complete interviews to see your trend over time.</p>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#6366F1" />
                        <stop offset="50%" stopColor="#A855F7" />
                        <stop offset="100%" stopColor="#06B6D4" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="name" stroke="var(--text-tertiary)" fontSize={11} />
                    <YAxis domain={[0, 100]} stroke="var(--text-tertiary)" fontSize={11} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="score" stroke="url(#lineGradient)" strokeWidth={3} dot={{ fill: '#A855F7', r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}