import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import type { Ad, PaginatedResponse } from '@/types'
import { useToastStore } from '@/stores/toastStore'

interface AdsFilters {
  search?: string
  category?: string
  region?: string
  min_price?: string
  max_price?: string
  ordering?: string
}

export function useAds(filters: AdsFilters = {}) {
  return useInfiniteQuery<PaginatedResponse<Ad>, Error>({
    queryKey: ['annonces', filters],
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams()
      params.set('page', String(pageParam))
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.set(key, value)
      })
      const { data } = await api.get<PaginatedResponse<Ad>>(`/annonces/?${params.toString()}`)
      return data
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.next) {
        const url = new URL(lastPage.next)
        const page = url.searchParams.get('page')
        return page ? parseInt(page) : undefined
      }
      return undefined
    },
    initialPageParam: 1,
  })
}

export function useFeaturedAds() {
  return useQuery({
    queryKey: ['annonces', 'featured'],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Ad>>('/annonces/?is_featured=true')
      return data.results
    },
  })
}

export function useLatestAds() {
  return useQuery({
    queryKey: ['annonces', 'latest'],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Ad>>('/annonces/?ordering=-created_at')
      return data.results
    },
  })
}

export function useAd(slug: string) {
  return useQuery({
    queryKey: ['annonces', slug],
    queryFn: async () => {
      const { data } = await api.get<Ad>(`/annonces/${slug}/`)
      return data
    },
    enabled: !!slug,
  })
}

export function useMyAds() {
  return useQuery({
    queryKey: ['annonces', 'mine'],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Ad>>('/annonces/my_ads/')
      return data.results
    },
  })
}

export function useCreateAd() {
  const queryClient = useQueryClient()
  const { addToast } = useToastStore()

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await api.post<Ad>('/annonces/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['annonces'] })
      addToast({ type: 'success', message: 'Annonce créée !' })
    },
    onError: () => {
      addToast({ type: 'error', message: 'Erreur lors de la création' })
    },
  })
}

export function useDeleteAd() {
  const queryClient = useQueryClient()
  const { addToast } = useToastStore()

  return useMutation({
    mutationFn: async (slug: string) => {
      await api.delete(`/annonces/${slug}/`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['annonces'] })
      addToast({ type: 'success', message: 'Annonce supprimée !' })
    },
    onError: () => {
      addToast({ type: 'error', message: 'Erreur lors de la suppression' })
    },
  })
}
