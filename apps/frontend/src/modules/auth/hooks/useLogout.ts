import { useNavigate } from 'react-router-dom'
import { endSession } from '../services/auth.service'

export function useLogout() {
  const navigate = useNavigate()
  return () => {
    endSession()
    navigate('/login', { replace: true })
  }
}
