import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('api_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export interface DetectionRequest {
  text: string
}

export interface DetectionResponse {
  isScam: boolean
  confidence: number
  scamType: string
  keywords_found?: string[]
  score?: number
}

export interface Session {
  session_id: string
  is_scam: boolean
  confidence: number
  message_count: number
  last_updated: number
}

export const apiService = {
  // Scam Detection
  detectScam: async (text: string): Promise<DetectionResponse> => {
    const response = await api.post('/detect', { text })
    return response.data
  },

  // Get session info
  getSession: async (sessionId: string) => {
    const response = await api.get(`/api/v1/session/${sessionId}`)
    return response.data
  },

  // Get analytics
  getAnalytics: async () => {
    const response = await api.get('/api/v1/analytics')
    return response.data
  },

  // Process conversation
  processMessage: async (data: any) => {
    const response = await api.post('/api/v1/process', data)
    return response.data
  },

  // Health check
  healthCheck: async () => {
    const response = await api.get('/health')
    return response.data
  }
}

export default api