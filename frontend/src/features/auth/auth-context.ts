import { createContext } from 'react'
import type { SessionUser } from '@/types/auth'

export interface AuthContextValue {
  user: SessionUser | null
  isAuthenticated: boolean
  login: (email: string, password: string) => boolean
  loginAsDemo: (email: string) => boolean
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
