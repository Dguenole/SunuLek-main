import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Loader2, Trash2 } from 'lucide-react'
import { useFavorites, useFavoriteToggle } from '@/hooks/useFavorites'
import { AdCard } from '@/components/annonces'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

export default function Favorites() {
  const { data: favorites, isLoading } = useFavorites()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mes favoris</h1>
          <p className="text-gray-600 mt-2">
            {favorites?.length || 0} annonce{(favorites?.length || 0) > 1 ? 's' : ''} sauvegardée{(favorites?.length || 0) > 1 ? 's' : ''}
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          </div>
        ) : favorites?.length === 0 ? (
          <Card className="text-center py-16">
            <span className="text-6xl mb-4 block">💖</span>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun favori
            </h3>
            <p className="text-gray-600 mb-6">
              Sauvegardez vos annonces préférées pour les retrouver facilement
            </p>
            <Link to="/annonces">
              <Button leftIcon={<Heart className="w-5 h-5" />}>
                Explorer les annonces
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites?.map((favorite, index) => (
              <motion.div
                key={favorite.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <AdCard ad={{ ...favorite.ad, is_favorited: true }} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
