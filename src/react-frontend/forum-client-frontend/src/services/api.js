import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true', // <--- ADD THIS EXACT LINE
  },
})

api.interceptors.request.use(
  (config) => {
    const userJson = localStorage.getItem('user')

    if (userJson) {
      const userData = JSON.parse(userJson)

      const token = userData.token

      if (token) {
        config.headers.Authorization = `Bearer ${token}`
        console.log('Success! Header attached.')
      }
    } else {
      console.warn('No user found in localStorage. Request sent without token.')
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Token expired or invalid. Redirecting to login...')

      localStorage.removeItem('user')
      localStorage.removeItem('token')

      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
