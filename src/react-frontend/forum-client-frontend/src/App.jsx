import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import QuestionPage from './pages/QuestionPage'
import ModeratorDashboard from './pages/ModeratorDashboard'
import ProtectedModeratorRoute from './components/auth/ProtectedModeratorRoute'

function App() {
  return (
    <Routes>
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />
      <Route path='/' element={<HomePage />} />
      <Route path='/questions/:id' element={<QuestionPage />} />
      <Route
        path='/moderator'
        element={
          <ProtectedModeratorRoute>
            <ModeratorDashboard />
          </ProtectedModeratorRoute>
        }
      />
    </Routes>
  )
}

export default App
