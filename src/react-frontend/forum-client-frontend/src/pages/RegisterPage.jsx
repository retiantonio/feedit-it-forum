import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './Auth.css'
import germanShepardFilled from '../assets/german-shepard-filled.svg'
import authService from '../services/authService'

import { getErrorMessage } from '../utils/errorHelper'

function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) return setError('Passwords do not match')
    setLoading(true)
    setError('')

    try {
      await authService.register(form.username, form.email, form.password)
      navigate('/login')
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
        <p className='auth-subtitle'>Initialize your member profile</p>

        <form onSubmit={handleSubmit} className='auth-form'>
          <input
            name='username'
            placeholder='Username'
            className='input-style'
            onChange={handleChange}
            required
          />
          <input
            name='email'
            type='email'
            placeholder='Email'
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
          <input
            name='confirmPassword'
            type='password'
            placeholder='Confirm Password'
            className='input-style'
            onChange={handleChange}
            required
          />

          {error && <div className='auth-error'>{error}</div>}

          <button type='submit' className='auth-btn' disabled={loading}>
            {loading ? 'CREATING...' : 'CREATE ACCOUNT'} <span>→</span>
          </button>
        </form>

        <div className='auth-footer'>
          Already a member?{' '}
          <Link to='/login' className='auth-link'>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
