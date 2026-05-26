import { useState, useEffect } from 'react'
import { MessageSquare, Flag } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import VotePanel from '../ui/VotePanel'
import PostActionsMenu from '../ui/PostActionsMenu'
import { questionService, categoryService } from '../../services/feedService'

import { getErrorMessage } from '../../utils/errorHelper'

import './QuestionCard.css'

const QuestionCard = ({ question, onQuestionUpdated, onQuestionDeleted }) => {
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(question.title)
  const [editedBody, setEditedBody] = useState(question.body)
  const [editedCategories, setEditedCategories] = useState(question.categoryIds || [])
  const [isSaving, setIsSaving] = useState(false)
  const [allCategories, setAllCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(false)

  const [error, setError] = useState('')

  useEffect(() => {
    loadAllCategories()
  }, [])

  const loadAllCategories = async () => {
    try {
      setLoadingCategories(true)
      const res = await categoryService.getAll()
      setAllCategories(res.data)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoadingCategories(false)
    }
  }

  const handleEdit = (e) => {
    if (e) e.stopPropagation()
    setIsEditing(true)
  }

  const toggleCategory = (catId) => {
    setEditedCategories((prev) => {
      const categoryIds = Array.isArray(prev[0]) ? prev.map((c) => c.id) : prev
      return categoryIds.includes(catId)
        ? categoryIds.filter((c) => c !== catId)
        : [...categoryIds, catId]
    })
  }

  const handleSaveEdit = async (e) => {
    if (e) e.stopPropagation()

    const categoryIds = Array.isArray(editedCategories[0])
      ? editedCategories.map((c) => c.id)
      : editedCategories

    if (!editedTitle.trim() || !editedBody.trim() || categoryIds.length === 0) {
      setError('Title, body, and at least one category are required')
      return
    }

    setIsSaving(true)
    try {
      const updatedQuestion = await questionService.update(question.id, {
        title: editedTitle,
        body: editedBody,
        categoryIds: categoryIds,
      })
      setIsEditing(false)
      if (onQuestionUpdated) {
        onQuestionUpdated(updatedQuestion.data)
      }
    } catch (error) {
      setError(getErrorMessage(error))
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancelEdit = (e) => {
    if (e) e.stopPropagation()
    setIsEditing(false)
    setEditedTitle(question.title)
    setEditedBody(question.body)
    setEditedCategories(question.categoryIds || [])
    setError('')
  }

  const handleDelete = async () => {
    try {
      await questionService.delete(question.id)
      if (onQuestionDeleted) {
        onQuestionDeleted(question.id)
      }
    } catch (error) {
      setError(getErrorMessage(error))
    }
  }

  const getCategoryById = (id) => allCategories.find((c) => c.id === id)

  const getEditedCategoryIds = () => {
    if (!Array.isArray(editedCategories)) return []
    return editedCategories.map((c) => (typeof c === 'object' ? c.id : c))
  }

  const getDisplayCategories = () => {
    if (!question.categoryIds) return []
    return question.categoryIds.map((cat) => {
      if (typeof cat === 'object') {
        return cat
      }

      return getCategoryById(cat) || { id: cat, name: `Category ${cat}`, color: '#b44fff' }
    })
  }

  return (
    <div className='q-card' onClick={() => !isEditing && navigate(`/questions/${question.id}`)}>
      <VotePanel question={question} />

      <div className='q-content'>
        <div className='q-header'>
          <div className='tag-container'>
            {getDisplayCategories().map((cat, index) => (
              <span
                key={index}
                className='tag-badge'
                style={{
                  backgroundColor: `${cat.color}20`,
                  color: cat.color,
                  borderColor: cat.color,
                }}
              >
                {cat.name}
              </span>
            ))}
            {question.flagged && <Flag className='flag-icon' size={14} />}
          </div>
          <PostActionsMenu
            postId={question.id}
            ownerId={question.ownerId}
            ownerUsername={question.ownerUsername}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        {isEditing ? (
          <div className='q-edit-form' onClick={(e) => e.stopPropagation()}>
            <input
              type='text'
              className='q-edit-input'
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              placeholder='Question title'
            />
            <textarea
              className='q-edit-textarea'
              value={editedBody}
              onChange={(e) => setEditedBody(e.target.value)}
              placeholder='Question body'
            />
            <div className='q-edit-categories'>
              <label className='q-edit-category-label'>Categories</label>
              <div className='q-edit-category-grid'>
                {loadingCategories ? (
                  <div>Loading categories...</div>
                ) : allCategories.length === 0 ? (
                  <div>No categories available</div>
                ) : (
                  allCategories.map((cat) => {
                    const editedIds = getEditedCategoryIds()
                    const isSelected = editedIds.includes(cat.id)
                    return (
                      <span
                        key={cat.id}
                        className={`q-edit-category-pill ${isSelected ? 'selected' : ''}`}
                        onClick={() => toggleCategory(cat.id)}
                        style={{
                          borderColor: isSelected ? cat.color : 'rgba(180, 79, 255, 0.3)',
                          backgroundColor: isSelected ? `${cat.color}20` : 'transparent',
                          color: isSelected ? cat.color : '#b0b0b0',
                        }}
                      >
                        {cat.name}
                      </span>
                    )
                  })
                )}
              </div>
            </div>

            {error && <div className='main-error'>{error}</div>}

            <div className='q-edit-actions'>
              <button className='q-edit-btn save-btn' onClick={handleSaveEdit} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save'}
              </button>
              <button className='q-edit-btn cancel-btn' onClick={handleCancelEdit}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <h3 className='q-title'>{question.title}</h3>

            <p className='q-body-preview'>{question.body}</p>
          </>
        )}

        <div className='q-card-meta'>
          <span>
            By <strong>@{question.ownerUsername}</strong>
          </span>

          <span>•</span>

          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MessageSquare size={14} /> {question.answerCount} Answers
          </span>

          <span>•</span>

          <span>
            {new Date(question.createdAt).toLocaleString()} (Updated:{' '}
            {new Date(question.updatedAt).toLocaleString()})
          </span>
        </div>
      </div>
    </div>
  )
}

export default QuestionCard
