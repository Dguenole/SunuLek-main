import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, MessageCircle } from 'lucide-react'
import { useStartConversation } from '@/hooks/useMessages'
import Button from '@/components/ui/Button'

interface ContactSellerModalProps {
  isOpen: boolean
  onClose: () => void
  adId: number
  adTitle: string
  sellerName: string
}

export default function ContactSellerModal({
  isOpen,
  onClose,
  adId,
  adTitle,
  sellerName,
}: ContactSellerModalProps) {
  const navigate = useNavigate()
  const startConversation = useStartConversation()
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    startConversation.mutate(
      { adId, message: message.trim() },
      {
        onSuccess: (data) => {
          setMessage('')
          onClose()
          // Navigate to the conversation
          navigate(`/messages?id=${data.conversation_id}`)
        },
      }
    )
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-4 top-[10%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-lg bg-white rounded-2xl shadow-xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 px-6 py-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-6 h-6" />
                  <h2 className="text-lg font-semibold">Contacter le vendeur</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-white/80 mt-1">
                À propos de : {adTitle}
              </p>
            </div>

            {/* Content */}
            <form onSubmit={handleSubmit} className="p-6">
              {/* Seller info */}
              <div className="flex items-center gap-3 mb-6 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white font-semibold">
                  {sellerName?.charAt(0).toUpperCase() || 'V'}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{sellerName}</p>
                  <p className="text-sm text-gray-500">Vendeur</p>
                </div>
              </div>

              {/* Message */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Votre message *
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Bonjour, je suis intéressé(e) par votre annonce..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                  rows={4}
                  required
                />
                <p className="text-xs text-gray-500 mt-2">
                  Le vendeur pourra vous répondre directement dans la messagerie
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  isLoading={startConversation.isPending}
                  rightIcon={<Send className="w-4 h-4" />}
                >
                  Envoyer
                </Button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
