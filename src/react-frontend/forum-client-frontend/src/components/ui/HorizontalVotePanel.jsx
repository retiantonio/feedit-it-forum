import { useState, useEffect } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'

import { answerService } from '../../services/feedService'
import { useAuth } from '../../hooks/useAuth'
import { useVotes } from '../../hooks/useVotes'

import './HorizontalVotePanel.css'

const HorizontalVotePanel = ({ answer }) => {
  const [votes, setVotes] = useState(answer.votes || 0)
  const [userVote, setUserVote] = useState(0)
  const { requireAuth } = useAuth()
  const { getVote, updateVote } = useVotes()

  // Initialize user vote from global vote map when component mounts
  useEffect(() => {
    const existingVote = getVote(answer.id)
    if (existingVote) {
      setUserVote(existingVote)
    }
  }, [answer.id, getVote])

  const handleVote = async (e, direction) => {
    e.stopPropagation()

    requireAuth(async () => {
      const newVoteValue = userVote === direction ? 0 : direction
      const change = newVoteValue - userVote

      setVotes((prev) => prev + change)
      setUserVote(newVoteValue)
      updateVote(answer.id, newVoteValue)

      try {
        await answerService.vote(answer.id, direction)
      } catch (err) {
        console.error('Vote failed', err)
        setVotes((prev) => prev - change)
        setUserVote(userVote)
        updateVote(answer.id, userVote)
      }
    })
  }

  return (
    <div className='vote-panel-horizontal'>
      <button
        className={`vote-btn ${userVote === 1 ? 'up-active' : ''}`}
        onClick={(e) => handleVote(e, 1)}
      >
        <ChevronUp size={16} />
      </button>
      <span className='vote-count'>{votes}</span>
      <button
        className={`vote-btn ${userVote === -1 ? 'down-active' : ''}`}
        onClick={(e) => handleVote(e, -1)}
      >
        <ChevronDown size={16} />
      </button>
    </div>
  )
}

export default HorizontalVotePanel
