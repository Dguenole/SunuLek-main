import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Loader2, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import { useMyAds, useDeleteAd } from '@/hooks/useAds'
import { formatPrice, formatDate } from '@/lib/utils'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

export default function MyAnnonces() {
  const { data: ads, isLoading } = useMyAds()
  const deleteAd = useDeleteAd()

  const handleDelete = (slug: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) {
      deleteAd.mutate(slug)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mes annonces</h1>
            <p className="text-gray-600 mt-2">
              {ads?.length || 0} annonce{(ads?.length || 0) > 1 ? 's' : ''}
            </p>
          </div>
          <Link to="/annonces/creer">
            <Button leftIcon={<Plus className="w-5 h-5" />}>
              Nouvelle annonce
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          </div>
        ) : ads?.length === 0 ? (
          <Card className="text-center py-16">
            <span className="text-6xl mb-4 block">📝</span>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucune annonce
            </h3>
            <p className="text-gray-600 mb-6">
              Vous n'avez pas encore publié d'annonces
            </p>
            <Link to="/annonces/creer">
              <Button leftIcon={<Plus className="w-5 h-5" />}>
                Créer ma première annonce
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {ads?.map((ad, index) => (
              <motion.div
                key={ad.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="flex flex-col sm:flex-row gap-4 sm:items-center">
                  {/* Image */}
                  <Link to={`/annonces/${ad.slug}`} className="flex-shrink-0">
                    {ad.primary_image || ad.images?.[0]?.image ? (
                      <img
                        src={ad.primary_image || ad.images?.[0]?.image}
                        alt={ad.title}
                        className="w-full sm:w-32 h-32 object-cover rounded-xl"
                      />
                    ) : (
                      <div className="w-full sm:w-32 h-32 bg-gray-100 rounded-xl flex items-center justify-center">
                        <span className="text-3xl">📦</span>
                      </div>
                    )}
                  </Link>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <Link to={`/annonces/${ad.slug}`}>
                      <h3 className="font-semibold text-gray-900 hover:text-primary-500 transition-colors truncate">
                        {ad.title}
                      </h3>
                    </Link>
                    <p className="text-primary-500 font-bold mt-1">
                      {formatPrice(ad.price)}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span>{ad.region}</span>
                      <span>{formatDate(ad.created_at)}</span>
                      {ad.views_count !== undefined && (
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {ad.views_count}
                        </span>
                      )}
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-2 mt-2">
                      {ad.status === 'active' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          <Eye className="w-3 h-3" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                          <EyeOff className="w-3 h-3" />
                          {ad.status || 'Inactive'}
                        </span>
                      )}
                      {ad.is_featured && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                          ⭐ À la une
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col gap-2">
                    <Link to={`/annonces/${ad.slug}/modifier`} className="flex-1 sm:flex-none">
                      <Button variant="outline" size="sm" className="w-full" leftIcon={<Edit className="w-4 h-4" />}>
                        Modifier
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 sm:flex-none text-red-500 hover:bg-red-50"
                      leftIcon={<Trash2 className="w-4 h-4" />}
                      onClick={() => handleDelete(ad.slug)}
                      isLoading={deleteAd.isPending}
                    >
                      Supprimer
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
