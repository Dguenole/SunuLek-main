import axios from 'axios'
import { API_URL } from './constants'
import { useAuthStore } from '@/stores/authStore'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const tokens = useAuthStore.getState().tokens
    if (tokens?.access) {
      config.headers.Authorization = `Bearer ${tokens.access}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      const tokens = useAuthStore.getState().tokens
      if (tokens?.refresh) {
        try {
          const response = await axios.post(`${API_URL}/auth/token/refresh/`, {
            refresh: tokens.refresh,
          })
          
          const { access } = response.data
          const user = useAuthStore.getState().user
          if (user) {
            useAuthStore.getState().setAuth(user, { access, refresh: tokens.refresh })
          }
          
          originalRequest.headers.Authorization = `Bearer ${access}`
          return api(originalRequest)
        } catch {
          useAuthStore.getState().logout()
          window.location.href = '/login'
        }
      }
    }
    
    return Promise.reject(error)
  }
)

export default api
