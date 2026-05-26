import { useState } from 'react'
import { Flag } from 'lucide-react'
import ReportModal from './ReportModal'
import { useAuth } from '../../hooks/useAuth'

const ReportButton = ({ postId, className = 'answer-action-btn' }) => {
  const [showReportModal, setShowReportModal] = useState(false)
  const { requireAuth } = useAuth()

  const handleClick = () => {
    requireAuth(() => {
      setShowReportModal(true)
    })
  }

  return (
    <>
      <button className={className} onClick={handleClick}>
        <Flag size={14} /> Report
      </button>
      {showReportModal && (
        <ReportModal postId={postId} onClose={() => setShowReportModal(false)} />
      )}
    </>
  )
}

export default ReportButton
