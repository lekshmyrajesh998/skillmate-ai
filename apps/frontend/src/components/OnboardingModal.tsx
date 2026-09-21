import { useState } from 'react'
import { Upload, Mic, BarChart3, ArrowRight, X } from 'lucide-react'
import { useOnboardingStore } from '../store/onboardingStore'

const STEPS = [
  {
    icon: Upload,
    title: 'Upload & target a role',
    desc: 'Add your resume and paste the job description you\'re preparing for. SkillMate reads both to personalize your interview.',
  },
  {
    icon: Mic,
    title: 'Speak or type your answers',
    desc: 'Answer questions out loud — SkillMate transcribes your voice live and speaks each question back to you, just like a real interviewer.',
  },
  {
    icon: BarChart3,
    title: 'Get honest, scored feedback',
    desc: 'After your session, see clarity, relevance, depth, and confidence scores — plus a written summary of what to improve.',
  },
]

export default function OnboardingModal() {
  const [step, setStep] = useState(0)
  const hasSeenOnboarding = useOnboardingStore((s) => s.hasSeenOnboarding)
  const markSeen = useOnboardingStore((s) => s.markSeen)

  if (hasSeenOnboarding) return null

  const isLast = step === STEPS.length - 1
  const current = STEPS[step]
  const Icon = current.icon

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-6 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#131832] border border-white/15 rounded-2xl p-8 shadow-[0_0_60px_rgba(139,92,246,0.25)]">
        <button
          onClick={markSeen}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="w-14 h-14 rounded-full bg-gradient-aurora flex items-center justify-center mb-6">
          <Icon size={24} className="text-white" />
        </div>

        <h2 className="font-display text-2xl text-white mb-2">{current.title}</h2>
        <p className="text-white/65 text-sm leading-relaxed mb-8">{current.desc}</p>

        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            {STEPS.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === step ? 'w-6 bg-gradient-aurora' : 'w-1.5 bg-white/15'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => (isLast ? markSeen() : setStep((s) => s + 1))}
            className="bg-gradient-aurora px-5 py-2.5 rounded-lg font-semibold text-sm text-white inline-flex items-center gap-2 shadow-[0_0_25px_rgba(139,92,246,0.35)]"
          >
            {isLast ? "Let's go" : 'Next'} <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}