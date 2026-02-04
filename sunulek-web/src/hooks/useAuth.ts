import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import { useToastStore } from '@/stores/toastStore'
import type { User, AuthTokens, PublicProfile } from '@/types'

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterData {
  email: string
  username: string
  first_name: string
  last_name: string
  phone: string
  password: string
  password_confirm: string
}

export function useLogin() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const { addToast } = useToastStore()

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const { data } = await api.post('/auth/login/', credentials)
      return data
    },
    onSuccess: (data) => {
      // Le backend retourne: { access, refresh, user: {...} }
      const user: User = data.user
      const tokens: AuthTokens = { access: data.access, refresh: data.refresh }
      setAuth(user, tokens)
      addToast({ type: 'success', message: `Bienvenue ${user.first_name || user.full_name} !` })
      navigate('/')
    },
    onError: (error: any) => {
      addToast({ 
        type: 'error', 
        message: error.response?.data?.detail || 'Email ou mot de passe incorrect' 
      })
    },
  })
}

export function useRegister() {
  const navigate = useNavigate()
  const { addToast } = useToastStore()

  return useMutation({
    mutationFn: async (userData: RegisterData) => {
      const { data } = await api.post('/auth/register/', userData)
      return data
    },
    onSuccess: () => {
      addToast({ 
        type: 'success', 
        message: 'Compte créé ! Vérifiez votre email pour activer votre compte.' 
      })
      navigate('/login')
    },
    onError: (error: any) => {
      const errors = error.response?.data
      if (errors) {
        const firstError = Object.values(errors)[0]
        addToast({ 
          type: 'error', 
          message: Array.isArray(firstError) ? firstError[0] : String(firstError) 
        })
      } else {
        addToast({ type: 'error', message: 'Erreur lors de l\'inscription' })
      }
    },
  })
}

export function useLogout() {
  const navigate = useNavigate()
  const { logout, tokens } = useAuthStore()
  const { addToast } = useToastStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      if (tokens?.refresh) {
        await api.post('/auth/logout/', { refresh: tokens.refresh })
      }
    },
    onSuccess: () => {
      logout()
      queryClient.clear()
      addToast({ type: 'success', message: 'Déconnexion réussie' })
      navigate('/')
    },
    onError: () => {
      logout()
      queryClient.clear()
      navigate('/')
    },
  })
}

export function useUpdateProfile() {
  const { setUser } = useAuthStore()
  const { addToast } = useToastStore()

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await api.patch<User>('/auth/profile/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return data
    },
    onSuccess: (data) => {
      setUser(data)
      addToast({ type: 'success', message: 'Profil mis à jour !' })
    },
    onError: () => {
      addToast({ type: 'error', message: 'Erreur lors de la mise à jour' })
    },
  })
}

export function useChangePassword() {
  const { addToast } = useToastStore()

  return useMutation({
    mutationFn: async (data: { old_password: string; new_password: string; new_password_confirm: string }) => {
      await api.post('/auth/change-password/', data)
    },
    onSuccess: () => {
      addToast({ type: 'success', message: 'Mot de passe modifié !' })
    },
    onError: (error: any) => {
      addToast({ 
        type: 'error', 
        message: error.response?.data?.old_password?.[0] || 'Erreur' 
      })
    },
  })
}

export function usePublicProfile(userId: number | string) {
  return useQuery({
    queryKey: ['publicProfile', userId],
    queryFn: async () => {
      const { data } = await api.get<PublicProfile>(`/auth/profile/${userId}/`)
      return data
    },
    enabled: !!userId,
  })
}
