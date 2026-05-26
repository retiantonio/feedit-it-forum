import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './Auth.css'

import { getErrorMessage } from '../utils/errorHelper'

import germanShepardFilled from '../assets/german-shepard-filled.svg'

import authService from '../services/authService'

function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = await authService.login(form.username, form.password)

      console.log('Logged in successfully:', data)

      navigate('/')
    } catch (error) {
      setError(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className='auth-page'>
      <div className='moving-bg-layer' />
      <div className='auth-glow' />
      <div className='auth-card'>
        <h1 className='auth-logo'>
          <img
            src={germanShepardFilled}
            alt='German Shepherd'
            style={{
              height: '1.8em',
              marginRight: '-4px',
              filter: 'drop-shadow(0 0 8px rgba(208, 96, 255, 0.8))',
            }}
          />
          FEED<span>IT</span>
        </h1>
        <p className='auth-subtitle'>Execute secure login to the stack</p>

        {error && <div className='auth-error'>{error}</div>}

        <form onSubmit={handleSubmit} className='auth-form'>
          <input
            name='username'
            placeholder='Username'
            className='input-style'
            onChange={handleChange}
            required
          />
          <input
            name='password'
            type='password'
            placeholder='Password'
            className='input-style'
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
