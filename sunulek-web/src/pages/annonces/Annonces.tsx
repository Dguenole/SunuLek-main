import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { useAds } from '@/hooks/useAds'
import { SearchBar, AdCard } from '@/components/annonces'
import Button from '@/components/ui/Button'

export default function Annonces() {
  const [searchParams] = useSearchParams()

  const filters = {
    search: searchParams.get('search') || undefined,
    category: searchParams.get('category') || undefined,
    region: searchParams.get('region') || undefined,
    min_price: searchParams.get('min_price') || undefined,
    max_price: searchParams.get('max_price') || undefined,
    ordering: searchParams.get('ordering') || '-created_at',
  }

  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage, 
    isLoading,
    isError 
  } = useAds(filters)

  const ads = data?.pages.flatMap(page => page.results) || []
  const totalCount = data?.pages[0]?.count || 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Toutes les annonces
        </h1>
        <p className="text-gray-600">
          {totalCount > 0 ? `${totalCount} annonce${totalCount > 1 ? 's' : ''} trouvée${totalCount > 1 ? 's' : ''}` : 'Recherchez parmi nos annonces'}
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <SearchBar />
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      ) : isError ? (
        <div className="text-center py-20">
          <p className="text-gray-600">Une erreur est survenue. Veuillez réessayer.</p>
        </div>
      ) : ads.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <span className="text-6xl mb-4 block">🔍</span>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Aucune annonce trouvée
          </h3>
          <p className="text-gray-600 mb-6">
            Essayez de modifier vos critères de recherche
          </p>
        </motion.div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {ads.map((ad, index) => (
              <motion.div
                key={ad.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.05, 0.3) }}
              >
                <AdCard ad={ad} />
              </motion.div>
            ))}
          </div>

          {/* Load More */}
          {hasNextPage && (
            <div className="text-center mt-10">
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                isLoading={isFetchingNextPage}
              >
                Voir plus d'annonces
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
