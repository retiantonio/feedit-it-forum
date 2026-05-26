import { Navigate } from 'react-router-dom'

import authService from '../../services/authService'

const ProtectedModeratorRoute = ({ children }) => {
  const user = authService.getCurrentUser()

  if (!user) {
    return <Navigate to='/login' replace />
  }

  if (user.role !== 'MODERATOR') {
    return <Navigate to='/' replace />
  }

  return children
}

export default ProtectedModeratorRoute
