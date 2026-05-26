import { useState } from 'react'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { moderatorService } from '../../services/moderatorService'
import './UserSuspensionTab.css'

import { getErrorMessage } from '../../utils/errorHelper'

const UserSuspensionTab = () => {
  const [userId, setUserId] = useState('')
  const [days, setDays] = useState(7)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const handleSuspend = async (e) => {
    e.preventDefault()

    if (!userId || !days) {
      setMessage({ type: 'error', text: 'Please fill in all fields' })
      return
    }

    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      await moderatorService.suspendUser(Number(userId), Number(days))
      setMessage({
        type: 'success',
        text: `User #${userId} suspended for ${days} days`,
      })
      setUserId('')
      setDays(7)
    } catch (err) {
      console.error('Failed to suspend user:', err)
      setMessage({
        type: 'error',
        text: getErrorMessage(err) || 'Failed to suspend user',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='user-suspension-container'>
      <div className='suspension-card'>
        <div className='suspension-header'>
          <AlertTriangle size={24} />
          <h2>Suspend User</h2>
        </div>

        <form onSubmit={handleSuspend} className='suspension-form'>
          <div className='form-group'>
            <label htmlFor='userId'>User ID</label>
            <input
              id='userId'
              type='number'
              placeholder='Enter user ID...'
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className='form-group'>
            <label htmlFor='days'>Suspension Duration (days)</label>
            <input
              id='days'
              type='number'
              min='0'
              max='365'
              placeholder='Number of days'
              value={days}
              onChange={(e) => setDays(e.target.value)}
              disabled={loading}
            />
          </div>

          {message.text && <div className={`message ${message.type}`}>{message.text}</div>}

          <button type='submit' className='btn-suspend' disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={16} className='animate-spin' />
                Suspending...
              </>
            ) : (
              <>
                <AlertTriangle size={16} />
                Suspend User
              </>
            )}
          </button>
        </form>

        <div className='suspension-info'>
          <h3>About Suspensions</h3>
          <ul>
            <li>Suspended users cannot post, comment, or vote</li>
            <li>They can still view content</li>
            <li>Suspension duration is in days (0-365)</li>
            <li>You can suspend the same user multiple times</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default UserSuspensionTab
