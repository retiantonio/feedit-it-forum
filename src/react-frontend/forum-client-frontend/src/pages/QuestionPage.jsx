import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { questionService } from '../services/feedService'
import { categoryService } from '../services/feedService'

import { getErrorMessage } from '../utils/errorHelper'

import Topbar from '../components/ui/Topbar'
import Sidebar from '../components/ui/Sidebar'
import VotePanel from '../components/ui/VotePanel'
import PostActionsMenu from '../components/ui/PostActionsMenu'
import AnswerCard from '../components/question/AnswerCard'
import AnswerForm from '../components/question/AnswerForm'
import { useAuth } from '../hooks/useAuth'
import { Loader2, ArrowLeft } from 'lucide-react'

import './QuestionPage.css'

import { answerService } from '../services/feedService'

const QuestionPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [question, setQuestion] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState('')
  const [editedBody, setEditedBody] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [editedCategories, setEditedCategories] = useState([])
  const [allCategories, setAllCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(false)

  const [error, setError] = useState('')

  const fetchDetails = useCallback(async () => {
    setLoading(true)
    try {
      const res = await questionService.getById(id)
      setQuestion(res.data)
      setEditedTitle(res.data.title)
      setEditedBody(res.data.body)
      setEditedCategories(res.data.categoryIds || [])
    } catch (error) {
      setError(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }, [id])

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

  const toggleCategory = (catId) => {
    setEditedCategories((prev) => {
      const categoryIds = Array.isArray(prev[0]) ? prev.map((c) => c.id) : prev
      return categoryIds.includes(catId)
        ? categoryIds.filter((c) => c !== catId)
        : [...categoryIds, catId]
    })
  }

  useEffect(() => {
    fetchDetails()
  }, [fetchDetails])

  const [answers, setAnswers] = useState([])
  const [answersLoading, setAnswersLoading] = useState(true)

  const loadAnswers = useCallback(async () => {
    setAnswersLoading(true)
    try {
      const res = await answerService.getByParentId(id)
      setAnswers(res.data)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setAnswersLoading(false)
    }
  }, [id])

  useEffect(() => {
    loadAnswers()
  }, [loadAnswers])

  const handleEditQuestion = () => {
    setIsEditing(true)
  }

  const handleSaveEdit = async () => {
    const categoryIds = Array.isArray(editedCategories[0])
      ? editedCategories.map((c) => c.id)
      : editedCategories

    if (!editedTitle.trim() || !editedBody.trim() || !categoryIds.length) {
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
      setQuestion(updatedQuestion.data)
      setIsEditing(false)
    } catch (error) {
      setError(getErrorMessage(error))
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditedTitle(question.title)
    setEditedBody(question.body)
  }

  const handleDeleteQuestion = async () => {
    try {
      await questionService.delete(question.id)
      navigate('/')
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

  if (loading) {
    return (
      <div className='loading-container'>
        <Loader2 className='animate-spin' color='#b44fff' size={48} />
      </div>
    )
  }

  if (!question) {
    return (
      <div className='error-container'>
        <h2>Question not found.</h2>
        <button className='back-nav-btn' onClick={() => navigate('/')}>
          <ArrowLeft size={16} /> Return to Feed
        </button>
      </div>
    )
  }

  return (
    <div className='app-wrapper'>
      <Topbar user={user} />

      <div className='dashboard-container'>
        <div className='moving-bg-layer' />
        <Sidebar />
        <main className='question-page-root'>
          <button className='back-nav-btn' onClick={() => navigate(-1)}>
            <ArrowLeft size={16} /> Back
          </button>
          <div className='q-detail-card'>
            <VotePanel question={question} />
            <div className='q-content'>
              <div className='q-detail-header'>
                <div className='q-meta-top'>
                  Posted by <span className='highlight'>@{question.ownerUsername}</span>
                  <span>•</span>
                  <span>
                    {new Date(question.createdAt).toLocaleString()} (Updated:{' '}
                    {new Date(question.updatedAt).toLocaleString()})
                  </span>
                </div>
                <PostActionsMenu
                  postId={question.id}
                  ownerId={question.ownerId}
                  ownerUsername={question.ownerUsername}
                  onEdit={handleEditQuestion}
                  onDelete={handleDeleteQuestion}
                />
              </div>

              {isEditing ? (
                <div className='q-edit-form-page'>
                  <input
                    type='text'
                    className='q-edit-input-page'
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    placeholder='Question title'
                  />
                  <textarea
                    className='q-edit-textarea-page'
                    value={editedBody}
                    onChange={(e) => setEditedBody(e.target.value)}
                    placeholder='Question body'
                  />
                  <div className='q-page-edit-categories'>
                    <label className='q-page-edit-category-label'>Categories</label>
                    <div className='q-page-edit-category-grid'>
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
                              className={`q-page-edit-category-pill ${isSelected ? 'selected' : ''}`}
                              onClick={() => toggleCategory(cat.id)}
                              style={{
                                borderColor: isSelected ? cat.color : 'rgba(180, 79, 255, 0.3)',
                                backgroundColor: isSelected ? `${cat.color}20` : 'transparent',
                                color: isSelected ? cat.color : '#a89bc2',
                              }}
                            >
                              {cat.name}
                            </span>
                          )
                        })
                      )}
                    </div>
                  </div>

                  {error && <div className='q-page-error'>{error}</div>}

                  <div className='q-edit-actions-page'>
                    <button
                      className='q-edit-btn-page save-btn'
                      onClick={handleSaveEdit}
                      disabled={isSaving}
                    >
                      {isSaving ? 'Saving...' : 'Save'}
                    </button>
                    <button className='q-edit-btn-page cancel-btn' onClick={handleCancelEdit}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
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
                  </div>
                  <h1 className='q-title-large'>{question.title}</h1>
                  <p className='q-body-text'>{question.body}</p>
                </>
              )}
            </div>
          </div>

          <div className='answers-section'>
            <AnswerForm
              placeholder='Write your answer...'
              buttonLabel='Post Answer →'
              onSubmit={async (body) => {
                const res = await answerService.create(question.id, body)
                setAnswers((prev) => [...prev, res.data])
              }}
            />

            <div className='section-label'>
              <span className='answer-count'>{answers.length} ANSWERS</span>
            </div>

            {answersLoading ? (
              <div className='loading-state'>
                <Loader2 className='animate-spin' color='#FF6B00' size={32} />
              </div>
            ) : answers.length > 0 ? (
              answers.map((answer) => (
                <AnswerCard
                  key={answer.id}
                  answer={answer}
                  onAnswerUpdated={(updatedAnswer) => {
                    setAnswers((prev) =>
                      prev.map((a) => (a.id === updatedAnswer.id ? updatedAnswer : a))
                    )
                  }}
                  onAnswerDeleted={(answerId) => {
                    loadAnswers()
                  }}
                />
              ))
            ) : (
              <div className='no-answers'>No answers yet — be the first to respond.</div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default QuestionPage
