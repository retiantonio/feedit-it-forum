import { useState, useEffect } from 'react'
import { Trash2, Edit2, Plus, X } from 'lucide-react'
import { moderatorService } from '../../services/moderatorService'
import './CategoriesTab.css'

import { getErrorMessage } from '../../utils/errorHelper'

const CategoriesTab = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    color: '',
  })

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setLoading(true)
      const response = await moderatorService.getAllCategories()
      setCategories(response.data)
      setError('')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name.trim() || !formData.color.trim()) {
      setError('Name and color are required')
      return
    }

    if (formData.name.length < 2 || formData.name.length > 30) {
      setError('Name must be between 2 and 30 characters')
      return
    }

    try {
      if (editingId) {
        await moderatorService.updateCategory(editingId, formData)
        setSuccess('Category updated successfully')
      } else {
        await moderatorService.createCategory(formData)
        setSuccess('Category created successfully')
      }

      setFormData({ name: '', color: '' })
      setEditingId(null)
      setShowForm(false)
      setError('')
      loadCategories()

      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error('Failed to save category:', err)
      setError(getErrorMessage(err))
    }
  }

  const handleEdit = (category) => {
    setFormData({
      name: category.name,
      color: category.color,
    })
    setEditingId(category.id)
    setShowForm(true)
    setError('')
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await moderatorService.deleteCategory(id)
        setSuccess('Category deleted successfully')
        setError('')
        loadCategories()
        setTimeout(() => setSuccess(''), 3000)
      } catch (err) {
        setError(getErrorMessage(err))
      }
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({ name: '', color: '' })
    setError('')
  }

  if (loading) {
    return <div className='categories-loading'>Loading categories...</div>
  }

  return (
    <div className='categories-tab-root'>
      {error && <div className='categories-error'>{error}</div>}
      {success && <div className='categories-success'>{success}</div>}

      {!showForm ? (
        <button className='categories-add-btn' onClick={() => setShowForm(true)}>
          <Plus size={18} /> Add New Category
        </button>
      ) : (
        <form className='categories-form' onSubmit={handleSubmit}>
          <div className='form-group'>
            <label htmlFor='name'>Category Name *</label>
            <input
              id='name'
              type='text'
              name='name'
              value={formData.name}
              onChange={handleInputChange}
              placeholder='Enter category name (2-30 characters)'
              maxLength='30'
            />
          </div>

          <div className='form-group'>
            <label htmlFor='color'>Color *</label>
            <div className='color-input-group'>
              <input
                id='color'
                type='color'
                name='color'
                value={formData.color}
                onChange={handleInputChange}
                className='color-picker'
              />
              <input
                type='text'
                name='colorText'
                value={formData.color}
                onChange={(e) => setFormData((prev) => ({ ...prev, color: e.target.value }))}
                placeholder='#000000'
                className='color-text'
              />
            </div>
          </div>

          <div className='form-actions'>
            <button type='submit' className='btn-submit'>
              {editingId ? 'Update Category' : 'Create Category'}
            </button>
            <button type='button' className='btn-cancel' onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className='categories-list'>
        <h3>Categories ({categories.length})</h3>
        {categories.length === 0 ? (
          <div className='no-categories'>No categories found</div>
        ) : (
          <div className='categories-grid'>
            {categories.map((category) => (
              <div key={category.id} className='category-card'>
                <div className='category-header'>
                  <div className='category-color' style={{ backgroundColor: category.color }}></div>
                  <h4>{category.name}</h4>
                </div>
                <div className='category-actions'>
                  <button
                    className='btn-edit'
                    onClick={() => handleEdit(category)}
                    title='Edit category'
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    className='btn-delete'
                    onClick={() => handleDelete(category.id)}
                    title='Delete category'
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CategoriesTab
