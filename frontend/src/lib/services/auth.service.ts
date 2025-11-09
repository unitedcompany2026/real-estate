import { api } from '../api/api'
import { API_ENDPOINTS } from '@/constants/api'
import type { SignInFormData, SignUpFormData } from '../validations/auth'

export const authService = {
  getCurrentUser: () => api.get(API_ENDPOINTS.AUTH.ME),
  refreshToken: () => api.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN),
  signIn: (data: SignInFormData) => api.post(API_ENDPOINTS.AUTH.SIGNIN, data),
  signUp: (data: SignUpFormData) => api.post(API_ENDPOINTS.AUTH.SIGNUP, data),
  signOut: () => api.post(API_ENDPOINTS.AUTH.SIGNIN),
}
