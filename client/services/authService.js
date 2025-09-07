import { authAPI } from './api'

export const authService = {
  // Login user
  login: async (credentials) => {
    try {
      const response = await authAPI.login(credentials)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Register user
  register: async (userData) => {
    try {
      const response = await authAPI.register(userData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await authAPI.getCurrentUser()
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Update user profile
  updateProfile: async (userData) => {
    try {
      const response = await authAPI.updateProfile(userData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Verify token validity
  verifyToken: async (token) => {
    try {
      // Store token temporarily for verification
      const originalToken = localStorage.getItem('token')
      localStorage.setItem('token', token)
      
      const userData = await authService.getCurrentUser()
      
      // Restore original token
      if (originalToken) {
        localStorage.setItem('token', originalToken)
      } else {
        localStorage.removeItem('token')
      }
      
      return userData
    } catch (error) {
      localStorage.removeItem('token')
      throw error
    }
  },

  // Request password reset
  forgotPassword: async (email) => {
    try {
      const response = await authAPI.forgotPassword(email)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Reset password
  resetPassword: async (token, newPassword) => {
    try {
      const response = await authAPI.resetPassword(token, newPassword)
      return response.data
    } catch (error) {
      throw error
    }
  }
}