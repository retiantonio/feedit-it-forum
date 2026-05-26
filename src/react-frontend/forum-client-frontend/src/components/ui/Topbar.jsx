import { useState } from 'react'
import { Search, Plus, ChevronDown, Bell, LogOut, Shield } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import germanShepardFilled from '../../assets/german-shepard-filled.svg'
import authService from '../../services/authService'
import { useAuth } from '../../hooks/useAuth'

import './Topbar.css'

const Topbar = ({ onSearch, user, onCreateClick }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const handleLogout = () => {
    authService.logout()
    setShowProfileMenu(false)
    navigate('/')
  }

  const isModerator = user?.role === 'MODERATOR'

  return (
    <header className='topbar'>
      {/* Left: Logo */}
      <div className='topbar-left'>
        <Link to='/' style={{ textDecoration: 'none' }}>
          <h1 className='top-logo'>
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
        </Link>
      </div>

      {/* Center: Search Bar */}
      <div className='topbar-center'>
        <div className='search-container'>
          <Search className='search-icon' size={18} />
          <input
            type='text'
            className='input-style topbar-search'
            placeholder='Search Feed IT...'
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className='topbar-right'>
        {isAuthenticated ? (
          <>
            <button className='auth-btn top-bar-btn' onClick={onCreateClick}>
              <Plus size={18} /> <span>Create</span>
            </button>

            <div style={{ color: '#888', cursor: 'pointer' }}>
              <Bell size={20} />
            </div>

            {isModerator && (
              <button className='auth-btn top-bar-btn' onClick={() => navigate('/moderator')}>
                <Shield size={18} /> Moderate
              </button>
            )}

            <div className='profile-menu-container'>
              <div className='profile-trigger' onClick={() => setShowProfileMenu(!showProfileMenu)}>
                <div className='avatar'>{user?.username?.charAt(0).toUpperCase() || 'U'}</div>
                <ChevronDown size={16} color='#888' />
              </div>

              {showProfileMenu && (
                <div className='profile-dropdown'>
                  <div className='profile-dropdown-header'>
                    {isModerator && <span className='mod-badge'>MODERATOR</span>}
                    <span>@{user?.username}</span>
                  </div>
                  <button className='logout-btn' onClick={handleLogout}>
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <button
              className='auth-btn top-bar-btn-secondary'
              onClick={() => navigate('/register')}
            >
              Sign Up
            </button>
            <button className='auth-btn top-bar-btn' onClick={() => navigate('/login')}>
              Log In
            </button>
          </>
        )}
      </div>
    </header>
  )
}

export default Topbar
