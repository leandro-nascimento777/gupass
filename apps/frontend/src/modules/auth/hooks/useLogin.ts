import { useNavigate } from 'react-router-dom'
import { authenticate } from '../services/auth.service'

/** Hook fino: só chama o service e resolve o redirecionamento pós-login. */
export function useLogin() {
  const navigate = useNavigate()
  return (email: string, redirectTo = '/app') => {
    authenticate(email)
    navigate(redirectTo, { replace: true })
  }
}
