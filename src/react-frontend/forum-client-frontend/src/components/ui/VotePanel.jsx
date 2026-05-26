import { useState, useEffect } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'

import { questionService } from '../../services/feedService'
import { useAuth } from '../../hooks/useAuth'
import { useVotes } from '../../hooks/useVotes'

import './VotePanel.css'

const VotePanel = ({ question }) => {
  const [currentVotes, setVotes] = useState(question.votes || 0)
  const [userVote, setUserVote] = useState(0)
  const { requireAuth } = useAuth()
  const { getVote, updateVote } = useVotes()

  // Initialize user vote from global vote map when component mounts
  useEffect(() => {
    const existingVote = getVote(question.id)
    if (existingVote) {
      setUserVote(existingVote)
    }
  }, [question.id, getVote])

  const handleVote = async (e, direction) => {
    e.stopPropagation()

    requireAuth(async () => {
      const newVoteValue = userVote === direction ? 0 : direction
      const change = newVoteValue - userVote

      setVotes((prev) => prev + change)
      setUserVote(newVoteValue)
      updateVote(question.id, newVoteValue)

      try {
        await questionService.vote(question.id, direction)
      } catch (err) {
        console.error('Vote failed', err)
        setVotes((prev) => prev - change)
        setUserVote(userVote)
        updateVote(question.id, userVote)
      }
    })
  }
  return (
    <div className='vote-panel'>
      <button
        className={`vote-btn ${userVote === 1 ? 'up-active' : ''}`}
        onClick={(e) => handleVote(e, 1)}
      >
        <ChevronUp size={18} />
      </button>
      <span className='vote-count'>{currentVotes}</span>
      <button
        className={`vote-btn ${userVote === -1 ? 'down-active' : ''}`}
        onClick={(e) => handleVote(e, -1)}
      >
        <ChevronDown size={18} />
      </button>
    </div>
  )
}

export default VotePanel
