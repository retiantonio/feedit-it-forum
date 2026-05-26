import { useState, useEffect } from 'react'
import { voteService } from '../services/voteService'
import { useAuth } from './useAuth'

/**
 * Hook to manage user's vote status
 * Returns a map of { postId: direction } where direction is 1, -1, or null
 */
export const useVotes = () => {
  const { isAuthenticated } = useAuth()
  const [voteMap, setVoteMap] = useState({})
  const [loading, setLoading] = useState(false)

  // Fetch votes on mount (only if authenticated)
  useEffect(() => {
    if (!isAuthenticated) {
      setVoteMap({})
      return
    }

    const fetchVotes = async () => {
      setLoading(true)
      try {
        const votes = await voteService.getVoteStatus()
        setVoteMap(votes)
      } catch (err) {
        console.error('Failed to fetch votes:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchVotes()
  }, [isAuthenticated])

  // Update vote in the map (optimistic update)
  const updateVote = (postId, direction) => {
    setVoteMap((prev) => ({
      ...prev,
      [postId]: direction === 0 ? null : direction,
    }))
  }

  // Get vote for a specific post
  const getVote = (postId) => {
    return voteMap[postId] || 0
  }

  return {
    voteMap,
    loading,
    getVote,
    updateVote,
  }
}
