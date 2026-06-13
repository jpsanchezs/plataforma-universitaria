import {
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { findUserByCredentials } from '@/data/mockUsers'
import {
  AuthContext,
  type AuthContextValue,
} from '@/features/auth/auth-context'
import type { Role, SessionUser } from '@/types/auth'
import {
  SESSION_STORAGE_KEY,
  toSessionUser,
} from '@/utils/permissions'

const VALID_ROLES: Role[] = [
  'estudiante',
  'docente',
  'administrativo',
  'financiero',
  'ejecutivo',
  'director-proyecto',
]

function isValidSessionUser(value: unknown): value is SessionUser {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Record<string, unknown>
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.fullName === 'string' &&
    typeof candidate.email === 'string' &&
    typeof candidate.avatarInitials === 'string' &&
    typeof candidate.defaultPath === 'string' &&
    typeof candidate.role === 'string' &&
    VALID_ROLES.includes(candidate.role as Role)
  )
}

function readStoredSession(): SessionUser | null {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY)
    if (!raw) {
      return null
    }

    const parsed: unknown = JSON.parse(raw)
    if (!isValidSessionUser(parsed)) {
      localStorage.removeItem(SESSION_STORAGE_KEY)
      return null
    }

    return parsed
  } catch {
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY)
    } catch {
      // Ignorar errores al limpiar sesión corrupta
    }
    return null
  }
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<SessionUser | null>(() => readStoredSession())

  const persistSession = useCallback((sessionUser: SessionUser | null) => {
    if (sessionUser) {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionUser))
    } else {
      localStorage.removeItem(SESSION_STORAGE_KEY)
    }
    setUser(sessionUser)
  }, [])

  const login = useCallback(
    (email: string, password: string) => {
      const matchedUser = findUserByCredentials(email, password)
      if (!matchedUser) {
        return false
      }
      persistSession(toSessionUser(matchedUser))
      return true
    },
    [persistSession],
  )

  const loginAsDemo = useCallback(
    (email: string) => {
      return login(email, 'demo123')
    },
    [login],
  )

  const logout = useCallback(() => {
    persistSession(null)
  }, [persistSession])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      login,
      loginAsDemo,
      logout,
    }),
    [user, login, loginAsDemo, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
