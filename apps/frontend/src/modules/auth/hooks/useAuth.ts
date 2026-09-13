import { useAuthStore } from '@/lib/stores/auth-store'

/** Estado de sessão reativo — a única porta de entrada pública do módulo auth. */
export function useAuth() {
  const user = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return { user, isAuthenticated }
}
