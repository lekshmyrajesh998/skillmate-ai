import { useState, useEffect } from 'react'
import { Save, Lock, User as UserIcon, Bell, Palette, ShieldAlert, Calendar, Check } from 'lucide-react'
import { api } from '../lib/api'
import { useAuthStore } from '../store/authStore'

type Tab = 'profile' | 'security' | 'preferences' | 'danger'

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!enabled)} className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${enabled ? 'bg-gradient-aurora' : ''}`} style={!enabled ? { background: 'var(--border)' } : {}}>
      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  )
}

export default function Settings() {
  const [tab, setTab] = useState<Tab>('profile')
  const userName = useAuthStore((s) => s.userName)
  const userEmail = useAuthStore((s) => s.userEmail)
  const token = useAuthStore((s) => s.token)
  const setAuth = useAuthStore((s) => s.setAuth)
  const logout = useAuthStore((s) => s.logout)

  const [name, setName] = useState(userName || '')
  const [createdAt, setCreatedAt] = useState<string | null>(null)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const [emailReminders, setEmailReminders] = useState(() => localStorage.getItem('pref-email-reminders') !== 'false')
  const [voiceAutoplay, setVoiceAutoplay] = useState(() => localStorage.getItem('pref-voice-autoplay') !== 'false')
  const [defaultDifficulty, setDefaultDifficulty] = useState(() => localStorage.getItem('pref-difficulty') || 'mid')

  useEffect(() => { api.get('/auth/me').then((res) => setCreatedAt(res.data.createdAt)).catch(() => {}) }, [])
  useEffect(() => { localStorage.setItem('pref-email-reminders', String(emailReminders)) }, [emailReminders])
  useEffect(() => { localStorage.setItem('pref-voice-autoplay', String(voiceAutoplay)) }, [voiceAutoplay])
  useEffect(() => { localStorage.setItem('pref-difficulty', defaultDifficulty) }, [defaultDifficulty])

  const clearMessages = () => { setMessage(''); setError('') }

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault(); clearMessages(); setSaving(true)
    try {
      const res = await api.patch('/auth/me', { name })
      setAuth(token!, userEmail!, res.data.user.name)
      setMessage('Name updated successfully.')
    } catch (err: any) { setError(err.response?.data?.error || 'Could not update name') } finally { setSaving(false) }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault(); clearMessages()
    if (!currentPassword || !newPassword) { setError('Fill in both password fields'); return }
    setSaving(true)
    try {
      await api.patch('/auth/me', { currentPassword, newPassword })
      setMessage('Password changed successfully.')
      setCurrentPassword(''); setNewPassword('')
    } catch (err: any) { setError(err.response?.data?.error || 'Could not change password') } finally { setSaving(false) }
  }

  const initials = (userName || userEmail || '?').charAt(0).toUpperCase()
  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'preferences', label: 'Preferences', icon: Palette },
    { id: 'danger', label: 'Danger zone', icon: ShieldAlert },
  ]

  const inputStyle = { background: 'var(--bg-page)', border: '1px solid var(--border)', color: 'var(--text-primary)' }

  return (
    <div className="min-h-screen relative overflow-hidden md:pl-56 pt-16 pb-20 md:pt-0 md:pb-0" style={{ background: 'linear-gradient(180deg, var(--bg-page) 0%, var(--bg-page-2) 100%)', color: 'var(--text-primary)' }}>
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-14 h-14 rounded-full bg-gradient-aurora flex items-center justify-center font-display text-xl shrink-0 text-white">{initials}</div>
          <div>
            <h1 className="font-display text-2xl">Settings</h1>
            {createdAt && (
              <p className="text-sm flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                <Calendar size={12} /> Member since {new Date(createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
              </p>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => { setTab(id); clearMessages() }}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm whitespace-nowrap transition-colors"
                style={{ color: tab === id ? 'var(--accent-1)' : 'var(--text-secondary)', background: tab === id ? 'var(--border)' : 'transparent', fontWeight: tab === id ? 500 : 400 }}>
                <Icon size={16} /> {label}
              </button>
            ))}
          </div>

          <div className="md:col-span-3">
            {message && <p className="text-sm px-3 py-2 rounded-lg mb-5 flex items-center gap-2" style={{ color: 'var(--accent-3)', background: 'var(--border)' }}><Check size={14} /> {message}</p>}
            {error && <p className="text-sm text-red-500 bg-red-500/10 border border-red-500/25 px-3 py-2 rounded-lg mb-5">{error}</p>}

            {tab === 'profile' && (
              <form onSubmit={handleSaveName} className="surface rounded-2xl p-6">
                <h2 className="font-semibold mb-1">Profile information</h2>
                <p className="text-xs mb-5" style={{ color: 'var(--text-tertiary)' }}>Update your display name.</p>
                <label className="block text-sm mb-1.5" style={{ color: 'var(--text-secondary)' }}>Full name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg px-3 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2" style={inputStyle} />
                <label className="block text-sm mb-1.5" style={{ color: 'var(--text-secondary)' }}>Email</label>
                <input disabled value={userEmail || ''} className="w-full rounded-lg px-3 py-2.5 text-sm mb-5 cursor-not-allowed" style={{ ...inputStyle, opacity: 0.5 }} />
                <button type="submit" disabled={saving} className="bg-gradient-aurora text-white px-5 py-2.5 rounded-lg font-semibold text-sm inline-flex items-center gap-2 disabled:opacity-50">
                  <Save size={14} /> Save changes
                </button>
              </form>
            )}

            {tab === 'security' && (
              <form onSubmit={handleChangePassword} className="surface rounded-2xl p-6">
                <h2 className="font-semibold mb-1">Change password</h2>
                <p className="text-xs mb-5" style={{ color: 'var(--text-tertiary)' }}>Choose a strong password you don't use elsewhere.</p>
                <label className="block text-sm mb-1.5" style={{ color: 'var(--text-secondary)' }}>Current password</label>
                <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full rounded-lg px-3 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2" style={inputStyle} />
                <label className="block text-sm mb-1.5" style={{ color: 'var(--text-secondary)' }}>New password</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="At least 6 characters" className="w-full rounded-lg px-3 py-2.5 text-sm mb-5 focus:outline-none focus:ring-2" style={inputStyle} />
                <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50" style={{ background: 'var(--border)', color: 'var(--text-primary)' }}>
                  Update password
                </button>
              </form>
            )}

            {tab === 'preferences' && (
              <div className="space-y-4">
                <div className="surface rounded-2xl p-6">
                  <h2 className="font-semibold mb-4">Interview experience</h2>
                  <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                    <div className="flex items-center gap-3">
                      <Bell size={16} style={{ color: 'var(--accent-3)' }} />
                      <div>
                        <p className="text-sm">Email reminders</p>
                        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Get notified to keep practicing regularly</p>
                      </div>
                    </div>
                    <Toggle enabled={emailReminders} onChange={setEmailReminders} />
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <Palette size={16} style={{ color: 'var(--accent-2)' }} />
                      <div>
                        <p className="text-sm">AI voice autoplay</p>
                        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Automatically speak each question aloud</p>
                      </div>
                    </div>
                    <Toggle enabled={voiceAutoplay} onChange={setVoiceAutoplay} />
                  </div>
                </div>

                <div className="surface rounded-2xl p-6">
                  <h2 className="font-semibold mb-1">Default interview difficulty</h2>
                  <p className="text-xs mb-4" style={{ color: 'var(--text-tertiary)' }}>Applied automatically on your next new session.</p>
                  <div className="flex gap-2">
                    {(['junior', 'mid', 'senior'] as const).map((level) => (
                      <button key={level} onClick={() => setDefaultDifficulty(level)}
                        className={level === defaultDifficulty ? 'bg-gradient-aurora text-white px-4 py-2 rounded-lg text-sm capitalize' : 'px-4 py-2 rounded-lg text-sm capitalize transition-colors'}
                        style={level !== defaultDifficulty ? { background: 'var(--bg-page)', border: '1px solid var(--border)', color: 'var(--text-secondary)' } : {}}>
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {tab === 'danger' && (
              <div className="rounded-2xl p-6" style={{ background: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
                <h2 className="font-semibold text-red-500 mb-1">Log out everywhere</h2>
                <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>This will sign you out on this device immediately.</p>
                <button onClick={logout} className="bg-red-500/15 border border-red-500/40 text-red-500 px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-red-500/25 transition-colors">
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}