import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { questionService, categoryService } from '../../services/feedService'
import { useAuth } from '../../hooks/useAuth'

import { getErrorMessage } from '../../utils/errorHelper'

import './CreateQuestionCard.css'

const CreateQuestionCard = ({ onQuestionCreated, open, onClose }) => {
  const [submitting, setSubmitting] = useState(false)
  const [categories, setCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(false)
  const { requireAuth } = useAuth()
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '',
    body: '',
    categoryIds: [],
  })

  const loadCategories = async () => {
    try {
      setLoadingCategories(true)
      const res = await categoryService.getAll()
      setCategories(res.data)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoadingCategories(false)
    }
  }

  useEffect(() => {
    if (open && categories.length === 0) {
      loadCategories()
    }
  }, [open, categories.length])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const toggleCategory = (catId) => {
    setForm((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(catId)
        ? prev.categoryIds.filter((c) => c !== catId)
        : [...prev.categoryIds, catId],
    }))
  }

  const handleClose = () => {
    onClose()
    setForm({ title: '', body: '', categoryIds: [] })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.body.trim() || form.categoryIds.length === 0) return

    requireAuth(async () => {
      setSubmitting(true)
      try {
        const res = await questionService.create(form)
        onQuestionCreated?.(res.data)
        handleClose()
      } catch (err) {
        setError(getErrorMessage(err))
      } finally {
        setSubmitting(false)
      }
    })
  }

  return open ? (
    <div className='modal-overlay' onClick={handleClose}>
      <div className='modal-card' onClick={(e) => e.stopPropagation()}>
        <div className='modal-header'>
          <span className='modal-title'>Create Question</span>
        </div>

        <form onSubmit={handleSubmit} className='modal-form'>
          <div className='modal-field'>
            <div className='modal-label'>Title</div>
            <input
              name='title'
              className='modal-input'
              placeholder='e.g. How do I fix a JWT filter in Spring Boot 3?'
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className='modal-field'>
            <div className='modal-label'>Body</div>
            <textarea
              name='body'
              className='modal-textarea'
              placeholder='Describe your question in detail...'
              value={form.body}
              onChange={handleChange}
              required
            />
          </div>

          <div className='modal-field'>
            <div className='modal-label'>Categories</div>
            <div className='category-grid'>
              {loadingCategories ? (
                <div className='loading-categories'>Loading categories...</div>
              ) : categories.length === 0 ? (
                <div className='loading-categories'>No categories available</div>
              ) : (
                categories.map((cat) => (
                  <span
                    key={cat.id}
                    className={`category-pill ${form.categoryIds.includes(cat.id) ? 'selected' : ''}`}
                    onClick={() => toggleCategory(cat.id)}
                    style={{
                      borderColor: form.categoryIds.includes(cat.id)
                        ? cat.color
                        : 'rgba(180, 79, 255, 0.3)',
                      backgroundColor: form.categoryIds.includes(cat.id)
                        ? `${cat.color}20`
                        : 'transparent',
                      color: form.categoryIds.includes(cat.id) ? cat.color : '#a89bc2',
                    }}
                  >
                    {cat.name}
                  </span>
                ))
              )}
            </div>
          </div>

          {error && <div className='main-error'>{error}</div>}

          <div className='modal-footer'>
            <button type='button' className='q-modal-btn cancel-btn' onClick={handleClose}>
              Cancel
            </button>
            <button
              type='submit'
              className='q-modal-btn save-btn'
              disabled={
                submitting ||
                form.body.length === 0 ||
                form.title.length === 0 ||
                form.categoryIds.length === 0
              }
              onClick={handleSubmit}
            >
              {submitting ? <Loader2 size={14} className='animate-spin' /> : null}
              {submitting ? 'Posting...' : 'Post Question →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : null
}

export default CreateQuestionCard
