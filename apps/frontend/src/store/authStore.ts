import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  token: string | null
  userEmail: string | null
  userName: string | null
  profileImage: string | null

  setAuth: (
    token: string,
    email: string,
    name: string
  ) => void

  setProfileImage: (image: string | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userEmail: null,
      userName: null,
      profileImage: null,

      setAuth: (token, email, name) =>
        set({
          token,
          userEmail: email,
          userName: name,
        }),

      setProfileImage: (image) =>
        set({
          profileImage: image,
        }),

      logout: () =>
        set({
          token: null,
          userEmail: null,
          userName: null,
          profileImage: null,
        }),
    }),
    {
      name: 'skillmate-auth',
    }
  )
)