import { useState } from 'react'
import { AlertTriangle, X, Loader2 } from 'lucide-react'
import { moderatorService } from '../../services/moderatorService'
import './UserSuspensionModal.css'

import { getErrorMessage } from '../../utils/errorHelper'

const UserSuspensionModal = ({ ownerId, ownerUsername, onClose }) => {
  const [days, setDays] = useState(7)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const handleSuspend = async () => {
    if (!days || days < 0) {
      setMessage({ type: 'error', text: 'Please enter a valid number of days' })
      return
    }

    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      await moderatorService.suspendUser(ownerId, Number(days))
      setMessage({
        type: 'success',
        text: `@${ownerUsername} suspended for ${days} days`,
      })
      setTimeout(() => {
        onClose()
      }, 1500)
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
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal-content' onClick={(e) => e.stopPropagation()}>
        <div className='modal-header'>
          <div className='modal-title-row'>
            <AlertTriangle size={24} className='modal-icon warning' />
            <h2>Suspend User</h2>
          </div>
          <button className='modal-close' onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className='modal-body'>
          <div className='suspension-info-box'>
            <p>
              You are about to suspend <strong>@{ownerUsername}</strong> (ID: {ownerId})
            </p>
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
              className='form-input'
            />
            <small>Enter 0-365 days. User will be unable to post, comment, or vote.</small>
          </div>

          {message.text && <div className={`message ${message.type}`}>{message.text}</div>}
        </div>

        <div className='modal-footer'>
          <button className='btn-cancel' onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button className='btn-suspend' onClick={handleSuspend} disabled={loading}>
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
        </div>
      </div>
    </div>
  )
}

export default UserSuspensionModal
