import { useState } from 'react'
import { Loader2 } from 'lucide-react'

import { getErrorMessage } from '../../utils/errorHelper'

import { useAuth } from '../../hooks/useAuth'

import './AnswerForm.css'

const AnswerForm = ({
  onSubmit,
  placeholder = 'Write your answer...',
  buttonLabel = 'Post Answer →',
}) => {
  const [body, setBody] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { isAuthenticated, requireAuth } = useAuth()
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!body.trim()) return

    requireAuth(async () => {
      setSubmitting(true)
      try {
        await onSubmit(body)
        setBody('')
      } catch (err) {
        setError(getErrorMessage(err))
      } finally {
        setSubmitting(false)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className='reply-form'>
      <textarea
        className='reply-input'
        placeholder={placeholder}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        required
      />

      {error && <div className='q-page-error'>{error}</div>}

      <div className='reply-form-actions'>
        <button type='submit' className='reply-submit-btn' disabled={submitting}>
          {submitting ? <Loader2 size={14} className='animate-spin' /> : null}
          {submitting ? 'Posting...' : buttonLabel}
        </button>
      </div>
    </form>
  )
}

export default AnswerForm
