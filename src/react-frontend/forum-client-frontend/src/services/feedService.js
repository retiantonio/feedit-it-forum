import api from './api'

export const questionService = {
  getAll: () => api.get('/questions'),
  getById: (id) => api.get(`/questions/${id}`),
  search: (keyword) => api.get(`/questions/search?keyword=${keyword}`),
  unifiedSearch: (keyword) => api.get(`/questions/unified-search?keyword=${keyword}`),
  create: (data) => api.post('/questions', data),
  vote: (id, direction) => api.post(`/questions/${id}/vote?direction=${direction}`),
  update: (id, data) => api.put(`/questions/${id}`, data),
  delete: (id) => api.delete(`/questions/${id}`),
}

export const answerService = {
  getByParentId: (parentPostId) => api.get(`/posts/${parentPostId}/answers`),
  create: (parentPostId, body) => api.post(`/posts/${parentPostId}/answers`, { body }),
  vote: (id, direction) => api.post(`/answers/${id}/vote?direction=${direction}`),
  update: (id, data) => api.put(`/answers/${id}`, data),
  delete: (id) => api.delete(`/answers/${id}`),
}

export const categoryService = {
  getAll: () => api.get('/categories'),
}

export default api
