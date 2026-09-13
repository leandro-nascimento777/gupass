import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthUser {
  id: string
  name: string
  email: string
}

interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (email: string) => void
  logout: () => void
}

/**
 * Sessão de autenticação mockada (o backend real de auth fica fora do escopo
 * deste frontend — ver docs/SPEC_INICIO_PROJETO_FIXPASS_CLONE.md). Persistido em
 * sessionStorage só para sobreviver a um F5 durante o desenvolvimento; não é
 * dado de negócio, é estado efêmero de sessão do navegador.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (email) =>
        set({
          isAuthenticated: true,
          user: { id: 'user-1', name: 'Leandro Nascimento', email },
        }),
      logout: () => set({ isAuthenticated: false, user: null }),
    }),
    { name: 'fixpass-auth-session', storage: { getItem: (k) => JSON.parse(sessionStorage.getItem(k) ?? 'null'), setItem: (k, v) => sessionStorage.setItem(k, JSON.stringify(v)), removeItem: (k) => sessionStorage.removeItem(k) } },
  ),
)
