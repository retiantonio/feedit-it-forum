import { useState } from 'react'
import { X, CheckCircle } from 'lucide-react'
import { reportService } from '../../services/reportService'
import './ReportModal.css'

import { getErrorMessage } from '../../utils/errorHelper'

const ReportModal = ({ postId, onClose }) => {
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!reason.trim()) {
      setError('Please provide a reason for your report')
      return
    }

    setLoading(true)
    setError('')

    try {
      await reportService.submitReport(postId, reason)
      setSuccess(true)
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='report-modal-overlay' onClick={onClose}>
      <div className='report-modal' onClick={(e) => e.stopPropagation()}>
        <div className='report-modal-header'>
          <h2>Report This Post</h2>
          <button className='report-modal-close' onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {success ? (
          <div className='report-modal-success'>
            <CheckCircle size={48} className='success-icon' />
            <p>Report submitted successfully!</p>
            <p className='success-subtitle'>Thank you for helping keep our community safe.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className='report-modal-form'>
            <div className='form-group'>
              <label htmlFor='reason'>Why are you reporting this post?</label>
              <textarea
                id='reason'
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder='Please describe why you believe this post violates our community guidelines...'
                rows='5'
                disabled={loading}
              />
            </div>

            {error && <div className='report-modal-error'>{error}</div>}

            <div className='report-modal-actions'>
              <button type='button' className='btn-cancel' onClick={onClose} disabled={loading}>
                Cancel
              </button>
              <button type='submit' className='btn-submit' disabled={loading || !reason.trim()}>
                {loading ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default ReportModal
