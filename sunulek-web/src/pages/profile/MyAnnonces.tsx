import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Loader2, Edit, Trash2, Eye, Clock, RotateCcw, AlertTriangle } from 'lucide-react'
import { useMyAds, useDeleteAd, useRestoreAd, usePermanentDeleteAd } from '@/hooks/useAds'
import { formatPrice, formatDate, cn } from '@/lib/utils'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import type { Ad } from '@/types'

type TabType = 'active' | 'pending' | 'deleted'

const TABS: { key: TabType; label: string; icon: React.ReactNode; emptyMessage: string }[] = [
  { 
    key: 'active', 
    label: 'Actives', 
    icon: <Eye className="w-4 h-4" />,
    emptyMessage: "Aucune annonce active. Vos annonces validées apparaîtront ici."
  },
  { 
    key: 'pending', 
    label: 'En attente', 
    icon: <Clock className="w-4 h-4" />,
    emptyMessage: "Aucune annonce en attente de validation."
  },
  { 
    key: 'deleted', 
    label: 'Corbeille', 
    icon: <Trash2 className="w-4 h-4" />,
    emptyMessage: "La corbeille est vide."
  },
]

function AdCard({ 
  ad, 
  tab, 
  onDelete, 
  onRestore, 
  onPermanentDelete,
  isDeleting,
  isRestoring,
  isPermanentDeleting 
}: { 
  ad: Ad
  tab: TabType
  onDelete: (slug: string) => void
  onRestore: (slug: string) => void
  onPermanentDelete: (slug: string) => void
  isDeleting: boolean
  isRestoring: boolean
  isPermanentDeleting: boolean
}) {
  return (
    <Card className="flex flex-col sm:flex-row gap-4 sm:items-center">
      {/* Image */}
      <Link to={tab !== 'deleted' ? `/annonces/${ad.slug}` : '#'} className="flex-shrink-0">
        {ad.primary_image || ad.images?.[0]?.image ? (
          <img
            src={ad.primary_image || ad.images?.[0]?.image}
            alt={ad.title}
            className={cn(
              "w-full sm:w-32 h-32 object-cover rounded-xl",
              tab === 'deleted' && "opacity-50 grayscale"
            )}
          />
        ) : (
          <div className="w-full sm:w-32 h-32 bg-gray-100 rounded-xl flex items-center justify-center">
            <span className="text-3xl">📦</span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <Link to={tab !== 'deleted' ? `/annonces/${ad.slug}` : '#'}>
          <h3 className={cn(
            "font-semibold transition-colors truncate",
            tab === 'deleted' ? "text-gray-500" : "text-gray-900 hover:text-primary-500"
          )}>
            {ad.title}
          </h3>
        </Link>
        <p className={cn(
          "font-bold mt-1",
          tab === 'deleted' ? "text-gray-400" : "text-primary-500"
        )}>
          {formatPrice(ad.price)}
        </p>
        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
          <span>{ad.region}</span>
          <span>{formatDate(ad.created_at)}</span>
          {ad.views_count !== undefined && tab === 'active' && (
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {ad.views_count}
            </span>
          )}
        </div>

        {/* Status badges */}
        <div className="flex items-center gap-2 mt-2">
          {tab === 'active' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
              <Eye className="w-3 h-3" />
              Visible
            </span>
          )}
          {tab === 'pending' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
              <Clock className="w-3 h-3" />
              En attente de validation
            </span>
          )}
          {tab === 'deleted' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
              <Trash2 className="w-3 h-3" />
              Supprimée
            </span>
          )}
          {ad.is_featured && tab === 'active' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
              ⭐ À la une
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex sm:flex-col gap-2">
        {tab !== 'deleted' ? (
          <>
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
              onClick={() => onDelete(ad.slug)}
              isLoading={isDeleting}
            >
              Supprimer
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-green-600 border-green-200 hover:bg-green-50"
              leftIcon={<RotateCcw className="w-4 h-4" />}
              onClick={() => onRestore(ad.slug)}
              isLoading={isRestoring}
            >
              Restaurer
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:bg-red-50"
              leftIcon={<AlertTriangle className="w-4 h-4" />}
              onClick={() => {
                if (confirm('Cette action est irréversible. Supprimer définitivement ?')) {
                  onPermanentDelete(ad.slug)
                }
              }}
              isLoading={isPermanentDeleting}
            >
              Suppr. définitif
            </Button>
          </>
        )}
      </div>
    </Card>
  )
}

export default function MyAnnonces() {
  const [activeTab, setActiveTab] = useState<TabType>('active')
  
  // Fetch all ads for counts
  const { data: allAds } = useMyAds()
  const { data: ads, isLoading } = useMyAds(activeTab)
  
  const deleteAd = useDeleteAd()
  const restoreAd = useRestoreAd()
  const permanentDeleteAd = usePermanentDeleteAd()

  // Calculate counts
  const counts = {
    active: allAds?.filter(ad => ad.status === 'active' && !ad.deleted_at).length || 0,
    pending: allAds?.filter(ad => ad.status === 'pending' && !ad.deleted_at).length || 0,
    deleted: allAds?.filter(ad => ad.deleted_at).length || 0,
  }

  const currentTab = TABS.find(t => t.key === activeTab)!

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
              Gérez toutes vos annonces
            </p>
          </div>
          <Link to="/annonces/creer">
            <Button leftIcon={<Plus className="w-5 h-5" />}>
              Nouvelle annonce
            </Button>
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors",
                activeTab === tab.key
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
            >
              {tab.icon}
              {tab.label}
              <span className={cn(
                "ml-1 px-2 py-0.5 text-xs rounded-full",
                activeTab === tab.key
                  ? "bg-primary-100 text-primary-700"
                  : "bg-gray-100 text-gray-600"
              )}>
                {counts[tab.key]}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          </div>
        ) : ads?.length === 0 ? (
          <Card className="text-center py-16">
            <span className="text-6xl mb-4 block">
              {activeTab === 'active' ? '📝' : activeTab === 'pending' ? '⏳' : '🗑️'}
            </span>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {currentTab.emptyMessage}
            </h3>
            {activeTab === 'active' && (
              <Link to="/annonces/creer" className="mt-6 inline-block">
                <Button leftIcon={<Plus className="w-5 h-5" />}>
                  Créer une annonce
                </Button>
              </Link>
            )}
          </Card>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {ads?.map((ad, index) => (
                <motion.div
                  key={ad.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <AdCard
                    ad={ad}
                    tab={activeTab}
                    onDelete={(slug) => deleteAd.mutate(slug)}
                    onRestore={(slug) => restoreAd.mutate(slug)}
                    onPermanentDelete={(slug) => permanentDeleteAd.mutate(slug)}
                    isDeleting={deleteAd.isPending}
                    isRestoring={restoreAd.isPending}
                    isPermanentDeleting={permanentDeleteAd.isPending}
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </motion.div>
    </div>
  )
}
