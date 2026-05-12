import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './Auth.css' // Make sure the path to your CSS is correct!

function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) return setError('Passwords do not match')

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      navigate('/login')
    }, 1500)
  }

  return (
    <div className='auth-page'>
      <div className='auth-glow' />
      <div className='auth-card'>
        <div className='auth-icon'>✦</div>
        <h1 className='auth-logo'>
          FEED<span>IT</span>
        </h1>
        <p className='auth-subtitle'>Initialize your member profile</p>

        <form onSubmit={handleSubmit} className='auth-form'>
          <input
            name='username'
            placeholder='Username'
            className='auth-input'
            onChange={handleChange}
            required
          />
          <input
            name='email'
            type='email'
            placeholder='Email'
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
          <input
            name='confirmPassword'
            type='password'
            placeholder='Confirm Password'
            className='auth-input'
            onChange={handleChange}
            required
          />

          {error && <div className='error-msg'>{error}</div>}

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
