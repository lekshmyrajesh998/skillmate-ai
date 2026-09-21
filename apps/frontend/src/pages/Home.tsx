import { Link } from 'react-router-dom'
import { Target, MessageSquare, TrendingUp, ArrowRight, Upload, Mic, BarChart3 } from 'lucide-react'
import ThemeToggle from '../components/ThemeToggle'

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: 'linear-gradient(180deg, var(--bg-page) 0%, var(--bg-page-2) 100%)', color: 'var(--text-primary)' }}>
      <div className="pointer-events-none absolute -top-40 -left-40 w-[550px] h-[550px] rounded-full opacity-20 blur-[130px] animate-[drift_12s_ease-in-out_infinite]" style={{ background: 'var(--accent-1)' }} />
      <div className="pointer-events-none absolute top-40 -right-40 w-[550px] h-[550px] rounded-full opacity-15 blur-[130px] animate-[drift_15s_ease-in-out_infinite_reverse]" style={{ background: 'var(--accent-3)' }} />

      <div className="relative z-10">
        <div className="flex justify-between items-center px-6 pt-6 max-w-6xl mx-auto">
          <span className="font-display text-lg">SkillMate <span className="text-gradient">AI</span></span>
          <ThemeToggle />
        </div>

        <section className="max-w-6xl mx-auto px-6 pt-20 pb-24 text-center">
          <p className="text-sm font-semibold mb-5 text-gradient inline-block">AI-powered voice interview practice</p>
          <h1 className="font-display leading-[1.05] text-6xl md:text-7xl mb-8 max-w-3xl mx-auto">
            Have the interview<br />before the interview.
          </h1>
          <p className="text-lg leading-relaxed mb-10 max-w-lg mx-auto" style={{ color: 'var(--text-secondary)' }}>
            SkillMate reads your resume and the job you're targeting, then runs a live voice interview grounded in your real experience — with honest feedback at the end.
          </p>
          <div className="flex gap-3 justify-center">
            <Link to="/signup" className="bg-gradient-aurora text-white px-7 py-3.5 rounded-full font-semibold inline-flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow">
              Get started free <ArrowRight size={16} />
            </Link>
            <Link to="/login" className="px-7 py-3.5 rounded-full font-semibold border transition-colors" style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
              Log in
            </Link>
          </div>
        </section>

        <section className="max-w-2xl mx-auto px-6 pb-24">
          <div className="surface backdrop-blur-xl rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--accent-3)' }} />
              Live voice session
            </div>
            <div className="space-y-3">
              <div className="flex justify-start">
                <div className="px-4 py-2.5 rounded-2xl rounded-bl-md text-sm max-w-[85%]" style={{ background: 'var(--border)' }}>
                  Walk me through a project you're proud of and its impact.
                </div>
              </div>
              <div className="flex justify-end">
                <div className="bg-gradient-aurora text-white px-4 py-2.5 rounded-2xl rounded-br-md text-sm max-w-[85%]">
                  I led a migration that cut load times by 40%...
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 pb-24">
          <h2 className="font-display text-3xl mb-12 text-center">How it works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Upload, title: 'Upload & target', desc: "Add your resume and paste the job description you're preparing for." },
              { icon: Mic, title: 'Speak your answers', desc: 'Answer out loud — SkillMate transcribes your voice live and the AI speaks its questions back, just like a real interview.' },
              { icon: BarChart3, title: 'Get scored feedback', desc: 'See clarity, relevance, depth, and confidence — scored and explained.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="surface rounded-2xl p-6 hover:shadow-lg transition-all">
                <div className="w-10 h-10 rounded-full bg-gradient-aurora flex items-center justify-center mb-4 text-white">
                  <Icon size={18} />
                </div>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 pb-24">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Target, title: 'Grounded in your resume', desc: 'Questions come from a retrieval pipeline over your actual experience — not generic prompts.' },
              { icon: MessageSquare, title: 'Real conversation', desc: 'A live agent adapts follow-up questions based on what you actually say.' },
              { icon: TrendingUp, title: 'Honest feedback', desc: 'Clarity, relevance, depth, and confidence — scored individually.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-6">
                <Icon size={24} className="mb-3" style={{ color: 'var(--accent-3)' }} />
                <h3 className="font-semibold mb-1.5">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 pb-24">
          <h2 className="font-display text-3xl mb-12 text-center">What job seekers say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { quote: "I walked into my actual interview already knowing what to expect.", name: 'Priya S.', role: 'Software Engineer' },
              { quote: "The voice mode genuinely changed how I practice.", name: 'Arjun M.', role: 'Product Analyst' },
              { quote: "Got specific, honest feedback instead of generic tips.", name: 'Divya R.', role: 'Frontend Developer' },
            ].map((t) => (
              <div key={t.name} className="surface rounded-2xl p-6">
                <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-aurora flex items-center justify-center text-sm font-display text-white shrink-0">{t.name.charAt(0)}</div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-6 pb-24">
          <h2 className="font-display text-3xl mb-4 text-center">Simple pricing</h2>
          <p className="text-center mb-12" style={{ color: 'var(--text-secondary)' }}>Start practicing today — completely free.</p>
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="surface rounded-2xl p-8">
              <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Free</p>
              <p className="font-display text-4xl mb-4">₹0</p>
              <ul className="space-y-2.5 text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                <li>Unlimited mock interviews</li>
                <li>Voice input & AI voice questions</li>
                <li>Full feedback reports</li>
                <li>Interview history & progress tracking</li>
              </ul>
              <Link to="/signup" className="block text-center bg-gradient-aurora text-white py-3 rounded-lg font-semibold">Get started</Link>
            </div>
            <div className="surface rounded-2xl p-8 opacity-60">
              <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Pro — Coming soon</p>
              <p className="font-display text-4xl mb-4">TBD</p>
              <ul className="space-y-2.5 text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                <li>Industry-specific question banks</li>
                <li>Detailed PDF reports</li>
                <li>Priority AI response speed</li>
              </ul>
              <button disabled className="block w-full text-center py-3 rounded-lg font-semibold cursor-not-allowed" style={{ background: 'var(--border)', color: 'var(--text-tertiary)' }}>Notify me</button>
            </div>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-6 pb-24">
          <h2 className="font-display text-3xl mb-12 text-center">Frequently asked</h2>
          <div className="space-y-4">
            {[
              { q: 'Is SkillMate AI really free?', a: 'Yes — unlimited mock interviews, voice mode, and feedback reports at no cost.' },
              { q: 'What browser do I need for voice input?', a: 'Voice input and AI voice output work best in Chrome or Edge.' },
              { q: 'Is my resume data stored securely?', a: 'Your resume and job description are stored only to power your interview sessions.' },
              { q: 'Can I practice for any job role?', a: 'Yes — paste any job description and SkillMate tailors questions to that role.' },
            ].map((item) => (
              <details key={item.q} className="surface rounded-xl p-5 group">
                <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
                  {item.q}
                  <span className="group-open:rotate-45 transition-transform text-xl leading-none" style={{ color: 'var(--text-tertiary)' }}>+</span>
                </summary>
                <p className="text-sm mt-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-6 pb-28 text-center">
          <h2 className="font-display text-3xl mb-4">Ready to practice?</h2>
          <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>Free, unlimited, and ready in under a minute.</p>
          <Link to="/signup" className="bg-gradient-aurora text-white px-8 py-4 rounded-full font-semibold inline-flex items-center gap-2 shadow-lg">
            Get started free <ArrowRight size={16} />
          </Link>
        </section>
      </div>
    </div>
  )
}