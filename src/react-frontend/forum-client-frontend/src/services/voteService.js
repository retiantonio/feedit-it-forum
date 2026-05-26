import api from './api'

export const voteService = {
  getMyVotes: async () => {
    return api.get('/votes/me')
  },

  getVoteStatus: async () => {
    try {
      const response = await api.get('/votes/me')
      // Convert array to a map for faster lookup: { postId: direction }
      const voteMap = {}
      response.data.forEach((vote) => {
        voteMap[vote.postId] = vote.direction
      })
      return voteMap
    } catch (err) {
      console.error('Failed to fetch vote status:', err)
      return {}
    }
  },
}
