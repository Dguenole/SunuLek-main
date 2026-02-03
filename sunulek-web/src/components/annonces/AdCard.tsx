import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, MapPin, Clock, Eye } from 'lucide-react'
import type { Ad } from '@/types'
import { formatPrice, formatDate, cn } from '@/lib/utils'
import { useFavoriteToggle } from '@/hooks/useFavorites'
import { useAuthStore } from '@/stores/authStore'
import Card from '@/components/ui/Card'

interface AdCardProps {
  ad: Ad
  showFavorite?: boolean
}

export default function AdCard({ ad, showFavorite = true }: AdCardProps) {
  const [imageError, setImageError] = useState(false)
  const { isAuthenticated } = useAuthStore()
  const favoriteToggle = useFavoriteToggle()

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isAuthenticated) {
      favoriteToggle.mutate(ad.id)
    }
  }

  const imageUrl = ad.primary_image || ad.images?.[0]?.image

  return (
    <Link to={`/annonces/${ad.slug}`}>
      <Card hoverable padding="none" className="overflow-hidden group">
        {/* Image */}
        <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
          {imageUrl && !imageError ? (
            <img
              src={imageUrl}
              alt={ad.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <span className="text-4xl">📦</span>
            </div>
          )}
          
          {/* Category Badge */}
          {(ad.category?.name || ad.category_name) && (
            <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium text-gray-700 rounded-full">
              {ad.category?.name || ad.category_name}
            </span>
          )}

          {/* Featured Badge */}
          {ad.is_featured && (
            <span className="absolute top-3 right-12 px-2.5 py-1 bg-primary-500 text-white text-xs font-medium rounded-full">
              À la une
            </span>
          )}

          {/* Favorite Button */}
          {showFavorite && (
            <button
              onClick={handleFavoriteClick}
              className={cn(
                "absolute top-3 right-3 p-2 rounded-full transition-all",
                "bg-white/90 backdrop-blur-sm hover:bg-white",
                ad.is_favorited ? "text-red-500" : "text-gray-400 hover:text-red-500"
              )}
            >
              <Heart className={cn("w-5 h-5", ad.is_favorited && "fill-current")} />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-primary-500 transition-colors">
            {ad.title}
          </h3>
          
          <p className="text-primary-500 font-bold text-lg mb-3">
            {formatPrice(ad.price)}
          </p>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span className="truncate">{ad.region}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatDate(ad.created_at)}</span>
            </div>
          </div>

          {ad.views_count !== undefined && (
            <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
              <Eye className="w-3.5 h-3.5" />
              <span>{ad.views_count} vue{ad.views_count > 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
      </Card>
    </Link>
  )
}
