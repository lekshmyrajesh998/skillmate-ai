import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom'

import './index.css'

import Home from './pages/Home.tsx'
import Login from './pages/Login.tsx'
import Signup from './pages/Signup.tsx'
import Dashboard from './pages/Dashboard.tsx'
import Interview from './pages/Interview.tsx'
import Feedback from './pages/Feedback.tsx'
import History from './pages/History.tsx'
import Profile from './pages/Profile.tsx'
import Settings from './pages/Settings.tsx'
import NotFound from './pages/NotFound.tsx'
import Sidebar from './components/Sidebar.tsx'

function AppLayout() {
  const location = useLocation()

  const publicRoutes = ['/', '/login', '/signup']

  const isPublicRoute = publicRoutes.includes(
    location.pathname
  )

  return (
    <>
      <Sidebar />

      <div
        className={
          isPublicRoute
            ? 'min-h-screen w-full'
            : 'min-h-screen w-full md:pl-56'
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/interview" element={<Interview />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/history" element={<History />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  </StrictMode>,
)