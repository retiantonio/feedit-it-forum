import axios from 'axios'

const API_URL = 'https://unwhetted-indicatively-kimiko.ngrok-free.dev/api/auth'

const ngrokConfig = {
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true', // <--- Tell ngrok to let the request straight through
  },
}

const login = async (username, password) => {
  const response = await axios.post(
    `${API_URL}/login`,
    {
      username,
      password,
    },
    ngrokConfig
  )

  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data))
    localStorage.setItem('token', response.data.token)
  }

  return response.data
}

const register = async (username, email, password) => {
  return axios.post(`${API_URL}/register`, { username, email, password }, ngrokConfig)
}

const logout = () => {
  localStorage.removeItem('user')
  localStorage.removeItem('token')
}

const getCurrentUser = () => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

export default { login, register, logout, getCurrentUser }
