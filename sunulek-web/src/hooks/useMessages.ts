import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import type { Conversation, Message } from '@/types'
import { useToastStore } from '@/stores/toastStore'

// Get all conversations
export function useConversations() {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const { data } = await api.get<Conversation[]>('/conversations/')
      return data
    },
  })
}

// Get a specific conversation with messages
export function useConversation(conversationId: number | null) {
  return useQuery({
    queryKey: ['conversations', conversationId],
    queryFn: async () => {
      const { data } = await api.get<Conversation>(`/conversations/${conversationId}/`)
      return data
    },
    enabled: !!conversationId,
  })
}

// Get unread messages count
export function useUnreadMessagesCount() {
  return useQuery({
    queryKey: ['conversations', 'unread-count'],
    queryFn: async () => {
      const { data } = await api.get<{ count: number }>('/conversations/unread-count/')
      return data.count
    },
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000, // Refresh every minute
  })
}

// Start a new conversation (or get existing one)
export function useStartConversation() {
  const queryClient = useQueryClient()
  const { addToast } = useToastStore()

  return useMutation({
    mutationFn: async ({ adId, message }: { adId: number; message: string }) => {
      const { data } = await api.post('/conversations/start/', { 
        ad_id: adId, 
        message 
      })
      return data as { conversation_id: number; message: Message; created: boolean }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
      addToast({ type: 'success', message: 'Message envoyé !' })
      return data
    },
    onError: (error: any) => {
      addToast({ 
        type: 'error', 
        message: error.response?.data?.error || 'Erreur lors de l\'envoi' 
      })
    },
  })
}

// Send a message in an existing conversation
export function useSendMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ conversationId, content }: { conversationId: number; content: string }) => {
      const { data } = await api.post<Message>(`/conversations/${conversationId}/send/`, { content })
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['conversations', variables.conversationId] })
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    },
  })
}
