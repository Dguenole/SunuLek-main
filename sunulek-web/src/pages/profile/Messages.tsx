import { useState, useEffect, useRef } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  MessageSquare, Send, ArrowLeft, Check, CheckCheck, 
  Inbox, Loader2 
} from 'lucide-react'
import { useConversations, useConversation, useSendMessage } from '@/hooks/useMessages'
import { useAuthStore } from '@/stores/authStore'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { format, isToday, isYesterday } from 'date-fns'
import { fr } from 'date-fns/locale'
import { formatPrice, cn } from '@/lib/utils'
import type { Conversation, Message } from '@/types'

function formatMessageDate(dateString: string) {
  const date = new Date(dateString)
  if (isToday(date)) {
    return format(date, 'HH:mm', { locale: fr })
  }
  if (isYesterday(date)) {
    return 'Hier ' + format(date, 'HH:mm', { locale: fr })
  }
  return format(date, 'dd/MM HH:mm', { locale: fr })
}

// Conversation List Item
function ConversationItem({ 
  conversation, 
  isActive, 
  onClick 
}: { 
  conversation: Conversation
  isActive: boolean
  onClick: () => void
}) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "w-full flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors text-left border-b border-gray-100",
        isActive && "bg-primary-50 border-l-4 border-l-primary-500"
      )}
      whileHover={{ x: 2 }}
    >
      {/* Avatar or Ad Image */}
      {conversation.ad_image ? (
        <img 
          src={conversation.ad_image} 
          alt=""
          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white font-semibold flex-shrink-0">
          {conversation.other_user?.full_name?.charAt(0).toUpperCase() || '?'}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-medium text-gray-900 truncate">
            {conversation.other_user?.full_name}
          </h3>
          {conversation.last_message && (
            <span className="text-xs text-gray-500 flex-shrink-0">
              {formatMessageDate(conversation.last_message.created_at)}
            </span>
          )}
        </div>
        
        <p className="text-sm text-primary-600 truncate mt-0.5">
          {conversation.ad_title}
        </p>
        
        {conversation.last_message && (
          <p className="text-sm text-gray-500 truncate mt-1">
            {conversation.last_message.is_mine && (
              <span className="text-gray-400">Vous: </span>
            )}
            {conversation.last_message.content}
          </p>
        )}
      </div>

      {conversation.unread_count > 0 && (
        <span className="bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          {conversation.unread_count}
        </span>
      )}
    </motion.button>
  )
}

// Message Bubble
function MessageBubble({ message }: { message: Message }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex mb-3",
        message.is_mine ? "justify-end" : "justify-start"
      )}
    >
      <div className={cn(
        "max-w-[75%] rounded-2xl px-4 py-2",
        message.is_mine 
          ? "bg-primary-500 text-white rounded-br-md" 
          : "bg-gray-100 text-gray-900 rounded-bl-md"
      )}>
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        <div className={cn(
          "flex items-center justify-end gap-1 mt-1 text-xs",
          message.is_mine ? "text-white/70" : "text-gray-400"
        )}>
          <span>{formatMessageDate(message.created_at)}</span>
          {message.is_mine && (
            message.is_read 
              ? <CheckCheck className="w-3 h-3" />
              : <Check className="w-3 h-3" />
          )}
        </div>
      </div>
    </motion.div>
  )
}

// Conversation View
function ConversationView({ 
  conversationId, 
  onBack 
}: { 
  conversationId: number
  onBack: () => void 
}) {
  const { data: conversation, isLoading } = useConversation(conversationId)
  const sendMessage = useSendMessage()
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation?.messages])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !conversationId) return

    sendMessage.mutate(
      { conversationId, content: newMessage.trim() },
      { onSuccess: () => setNewMessage('') }
    )
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    )
  }

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Conversation introuvable
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <button 
          onClick={onBack}
          className="md:hidden p-2 -ml-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        {conversation.ad_image ? (
          <img 
            src={conversation.ad_image} 
            alt=""
            className="w-10 h-10 rounded-lg object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white font-semibold">
            {conversation.other_user?.full_name?.charAt(0).toUpperCase() || '?'}
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 truncate">
            {conversation.other_user?.full_name}
          </h3>
          <Link 
            to={`/annonces/${conversation.ad_slug}`}
            className="text-sm text-primary-600 hover:underline truncate block"
          >
            {conversation.ad_title}
            {conversation.ad_price && ` - ${formatPrice(conversation.ad_price)}`}
          </Link>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {conversation.messages?.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-end gap-3">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Écrivez votre message..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none max-h-32"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend(e)
              }
            }}
          />
          <Button
            type="submit"
            disabled={!newMessage.trim() || sendMessage.isPending}
            isLoading={sendMessage.isPending}
            className="h-12 w-12 p-0 flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </form>
    </div>
  )
}

// Main Messages Page
export default function Messages() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeConversationId = searchParams.get('id') ? Number(searchParams.get('id')) : null
  const { data: conversations, isLoading } = useConversations()

  const setActiveConversation = (id: number | null) => {
    if (id) {
      setSearchParams({ id: String(id) })
    } else {
      setSearchParams({})
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    )
  }

  const totalUnread = conversations?.reduce((sum, c) => sum + c.unread_count, 0) || 0

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <MessageSquare className="w-7 h-7 text-primary-600" />
            Messagerie
          </h1>
          <p className="text-gray-600 mt-1">
            Vos conversations avec les vendeurs et acheteurs
          </p>
        </div>
        {totalUnread > 0 && (
          <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
            {totalUnread} non lu{totalUnread > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Main Content */}
      <Card className="overflow-hidden">
        <div className="flex h-[600px]">
          {/* Conversations List */}
          <div className={cn(
            "w-full md:w-80 lg:w-96 border-r border-gray-200 flex flex-col",
            activeConversationId && "hidden md:flex"
          )}>
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h2 className="font-medium text-gray-900">Conversations</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {!conversations?.length ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                  <Inbox className="w-16 h-16 text-gray-300 mb-4" />
                  <h3 className="font-medium text-gray-900 mb-2">Aucune conversation</h3>
                  <p className="text-gray-500 text-sm">
                    Contactez un vendeur pour démarrer une conversation
                  </p>
                </div>
              ) : (
                conversations.map((conversation) => (
                  <ConversationItem
                    key={conversation.id}
                    conversation={conversation}
                    isActive={activeConversationId === conversation.id}
                    onClick={() => setActiveConversation(conversation.id)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Conversation View */}
          <div className={cn(
            "flex-1 flex flex-col",
            !activeConversationId && "hidden md:flex"
          )}>
            {activeConversationId ? (
              <ConversationView 
                conversationId={activeConversationId}
                onBack={() => setActiveConversation(null)}
              />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-4 bg-gray-50">
                <MessageSquare className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="font-medium text-gray-900 mb-2">
                  Sélectionnez une conversation
                </h3>
                <p className="text-gray-500 text-sm">
                  Choisissez une conversation dans la liste pour voir les messages
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
