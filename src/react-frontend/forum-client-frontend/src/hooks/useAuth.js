import { useNavigate } from 'react-router-dom'
import authService from '../services/authService'

export const useAuth = () => {
  const navigate = useNavigate()
  const user = authService.getCurrentUser()
  const isAuthenticated = !!user

  const requireAuth = (callback) => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    callback()
  }

  return { user, isAuthenticated, requireAuth }
}
