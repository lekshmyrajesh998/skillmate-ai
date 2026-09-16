import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Download, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react'
import { api } from '../lib/api'

interface FeedbackData {
  overallScore: number
  clarityScore: number
  relevanceScore: number
  depthScore: number
  confidenceScore: number
  summary: string
}

function scoreColor(score: number) {
  if (score >= 80) return '#22D3EE'
  if (score >= 60) return '#F5B942'
  return '#F5605C'
}

function ringDashArray(score: number, radius: number) {
  const c = 2 * Math.PI * radius
  return `${(score / 100) * c} ${c}`
}

export default function Feedback() {
  const navigate = useNavigate()
  const location = useLocation()
  const sessionId = (location.state as { sessionId?: string })?.sessionId

  const [data, setData] = useState<FeedbackData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!sessionId) {
      navigate('/dashboard')
      return
    }
    api.get(`/feedback/${sessionId}`)
      .then((res) => setData(res.data))
      .catch(() => alert('Could not load feedback'))
      .finally(() => setLoading(false))
  }, [sessionId, navigate])

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] text-white flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-[#7C5CFF]" size={32} />
        <p className="text-white/50 text-sm">Generating your feedback report…</p>
      </div>
    )
  }

  const radius = 80
  const scores = [
    { label: 'Clarity', score: data.clarityScore },
    { label: 'Relevance to role', score: data.relevanceScore },
    { label: 'Depth of detail', score: data.depthScore },
    { label: 'Confidence signals', score: data.confidenceScore },
  ]
  const strengths = scores.filter((s) => s.score >= 80)
  const improvements = scores.filter((s) => s.score < 80)

  const handleDownload = () => {
    const lines = ['SkillMate AI — Interview Report', `Overall score: ${data.overallScore}/100`, '', data.summary, '', ...scores.map((s) => `${s.label}: ${s.score}/100`)]
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'skillmate-interview-report.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white relative overflow-hidden">
      <div className="pointer-events-none absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full bg-[#7C5CFF] opacity-15 blur-[130px]" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-16">
        <div className="flex items-start justify-between mb-12">
          <div>
            <p className="text-sm font-medium mb-2 bg-gradient-to-r from-[#7C5CFF] to-[#22D3EE] bg-clip-text text-transparent inline-block">
              Session complete
            </p>
            <h1 className="font-display text-4xl">Your interview report</h1>
          </div>
          <button onClick={handleDownload} className="flex items-center gap-2 text-sm border border-white/10 rounded-lg px-3 py-2 hover:bg-white/5 transition-colors shrink-0">
            <Download size={14} /> Download
          </button>
        </div>

        <div className="flex flex-col items-center text-center mb-8">
          <svg width="190" height="190" viewBox="0 0 190 190">
            <circle cx="95" cy="95" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" />
            <circle
              cx="95" cy="95" r={radius} fill="none"
              stroke={scoreColor(data.overallScore)} strokeWidth="12" strokeLinecap="round"
              strokeDasharray={ringDashArray(data.overallScore, radius)}
              transform="rotate(-90 95 95)"
              style={{ filter: `drop-shadow(0 0 12px ${scoreColor(data.overallScore)}80)` }}
            />
            <text x="95" y="106" textAnchor="middle" className="font-display" fontSize="48" fill="white">{data.overallScore}</text>
          </svg>
          <p className="font-display text-2xl mt-4">
            {data.overallScore >= 80 ? 'Strong performance' : data.overallScore >= 60 ? 'Solid, with room to grow' : 'Needs more practice'}
          </p>
          <p className="text-white/60 text-sm mt-3 max-w-md">{data.summary}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-12">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
            <div className="flex items-center gap-2 text-sm font-medium text-[#22D3EE] mb-3">
              <CheckCircle2 size={16} /> Strengths
            </div>
            {strengths.length === 0 ? <p className="text-sm text-white/50">None scored above 80 this round.</p> : strengths.map((s) => <p key={s.label} className="text-sm mb-1.5">{s.label}</p>)}
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
            <div className="flex items-center gap-2 text-sm font-medium text-[#F5B942] mb-3">
              <AlertTriangle size={16} /> Areas to improve
            </div>
            {improvements.map((s) => <p key={s.label} className="text-sm mb-1.5">{s.label}</p>)}
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 space-y-6 mb-8">
          {scores.map((item) => (
            <div key={item.label}>
              <div className="flex justify-between items-baseline mb-1.5">
                <span className="font-medium">{item.label}</span>
                <span className="text-sm text-white/50">{item.score}/100</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="h-2 rounded-full transition-all duration-700" style={{ width: `${item.score}%`, backgroundColor: scoreColor(item.score) }} />
              </div>
            </div>
          ))}
        </div>

        <button onClick={() => navigate('/dashboard')} className="w-full bg-gradient-to-r from-[#7C5CFF] to-[#22D3EE] rounded-lg py-3.5 font-medium shadow-[0_0_25px_rgba(124,92,255,0.35)]">
          Start another interview
        </button>
      </div>
    </div>
  )
}