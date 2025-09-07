import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const issueAPI = {
  // Create a new issue
  create: (issueData) => api.post('/issues', issueData),
  
  // Get all issues with optional filters
  getAll: (params = {}) => api.get('/issues', { params }),
  
  // Get single issue
  get: (id) => api.get(`/issues/${id}`),
  
  // Update issue
  update: (id, updateData) => api.put(`/issues/${id}`, updateData),
  
  // Upvote an issue
  upvote: (id) => api.post(`/issues/${id}/upvote`),
  
  // Add comment to issue
  addComment: (id, comment) => api.post(`/issues/${id}/comments`, { text: comment }),
}

export const authAPI = {
  // Login user
  login: (credentials) => api.post('/auth/login', credentials),
  
  // Register user
  register: (userData) => api.post('/auth/register', userData),
  
  // Get current user
  getCurrentUser: () => api.get('/auth/me'),
  
  // Update user profile
  updateProfile: (userData) => api.put('/auth/profile', userData),
  
  // Request password reset
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  
  // Reset password
  resetPassword: (token, newPassword) => api.post('/auth/reset-password', { token, newPassword }),
}

export const leaderboardAPI = {
  // Get leaderboard
  get: (timeframe = 'monthly') => api.get(`/leaderboard?timeframe=${timeframe}`),
}

export const dashboardAPI = {
  // Get dashboard stats
  getStats: () => api.get('/dashboard/stats'),
  
  // Get heatmap data
  getHeatmap: () => api.get('/dashboard/heatmap'),
  
  // Get predictive insights
  getPredictiveInsights: () => api.get('/dashboard/predictive-insights'),
}

export default api