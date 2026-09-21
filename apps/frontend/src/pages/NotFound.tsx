import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-center px-6 text-center" style={{ background: 'linear-gradient(180deg, #0B0E1A 0%, #131832 100%)' }}>
      <Compass className="text-[#A855F7] mb-4" size={40} />
      <h1 className="font-display text-3xl mb-2">Page not found</h1>
      <p className="text-white/60 mb-6 max-w-sm">
        This page doesn't exist — maybe the interview wrapped up faster than expected.
      </p>
      <Link
        to="/dashboard"
        className="bg-gradient-aurora px-6 py-3 rounded-full font-semibold shadow-[0_0_30px_rgba(139,92,246,0.4)]"
      >
        Back to Dashboard
      </Link>
    </div>
  )
}