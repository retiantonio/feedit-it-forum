import api from './api'
import { categoryService } from './feedService'

export const moderatorService = {
  getPendingReports: async () => {
    return api.get('/moderator/reports')
  },

  getAllReports: async () => {
    return api.get('/moderator/reports/all')
  },

  resolveReport: async (reportId) => {
    return api.put(`/moderator/reports/${reportId}/resolve`)
  },

  deletePost: async (postId) => {
    return api.delete(`/moderator/posts/${postId}/delete`)
  },

  suspendUser: async (userId, days) => {
    return api.put(`/moderator/users/${userId}/suspend`, { days })
  },

  getActivityLogs: async () => {
    return api.get('/moderator/logs')
  },

  // Category management
  getAllCategories: () => categoryService.getAll(),

  createCategory: async (categoryData) => {
    return api.post('/moderator/categories', categoryData)
  },

  updateCategory: async (id, categoryData) => {
    return api.put(`/moderator/categories/${id}`, categoryData)
  },

  deleteCategory: async (id) => {
    return api.delete(`/moderator/categories/${id}`)
  },
}
