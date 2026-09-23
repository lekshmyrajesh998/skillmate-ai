import { useState } from 'react'
import {
  Upload,
  Mic,
  BarChart3,
  ArrowRight,
  X,
  Check,
  Sparkles,
} from 'lucide-react'
import { useOnboardingStore } from '../store/onboardingStore'

const STEPS = [
  {
    icon: Upload,
    number: '01',
    title: 'Upload & target a role',
    desc: "Add your resume and paste the job description you're preparing for. SkillMate reads both to personalize your interview.",
  },
  {
    icon: Mic,
    number: '02',
    title: 'Speak or type your answers',
    desc: 'Answer questions out loud — SkillMate transcribes your voice live and speaks each question back to you, just like a real interviewer.',
  },
  {
    icon: BarChart3,
    number: '03',
    title: 'Get honest, scored feedback',
    desc: 'After your session, see clarity, relevance, depth, and confidence scores — plus a written summary of what to improve.',
  },
]

export default function OnboardingModal() {
  const [step, setStep] = useState(0)

  const hasSeenOnboarding = useOnboardingStore(
    (s) => s.hasSeenOnboarding
  )
  const markSeen = useOnboardingStore((s) => s.markSeen)

  if (hasSeenOnboarding) return null

  const isLast = step === STEPS.length - 1
  const current = STEPS[step]
  const Icon = current.icon

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 sm:px-6"
      style={{
        background: 'rgba(0, 0, 0, 0.55)',
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute h-[500px] w-[500px] rounded-full blur-[120px]"
        style={{
          background: 'var(--accent-1)',
          opacity: 0.12,
        }}
      />

      <div
        className="relative w-full max-w-lg overflow-hidden rounded-[28px] border shadow-2xl"
        style={{
          background: 'var(--bg-page)',
          borderColor: 'var(--border)',
          color: 'var(--text-primary)',
        }}
      >
        {/* Top gradient line */}
        <div
          className="h-1 w-full"
          style={{
            background:
              'linear-gradient(90deg, var(--accent-1), var(--accent-2), var(--accent-3))',
          }}
        />

        {/* Close */}
        <button
          type="button"
          onClick={markSeen}
          aria-label="Close onboarding"
          className="absolute right-5 top-5 z-10 flex h-8 w-8 items-center justify-center rounded-xl transition-colors"
          style={{
            color: 'var(--text-tertiary)',
            background: 'var(--bg-page-2)',
          }}
        >
          <X size={16} />
        </button>

        <div className="p-6 sm:p-8">
          {/* Brand / step indicator */}
          <div className="mb-7 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-xl text-white"
                style={{
                  background:
                    'linear-gradient(135deg, var(--accent-1), var(--accent-2))',
                }}
              >
                <Sparkles size={15} />
              </div>

              <span className="font-display text-sm font-bold">
                SkillMate <span className="text-gradient">AI</span>
              </span>
            </div>

            <span
              className="rounded-full border px-2.5 py-1 text-[10px] font-semibold"
              style={{
                color: 'var(--text-tertiary)',
                borderColor: 'var(--border)',
                background: 'var(--bg-page-2)',
              }}
            >
              {current.number} / 03
            </span>
          </div>

          {/* Icon */}
          <div
            className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{
              background:
                'linear-gradient(135deg, color-mix(in srgb, var(--accent-1) 13%, transparent), color-mix(in srgb, var(--accent-2) 10%, transparent))',
              color: 'var(--accent-1)',
            }}
          >
            <Icon size={27} strokeWidth={1.8} />
          </div>

          {/* Content */}
          <div className="min-h-[155px]">
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              {current.title}
            </h2>

            <p
              className="mt-3 max-w-md text-sm leading-6"
              style={{ color: 'var(--text-secondary)' }}
            >
              {current.desc}
            </p>
          </div>

          {/* Progress */}
          <div className="mb-7 flex gap-1.5">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: i === step ? '32px' : '7px',
                  background:
                    i === step
                      ? 'linear-gradient(90deg, var(--accent-1), var(--accent-2))'
                      : 'var(--border)',
                }}
              />
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={markSeen}
              className="text-xs font-medium transition-opacity hover:opacity-70"
              style={{ color: 'var(--text-tertiary)' }}
            >
              Skip intro
            </button>

            <button
              type="button"
              onClick={() =>
                isLast
                  ? markSeen()
                  : setStep((s) => s + 1)
              }
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-aurora px-5 py-3 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg"
            >
              {isLast ? (
                <>
                  <Check size={15} />
                  Let's go
                </>
              ) : (
                <>
                  Next
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}