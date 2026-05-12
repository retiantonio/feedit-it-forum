import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './Auth.css'

import authService from '../services/authService'

function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = await authService.login(form.username, form.password)
      console.log('Logged in successfully:', data)

      // Redirect to home or dashboard
      navigate('/')
    } catch (error) {
      const resMessage =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()

      alert('Login failed: ' + resMessage)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className='auth-page'>
      <div className='auth-glow' />
      <div className='auth-card'>
        <div className='auth-icon'>✦</div>
        <h1 className='auth-logo'>
          FEED<span>IT</span>
        </h1>
        <p className='auth-subtitle'>Execute secure login to the stack</p>

        <form onSubmit={handleSubmit} className='auth-form'>
          <input
            name='username'
            placeholder='Username'
            className='auth-input'
            onChange={handleChange}
            required
          />
          <input
            name='password'
            type='password'
            placeholder='Password'
            className='auth-input'
            onChange={handleChange}
            required
          />

          <button type='submit' className='auth-btn' disabled={loading}>
            {loading ? 'CONNECTING...' : 'SIGN IN'} <span>→</span>
          </button>
        </form>

        <div className='auth-footer'>
          New here?{' '}
          <Link to='/register' className='auth-link'>
            Create Account
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
