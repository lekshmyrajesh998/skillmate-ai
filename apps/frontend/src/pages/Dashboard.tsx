import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { FileText, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react'
import { api } from '../lib/api'

const KNOWN_SKILLS = [
  'React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Azure', 'Docker',
  'Kubernetes', 'SQL', 'MongoDB', 'GraphQL', 'REST', 'CI/CD', 'Java',
  'Angular', 'PostgreSQL', 'LangChain', 'RAG', 'Microservices',
]

export default function Dashboard() {
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const navigate = useNavigate()
  const userEmail = useAuthStore((s) => s.userEmail)

  const step1Done = !!resumeFile
  const step2Done = jobDescription.trim().length > 0

  const detectedSkills = useMemo(() => {
    if (!jobDescription) return []
    return KNOWN_SKILLS.filter((skill) => jobDescription.toLowerCase().includes(skill.toLowerCase()))
  }, [jobDescription])

 const handleStartInterview = async () => {
  if (!resumeFile || !jobDescription.trim()) {
    alert('Complete both steps before starting')
    return
  }
  setIsUploading(true)
  try {
    // TEMPORARY: sending filename as placeholder resume text until PDF parsing (RAG stage) is built
    const res = await api.post('/sessions', {
      jobDescription,
      resumeText: `Resume file: ${resumeFile.name}`,
    })
    navigate('/interview', { state: { sessionId: res.data.sessionId } })
  } catch (err) {
  console.error('Start interview error:', err)
  alert('Could not start interview. Please try again.')
} finally {
    setIsUploading(false)
  }
}

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white relative overflow-hidden">
      <div className="pointer-events-none absolute -top-40 left-1/3 w-[500px] h-[500px] rounded-full bg-[#7C5CFF] opacity-15 blur-[130px]" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        <div className="mb-10">
          <p className="text-sm font-medium mb-1 bg-gradient-to-r from-[#7C5CFF] to-[#22D3EE] bg-clip-text text-transparent inline-block">
            {userEmail ? `Signed in as ${userEmail}` : 'New session'}
          </p>
          <h1 className="font-display text-3xl">Set up your mock interview</h1>
          <p className="text-white/50 mt-2 max-w-lg">
            Two steps. SkillMate reads both to ask questions grounded in your real experience and the role you're targeting.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${step1Done ? 'bg-gradient-to-r from-[#7C5CFF] to-[#22D3EE]' : 'bg-white/10 text-white/50'}`}>
                  {step1Done ? <CheckCircle2 size={14} /> : '1'}
                </div>
                <h2 className="font-medium">Upload your resume</h2>
              </div>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)}
                className="block w-full text-sm text-white/50 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-[#7C5CFF] file:to-[#22D3EE] file:text-white file:font-medium file:text-sm"
              />
              {resumeFile && (
                <div className="flex items-center gap-2 text-sm text-[#22D3EE] mt-3 bg-white/5 w-fit px-3 py-1.5 rounded-lg border border-white/10">
                  <FileText size={14} /> {resumeFile.name}
                </div>
              )}
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${step2Done ? 'bg-gradient-to-r from-[#7C5CFF] to-[#22D3EE]' : 'bg-white/10 text-white/50'}`}>
                  {step2Done ? <CheckCircle2 size={14} /> : '2'}
                </div>
                <h2 className="font-medium">Paste the target job description</h2>
              </div>
              <textarea
                rows={8}
                placeholder="Paste the full job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C5CFF]/50 focus:border-[#7C5CFF]/50 placeholder:text-white/30"
              />
            </div>

            <button
              onClick={handleStartInterview}
              disabled={isUploading}
              className="w-full bg-gradient-to-r from-[#7C5CFF] to-[#22D3EE] rounded-lg py-3.5 font-medium shadow-[0_0_25px_rgba(124,92,255,0.35)] hover:shadow-[0_0_35px_rgba(124,92,255,0.5)] transition-shadow disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isUploading ? 'Preparing your interview…' : (<>Start mock interview <ArrowRight size={16} /></>)}
            </button>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-fit sticky top-6">
            <div className="flex items-center gap-2 mb-4 text-sm font-medium">
              <Sparkles size={16} className="text-[#22D3EE]" />
              Detected skills
            </div>
            {detectedSkills.length === 0 ? (
              <p className="text-sm text-white/50">Paste a job description to see the skills SkillMate picks up on.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {detectedSkills.map((skill) => (
                  <span key={skill} className="text-xs bg-white/10 border border-white/10 text-[#22D3EE] px-2.5 py-1 rounded-full font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            )}
            <div className="border-t border-white/10 mt-5 pt-5">
              <p className="text-xs text-white/40 leading-relaxed">
                This is a live keyword preview. Once connected to the backend, SkillMate uses embedding-based matching (RAG) for far more accurate role alignment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}