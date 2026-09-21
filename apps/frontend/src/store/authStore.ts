import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  token: string | null
  userEmail: string | null
  userName: string | null
  setAuth: (token: string, email: string, name: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userEmail: null,
      userName: null,
      setAuth: (token, email, name) => set({ token, userEmail: email, userName: name }),
      logout: () => set({ token: null, userEmail: null, userName: null }),
    }),
    { name: 'skillmate-auth' } // localStorage key
  )
)