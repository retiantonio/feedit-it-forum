import { useState, useEffect, useCallback } from 'react'

import Topbar from '../components/ui/Topbar'
import Sidebar from '../components/ui/Sidebar'
import QuestionCard from '../components/question/QuestionCard'
import CreateQuestionCard from '../components/ui/CreateQuestionCard'
import { useAuth } from '../hooks/useAuth'

import { Loader2 } from 'lucide-react'
import './Dashboard.css'

import { questionService } from '../services/feedService'

const HomePage = () => {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const { user } = useAuth()

  const loadQuestions = useCallback(async () => {
    setLoading(true)
    try {
      const response = searchQuery
        ? await questionService.unifiedSearch(searchQuery)
        : await questionService.getAll()

      setQuestions(response.data)
    } catch (error) {
      console.error('Error connecting to Spring Boot:', error)
    } finally {
      setLoading(false)
    }
  }, [searchQuery])

  useEffect(() => {
    loadQuestions()
  }, [loadQuestions])

  return (
    <div className='app-wrapper'>
      <Topbar onSearch={setSearchQuery} user={user} onCreateClick={() => setShowCreate(true)} />

      <div className='dashboard-container'>
        <div className='moving-bg-layer' />
        <Sidebar />

        <main className='feed-area'>
          <div className='feed-filter-bar'>
            VIEWING:{' '}
            <span className='filter-status'>
              {searchQuery ? `Search results for "${searchQuery}"` : 'All Discussions'}
            </span>
          </div>

          <CreateQuestionCard
            open={showCreate}
            onClose={() => setShowCreate(false)}
            onQuestionCreated={(newQuestion) => {
              setQuestions((prev) => [newQuestion, ...prev])
              setShowCreate(false)
            }}
          />

          <div className='question-list'>
            {loading ? (
              <div className='loading-state'>
                <Loader2 className='animate-spin' color='#D060FF' size={40} />
              </div>
            ) : questions.length > 0 ? (
              questions.map((q) => (
                <QuestionCard
                  key={q.id}
                  question={q}
                  onQuestionUpdated={(updatedQuestion) => {
                    setQuestions((prev) =>
                      prev.map((question) =>
                        question.id === updatedQuestion.id ? updatedQuestion : question
                      )
                    )
                  }}
                  onQuestionDeleted={(questionId) => {
                    setQuestions((prev) => prev.filter((q) => q.id !== questionId))
                  }}
                />
              ))
            ) : (
              <div className='empty-state'>
                <h3>No discussions found.</h3>
                <p>Try searching for a different keyword or category.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default HomePage
