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
  user?: string | number
  status?: string
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

export function useUserAds(userId: string | number | undefined) {
  return useQuery({
    queryKey: ['annonces', 'user', userId],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Ad>>(`/annonces/?user=${userId}`)
      return data.results
    },
    enabled: !!userId,
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

export function useMyAds(status?: 'active' | 'pending' | 'deleted') {
  return useQuery({
    queryKey: ['annonces', 'mine', status],
    queryFn: async () => {
      const params = status ? `?status=${status}` : ''
      const { data } = await api.get<Ad[]>(`/annonces/my_ads/${params}`)
      return data
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

export function useUpdateAd() {
  const queryClient = useQueryClient()
  const { addToast } = useToastStore()

  return useMutation({
    mutationFn: async ({ slug, formData }: { slug: string; formData: FormData }) => {
      const { data } = await api.patch<Ad>(`/annonces/${slug}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return data
    },
    onSuccess: (ad) => {
      queryClient.invalidateQueries({ queryKey: ['annonces'] })
      queryClient.invalidateQueries({ queryKey: ['annonces', ad.slug] })
      addToast({ type: 'success', message: 'Annonce modifiée !' })
    },
    onError: () => {
      addToast({ type: 'error', message: 'Erreur lors de la modification' })
    },
  })
}

export function useDeleteAd() {
  const queryClient = useQueryClient()
  const { addToast } = useToastStore()

  return useMutation({
    mutationFn: async (slug: string) => {
      await api.post(`/annonces/${slug}/soft_delete/`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['annonces'] })
      addToast({ type: 'success', message: 'Annonce déplacée vers la corbeille' })
    },
    onError: () => {
      addToast({ type: 'error', message: 'Erreur lors de la suppression' })
    },
  })
}

export function useRestoreAd() {
  const queryClient = useQueryClient()
  const { addToast } = useToastStore()

  return useMutation({
    mutationFn: async (slug: string) => {
      await api.post(`/annonces/${slug}/restore/`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['annonces'] })
      addToast({ type: 'success', message: 'Annonce restaurée !' })
    },
    onError: () => {
      addToast({ type: 'error', message: 'Erreur lors de la restauration' })
    },
  })
}

export function usePermanentDeleteAd() {
  const queryClient = useQueryClient()
  const { addToast } = useToastStore()

  return useMutation({
    mutationFn: async (slug: string) => {
      await api.delete(`/annonces/${slug}/permanent_delete/`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['annonces'] })
      addToast({ type: 'success', message: 'Annonce définitivement supprimée' })
    },
    onError: () => {
      addToast({ type: 'error', message: 'Erreur lors de la suppression' })
    },
  })
}
