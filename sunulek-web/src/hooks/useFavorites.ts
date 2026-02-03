import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import type { Favorite, PaginatedResponse } from '@/types'
import { useToastStore } from '@/stores/toastStore'
import { useAuthStore } from '@/stores/authStore'

export function useFavorites() {
  const { isAuthenticated } = useAuthStore()
  
  return useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Favorite>>('/favorites/')
      return data.results
    },
    enabled: isAuthenticated,
  })
}

export function useFavoriteToggle() {
  const queryClient = useQueryClient()
  const { addToast } = useToastStore()
  const { isAuthenticated } = useAuthStore()

  return useMutation({
    mutationFn: async (adId: number) => {
      if (!isAuthenticated) {
        throw new Error('Vous devez être connecté')
      }
      const { data } = await api.post(`/favorites/toggle/`, { ad_id: adId })
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
      queryClient.invalidateQueries({ queryKey: ['annonces'] })
      addToast({ 
        type: 'success', 
        message: data.is_favorited ? 'Ajouté aux favoris' : 'Retiré des favoris' 
      })
    },
    onError: (error: any) => {
      addToast({ type: 'error', message: error.message || 'Erreur' })
    },
  })
}
