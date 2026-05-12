import axios from 'axios'

const API_URL = 'http://localhost:8080/api/auth'

const login = async (username, password) => {
  const response = await axios.post(`${API_URL}/login`, {
    username,
    password,
  })

  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }

  return response.data
}

const register = async (userData) => {
  return axios.post(`${API_URL}/register`, userData)
}

export default { login, register }
