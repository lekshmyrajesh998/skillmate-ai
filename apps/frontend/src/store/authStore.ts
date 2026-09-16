import { create } from 'zustand'

interface AuthState {
  token: string | null
  userEmail: string | null
  setAuth: (token: string, email: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  userEmail: null,
  setAuth: (token, email) => set({ token, userEmail: email }),
  logout: () => set({ token: null, userEmail: null }),
}))