import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/auth.service'
import { QUERY_KEYS } from '@/constants/query-keys'
import { ROUTES } from '@/constants/routes'
import {
  getAccessToken,
  removeAccessToken,
  setAccessToken,
} from '../utils/auth'
import type { SignInFormData, SignUpFormData } from '../validations/auth'

interface ApiError {
  response?: {
    data?: {
      message?: string
    }
  }
  message?: string
}

interface SignInResponse {
  access_token: string
  user: {
    id: string
    email: string
    [key: string]: unknown
  }
}

export const useCurrentUser = () => {
  return useQuery({
    queryKey: QUERY_KEYS.CURRENT_USER,
    queryFn: async () => {
      const res = await authService.getCurrentUser()

      if (!res.data || typeof res.data !== 'object' || !res.data.id) {
        throw new Error('Invalid user data received from server')
      }

      return res.data
    },
    enabled: !!getAccessToken(),
    retry: false,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}

export const useSignIn = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation<SignInResponse, ApiError, SignInFormData>({
    mutationFn: async (credentials: SignInFormData) => {
      const res = await authService.signIn(credentials)

      if (!res.data || !res.data.access_token || !res.data.user) {
        throw new Error('Invalid sign-in response from server')
      }

      return res.data
    },
    onSuccess: data => {
      setAccessToken(data.access_token)
      queryClient.setQueryData(QUERY_KEYS.CURRENT_USER, data.user)
      navigate(ROUTES.HOME)
    },
    onError: (error: ApiError) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Sign in failed. Please check your credentials.'

      console.error('Sign in error:', errorMessage)
    },
  })
}

export const useSignUp = () => {
  const navigate = useNavigate()

  return useMutation<unknown, ApiError, SignUpFormData>({
    mutationFn: async userData => {
      const res = await authService.signUp(userData)

      if (!res.data) {
        throw new Error('Invalid sign-up response from server')
      }

      return res.data
    },
    onSuccess: () => {
      navigate(ROUTES.SIGNIN)
    },
  })
}

export const useSignOut = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const clearAuthState = () => {
    removeAccessToken()
    queryClient.setQueryData(QUERY_KEYS.CURRENT_USER, null)
    queryClient.clear()
    navigate(ROUTES.SIGNIN)
  }

  return useMutation({
    mutationFn: async () => {
      await authService.signOut()
    },
    onSuccess: clearAuthState,
    onError: clearAuthState,
  })
}
