import { useState, useEffect } from 'react'
import { MessageSquare, Share2 } from 'lucide-react'

import HorizontalVotePanel from '../ui/HorizontalVotePanel'
import AnswerForm from './AnswerForm'
import PostActionsMenu from '../ui/PostActionsMenu'
import { useAuth } from '../../hooks/useAuth'

import { answerService } from '../../services/feedService'
import './AnswerCard.css'

const MAX_AUTO_LOAD_DEPTH = 2

const AnswerCard = ({ answer, depth = 0, onAnswerUpdated, onAnswerDeleted }) => {
  const [replies, setReplies] = useState([])
  const [repliesLoaded, setRepliesLoaded] = useState(false)
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedBody, setEditedBody] = useState(answer.body)
  const [isSaving, setIsSaving] = useState(false)
  const { requireAuth } = useAuth()

  const initials = answer.ownerUsername ? answer.ownerUsername.slice(0, 2).toUpperCase() : '??'

  useEffect(() => {
    if (depth <= MAX_AUTO_LOAD_DEPTH && answer.replyCount > 0) {
      answerService
        .getByParentId(answer.id)
        .then((res) => {
          setReplies(res.data)
          setRepliesLoaded(true)
        })
        .catch((err) => console.error('Failed to load replies:', err))
    }
  }, [answer.id, depth, answer.replyCount])

  const handleLoadReplies = async () => {
    if (!repliesLoaded) {
      try {
        const res = await answerService.getByParentId(answer.id)
        setReplies(res.data)
        setRepliesLoaded(true)
      } catch (err) {
        console.error('Failed to load replies:', err)
      }
    }
    setCollapsed(false)
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSaveEdit = async () => {
    if (!editedBody.trim()) {
      alert('Answer body cannot be empty')
      return
    }

    setIsSaving(true)
    try {
      const updatedAnswer = await answerService.update(answer.id, {
        body: editedBody,
      })
      setIsEditing(false)
      if (onAnswerUpdated) {
        onAnswerUpdated(updatedAnswer.data)
      }
    } catch (error) {
      console.error('Failed to update answer:', error)
      alert('Failed to update answer')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditedBody(answer.body)
  }

  const handleDelete = async () => {
    try {
      await answerService.delete(answer.id)
      if (onAnswerDeleted) {
        onAnswerDeleted(answer.id)
      }
    } catch (error) {
      console.error('Failed to delete answer:', error)
      alert('Failed to delete answer')
    }
  }

  return (
    <div className='answer-card'>
      <div className='answer-thread-line'>
        <div className='answer-avatar'>{initials}</div>
        {!collapsed && (
          <div
            className='answer-thread-bar'
            onClick={() => setCollapsed(true)}
            title='Collapse thread'
          />
        )}
      </div>

      <div className='answer-content'>
        <div className='answer-card-header'>
          <div className='answer-header-info'>
            <span className='answer-username'>@{answer.ownerUsername}</span>
            <span className='answer-date'>
              {new Date(answer.createdAt).toLocaleString()} (Updated:{' '}
              {new Date(answer.updatedAt).toLocaleString()})
            </span>
          </div>
        </div>

        {collapsed ? (
          <span className='expand-btn' onClick={handleLoadReplies}>
            [expand]
          </span>
        ) : (
          <>
            {isEditing ? (
              <div className='answer-edit-form'>
                <textarea
                  className='answer-edit-textarea'
                  value={editedBody}
                  onChange={(e) => setEditedBody(e.target.value)}
                  placeholder='Edit your answer...'
                />
                <div className='answer-edit-actions'>
                  <button
                    className='answer-edit-btn save-btn'
                    onClick={handleSaveEdit}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                  <button className='answer-edit-btn cancel-btn' onClick={handleCancelEdit}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className='answer-body'>{answer.body}</p>
            )}

            <div className='answer-action-row'>
              <HorizontalVotePanel answer={answer} />

              <button
                className='answer-action-btn'
                onClick={() => {
                  requireAuth(() => {
                    setShowReplyForm((v) => !v)
                  })
                }}
              >
                <MessageSquare size={14} /> Reply
              </button>

              <button className='answer-action-btn'>
                <Share2 size={14} /> Share
              </button>

              <PostActionsMenu
                postId={answer.id}
                ownerId={answer.ownerId}
                ownerUsername={answer.ownerUsername}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isAnswer={true}
              />
            </div>

            {showReplyForm && (
              <AnswerForm
                placeholder='Write your reply...'
                buttonLabel='Reply →'
                onSubmit={async (body) => {
                  const res = await answerService.create(answer.id, body)
                  setReplies((prev) => [...prev, res.data])
                  setRepliesLoaded(true)
                  setShowReplyForm(false)
                }}
              />
            )}

            {depth > MAX_AUTO_LOAD_DEPTH && !repliesLoaded && answer.replyCount > 0 && (
              <button className='answer-action-btn' onClick={handleLoadReplies}>
                <MessageSquare size={13} /> View {answer.replyCount} replies
              </button>
            )}

            {repliesLoaded && replies.length > 0 && (
              <div className='answer-replies'>
                {replies.map((reply) => (
                  <AnswerCard
                    key={reply.id}
                    answer={reply}
                    depth={depth + 1}
                    onAnswerUpdated={onAnswerUpdated}
                    onAnswerDeleted={onAnswerDeleted}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default AnswerCard
