import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
  const userJson = localStorage.getItem('user')

  if (!userJson) {
    return <Navigate to='/login' replace />
  }

  return children
}

export default ProtectedRoute
