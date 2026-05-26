import api from './api'

export const reportService = {
  submitReport: async (reportedPostId, reason) => {
    return api.post('/reports', {
      reportedPostId,
      reason,
    })
  },
}
