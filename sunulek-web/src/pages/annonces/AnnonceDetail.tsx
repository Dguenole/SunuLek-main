import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, Heart, Share2, MapPin, Clock, Eye, User, 
  Phone, Mail, ChevronLeft, ChevronRight, X, Flag, Loader2
} from 'lucide-react'
import { useAd, useDeleteAd } from '@/hooks/useAds'
import { useFavoriteToggle } from '@/hooks/useFavorites'
import { useAuthStore } from '@/stores/authStore'
import { formatPrice, formatDate, cn } from '@/lib/utils'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

export default function AnnonceDetail() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { data: ad, isLoading, isError } = useAd(slug || '')
  const { isAuthenticated, user } = useAuthStore()
  const favoriteToggle = useFavoriteToggle()
  const deleteAd = useDeleteAd()

  const [currentImage, setCurrentImage] = useState(0)
  const [showGallery, setShowGallery] = useState(false)
  const [showPhone, setShowPhone] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    )
  }

  if (isError || !ad) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <span className="text-6xl mb-4 block">😕</span>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Annonce introuvable</h2>
        <p className="text-gray-600 mb-6">Cette annonce n'existe pas ou a été supprimée</p>
        <Link to="/annonces">
          <Button>Voir les annonces</Button>
        </Link>
      </div>
    )
  }

  const images = ad.images?.length ? ad.images.map(img => img.image) : (ad.primary_image ? [ad.primary_image] : [])
  const isOwner = ad.is_owner || user?.id === ad.user?.id

  const handleFavorite = () => {
    if (isAuthenticated) {
      favoriteToggle.mutate(ad.id)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: ad.title,
        text: ad.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const handleDelete = () => {
    deleteAd.mutate(ad.slug, {
      onSuccess: () => navigate('/mes-annonces'),
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <Card padding="none" className="overflow-hidden">
            {images.length > 0 ? (
              <div className="relative">
                <div 
                  className="aspect-[16/10] bg-gray-100 cursor-pointer"
                  onClick={() => setShowGallery(true)}
                >
                  <img
                    src={images[currentImage]}
                    alt={ad.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Navigation */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); setCurrentImage(i => i > 0 ? i - 1 : images.length - 1) }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-lg hover:bg-white"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setCurrentImage(i => i < images.length - 1 ? i + 1 : 0) }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-lg hover:bg-white"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={(e) => { e.stopPropagation(); setCurrentImage(idx) }}
                          className={cn(
                            "w-2.5 h-2.5 rounded-full transition-all",
                            idx === currentImage ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
                          )}
                        />
                      ))}
                    </div>
                  </>
                )}

                {/* Featured Badge */}
                {ad.is_featured && (
                  <span className="absolute top-4 left-4 px-3 py-1 bg-primary-500 text-white text-sm font-medium rounded-full">
                    ⭐ À la une
                  </span>
                )}
              </div>
            ) : (
              <div className="aspect-[16/10] bg-gray-100 flex items-center justify-center">
                <span className="text-6xl">📦</span>
              </div>
            )}

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="p-4 flex gap-2 overflow-x-auto">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImage(idx)}
                    className={cn(
                      "flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all",
                      idx === currentImage ? "border-primary-500" : "border-transparent opacity-60 hover:opacity-100"
                    )}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </Card>

          {/* Details */}
          <Card>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                {ad.category && (
                  <Link 
                    to={`/annonces?category=${ad.category.slug}`}
                    className="text-sm text-primary-500 font-medium hover:underline"
                  >
                    {ad.category.name}
                  </Link>
                )}
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">
                  {ad.title}
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleFavorite}
                  className={cn(
                    "p-3 rounded-xl border transition-all",
                    ad.is_favorited 
                      ? "bg-red-50 border-red-200 text-red-500" 
                      : "bg-gray-50 border-gray-200 text-gray-400 hover:text-red-500"
                  )}
                >
                  <Heart className={cn("w-5 h-5", ad.is_favorited && "fill-current")} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-3 rounded-xl border bg-gray-50 border-gray-200 text-gray-400 hover:text-primary-500 transition-all"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <p className="text-3xl font-bold text-primary-500 mb-6">
              {formatPrice(ad.price)}
            </p>

            <div className="flex flex-wrap gap-4 text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span>{ad.region}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-400" />
                <span>{formatDate(ad.created_at)}</span>
              </div>
              {ad.views_count !== undefined && (
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-gray-400" />
                  <span>{ad.views_count} vue{ad.views_count > 1 ? 's' : ''}</span>
                </div>
              )}
            </div>

            <hr className="my-6" />

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-600 whitespace-pre-line leading-relaxed">
                {ad.description}
              </p>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Seller Card */}
          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">Vendeur</h3>
            <div className="flex items-center gap-4 mb-6">
              {ad.user?.avatar ? (
                <img 
                  src={ad.user.avatar} 
                  alt="" 
                  className="w-14 h-14 rounded-full object-cover" 
                />
              ) : (
                <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-7 h-7 text-primary-600" />
                </div>
              )}
              <div>
                <p className="font-medium text-gray-900">
                  {ad.user?.full_name}
                </p>
                <p className="text-sm text-gray-500">
                  Membre depuis {new Date(ad.user?.date_joined || '').getFullYear()}
                </p>
              </div>
            </div>

            {isOwner ? (
              <div className="space-y-3">
                <Link to={`/annonces/${ad.slug}/modifier`}>
                  <Button variant="outline" className="w-full">
                    Modifier l'annonce
                  </Button>
                </Link>
                <Button 
                  variant="danger" 
                  className="w-full"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  Supprimer
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <Button 
                  className="w-full"
                  leftIcon={<Phone className="w-5 h-5" />}
                  onClick={() => setShowPhone(!showPhone)}
                >
                  {showPhone ? (ad.user?.phone || 'Non disponible') : 'Voir le téléphone'}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  leftIcon={<Mail className="w-5 h-5" />}
                  onClick={() => alert('Fonctionnalité de messagerie à implémenter')}
                >
                  Contacter le vendeur
                </Button>
              </div>
            )}
          </Card>

          {/* Safety Tips */}
          <Card className="bg-yellow-50 border-yellow-200">
            <h3 className="font-semibold text-yellow-800 mb-3">🛡️ Conseils de sécurité</h3>
            <ul className="text-sm text-yellow-700 space-y-2">
              <li>• Rencontrez le vendeur dans un lieu public</li>
              <li>• Vérifiez le produit avant de payer</li>
              <li>• Ne payez jamais à l'avance</li>
              <li>• Méfiez-vous des prix trop bas</li>
            </ul>
          </Card>

          {/* Report */}
          <button className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors text-sm">
            <Flag className="w-4 h-4" />
            Signaler cette annonce
          </button>
        </div>
      </div>

      {/* Fullscreen Gallery Modal */}
      <AnimatePresence>
        {showGallery && images.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
            onClick={() => setShowGallery(false)}
          >
            <button
              className="absolute top-4 right-4 p-2 text-white/80 hover:text-white"
              onClick={() => setShowGallery(false)}
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={images[currentImage]}
              alt=""
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); setCurrentImage(i => i > 0 ? i - 1 : images.length - 1) }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 rounded-full hover:bg-white/20"
                >
                  <ChevronLeft className="w-8 h-8 text-white" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setCurrentImage(i => i < images.length - 1 ? i + 1 : 0) }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 rounded-full hover:bg-white/20"
                >
                  <ChevronRight className="w-8 h-8 text-white" />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Supprimer cette annonce ?
              </h3>
              <p className="text-gray-600 mb-6">
                Cette action est irréversible. L'annonce sera définitivement supprimée.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  className="flex-1"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Annuler
                </Button>
                <Button
                  variant="danger"
                  className="flex-1"
                  isLoading={deleteAd.isPending}
                  onClick={handleDelete}
                >
                  Supprimer
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
