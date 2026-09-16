import { Link } from 'react-router-dom'
import { Target, MessageSquare, TrendingUp, ArrowRight, Upload, Mic, BarChart3 } from 'lucide-react'

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#0A0A0F] text-white overflow-hidden">
      {/* Glow orbs */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#7C5CFF] opacity-30 blur-[120px] animate-[drift_12s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute top-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#22D3EE] opacity-20 blur-[120px] animate-[drift_15s_ease-in-out_infinite_reverse]" />

      <div className="relative z-10">
        <div className="flex justify-between items-center px-6 pt-6 max-w-6xl mx-auto">
          <span className="font-display text-lg">
            SkillMate <span className="bg-gradient-to-r from-[#7C5CFF] to-[#22D3EE] bg-clip-text text-transparent">AI</span>
          </span>
        </div>

        {/* Hero */}
        <section className="max-w-6xl mx-auto px-6 pt-20 pb-24 text-center">
          <p className="text-sm font-medium mb-5 bg-gradient-to-r from-[#7C5CFF] to-[#22D3EE] bg-clip-text text-transparent inline-block">
            AI-powered interview practice
          </p>
          <h1 className="font-display leading-[1.05] text-6xl md:text-7xl mb-8 max-w-3xl mx-auto">
            Have the interview
            <br />
            before the interview.
          </h1>
          <p className="text-white/60 text-lg leading-relaxed mb-10 max-w-lg mx-auto">
            SkillMate reads your resume and the job you're targeting, then runs
            a live mock interview grounded in your real experience — with
            honest feedback at the end.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              to="/signup"
              className="bg-gradient-to-r from-[#7C5CFF] to-[#22D3EE] text-white px-7 py-3.5 rounded-full font-medium inline-flex items-center gap-2 shadow-[0_0_30px_rgba(124,92,255,0.4)] hover:shadow-[0_0_45px_rgba(124,92,255,0.6)] transition-shadow"
            >
              Get started free <ArrowRight size={16} />
            </Link>
            <Link
              to="/login"
              className="px-7 py-3.5 rounded-full font-medium border border-white/15 hover:bg-white/5 transition-colors"
            >
              Log in
            </Link>
          </div>
        </section>

        {/* Live preview — glass card */}
        <section className="max-w-2xl mx-auto px-6 pb-24">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_0_60px_rgba(124,92,255,0.15)]">
            <div className="flex items-center gap-2 mb-4 text-sm text-white/50">
              <span className="w-2 h-2 rounded-full bg-[#22D3EE] animate-pulse" />
              Live session
            </div>
            <div className="space-y-3">
              <div className="flex justify-start">
                <div className="bg-white/10 px-4 py-2.5 rounded-2xl rounded-bl-md text-sm max-w-[85%]">
                  Walk me through a project you're proud of and its impact.
                </div>
              </div>
              <div className="flex justify-end">
                <div className="bg-gradient-to-r from-[#7C5CFF] to-[#22D3EE] px-4 py-2.5 rounded-2xl rounded-br-md text-sm max-w-[85%]">
                  I led a migration that cut load times by 40%...
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="max-w-6xl mx-auto px-6 pb-24">
          <h2 className="font-display text-3xl mb-12 text-center">How it works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Upload, title: 'Upload & target', desc: "Add your resume and paste the job description you're preparing for." },
              { icon: Mic, title: 'Practice live', desc: 'Answer questions from an agent that adapts based on what you actually say.' },
              { icon: BarChart3, title: 'Get scored feedback', desc: 'See clarity, relevance, depth, and confidence — scored and explained.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-[#7C5CFF]/40 hover:shadow-[0_0_30px_rgba(124,92,255,0.15)] transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#7C5CFF] to-[#22D3EE] flex items-center justify-center mb-4">
                  <Icon size={18} />
                </div>
                <h3 className="font-medium mb-2">{title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="max-w-6xl mx-auto px-6 pb-24">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Target, title: 'Grounded in your resume', desc: 'Questions come from a retrieval pipeline over your actual experience — not generic prompts.' },
              { icon: MessageSquare, title: 'Real conversation', desc: 'A live agent adapts follow-up questions based on what you actually say.' },
              { icon: TrendingUp, title: 'Honest feedback', desc: 'Clarity, relevance, depth, and confidence — scored individually.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-6">
                <Icon size={24} className="text-[#22D3EE] mb-3" />
                <h3 className="font-medium mb-1.5">{title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}