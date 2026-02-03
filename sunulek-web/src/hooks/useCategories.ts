import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import type { Category, PaginatedResponse } from '@/types'

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Category>>('/categories/')
      return data.results
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useCategory(slug: string) {
  return useQuery({
    queryKey: ['categories', slug],
    queryFn: async () => {
      const { data } = await api.get<Category>(`/categories/${slug}/`)
      return data
    },
    enabled: !!slug,
  })
}
