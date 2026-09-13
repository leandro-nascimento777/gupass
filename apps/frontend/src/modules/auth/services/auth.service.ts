/**
 * Service — regra de aplicação de autenticação. Não depende de React; orquestra
 * o adapter de sessão (`useAuthStore`, que fala com sessionStorage) e é o único
 * lugar que decide "o que significa autenticar/encerrar sessão". A view nunca
 * chama o store diretamente, só os hooks deste módulo (useAuth/useLogin/useLogout).
 */
import { useAuthStore } from '@/lib/stores/auth-store'

export function authenticate(email: string) {
  // Mock: qualquer credencial autentica. O backend real (auth de verdade) fica
  // fora do escopo deste frontend — ver docs/SPEC_INICIO_PROJETO_FIXPASS_CLONE.md.
  useAuthStore.getState().login(email)
}

export function endSession() {
  useAuthStore.getState().logout()
}
