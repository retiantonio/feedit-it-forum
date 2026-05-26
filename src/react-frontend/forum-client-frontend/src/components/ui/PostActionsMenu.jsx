import { useState, useRef, useEffect } from 'react'
import { MoreHorizontal, Trash2, Edit, Flag, AlertTriangle } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import ReportModal from './ReportModal'
import UserSuspensionModal from '../moderator/UserSuspensionModal'
import './PostActionsMenu.css'

const PostActionsMenu = ({ 
  postId,
  ownerId,
  ownerUsername, 
  onEdit, 
  onDelete,
  isAnswer = false 
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [showSuspensionModal, setShowSuspensionModal] = useState(false)
  const menuRef = useRef(null)
  const { user, requireAuth } = useAuth()

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Check if user is the owner
  const isOwner = user && user.username === ownerUsername
  // Check if user is a moderator
  const isModerator = user && user.role === 'MODERATOR'

  const handleEdit = (e) => {
    e.stopPropagation()
    setIsOpen(false)
    if (onEdit) {
      onEdit()
    }
  }

  const handleDelete = async (e) => {
    e.stopPropagation()
    
    // Confirm deletion
    if (window.confirm(`Are you sure you want to delete this ${isAnswer ? 'answer' : 'question'}?`)) {
      setIsDeleting(true)
      try {
        if (onDelete) {
          await onDelete()
        }
      } finally {
        setIsDeleting(false)
        setIsOpen(false)
      }
    }
  }

  const handleReport = (e) => {
    e.stopPropagation()
    requireAuth(() => {
      setShowReportModal(true)
      setIsOpen(false)
    })
  }

  const handleSuspend = (e) => {
    e.stopPropagation()
    requireAuth(() => {
      setShowSuspensionModal(true)
      setIsOpen(false)
    })
  }

  return (
    <div className='post-actions-menu' ref={menuRef}>
      <button
        className='post-actions-trigger'
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        title='Post options'
      >
        <MoreHorizontal size={18} />
      </button>

      {isOpen && (
        <div className='post-actions-dropdown'>
          {isOwner ? (
            <>
              <button
                className='post-action-item edit-action'
                onClick={handleEdit}
                disabled={isDeleting}
              >
                <Edit size={16} />
                <span>Edit</span>
              </button>

              <button
                className='post-action-item delete-action'
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 size={16} />
                <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
              </button>
            </>
          ) : (
            <>
              <button
                className='post-action-item report-action'
                onClick={handleReport}
              >
                <Flag size={16} />
                <span>Report</span>
              </button>

              {isModerator && (
                <button
                  className='post-action-item suspend-action'
                  onClick={handleSuspend}
                >
                  <AlertTriangle size={16} />
                  <span>Suspend User</span>
                </button>
              )}
            </>
          )}
        </div>
      )}

      {showReportModal && (
        <ReportModal postId={postId} onClose={() => setShowReportModal(false)} />
      )}

      {showSuspensionModal && (
        <UserSuspensionModal
          ownerId={ownerId}
          ownerUsername={ownerUsername}
          onClose={() => setShowSuspensionModal(false)}
        />
      )}
    </div>
  )
}

export default PostActionsMenu
