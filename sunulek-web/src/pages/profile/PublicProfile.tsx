import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Calendar, Package, ArrowLeft, Loader2 } from 'lucide-react'
import { usePublicProfile } from '@/hooks/useAuth'
import { useUserAds } from '@/hooks/useAds'
import { getMediaUrl } from '@/lib/constants'
import Card from '@/components/ui/Card'
import AdCard from '@/components/annonces/AdCard'

export default function PublicProfile() {
  const { userId } = useParams<{ userId: string }>()
  const { data: profile, isLoading: profileLoading, isError } = usePublicProfile(userId || '')
  const { data: ads, isLoading: adsLoading } = useUserAds(userId)

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    )
  }

  if (isError || !profile) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <span className="text-6xl mb-4 block">😕</span>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Utilisateur introuvable</h2>
        <p className="text-gray-600 mb-6">Ce profil n'existe pas</p>
        <Link to="/annonces" className="text-primary-500 hover:underline">
          Voir les annonces
        </Link>
      </div>
    )
  }

  const userAds = ads || []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Retour */}
      <Link 
        to="/annonces"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Retour aux annonces
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar - Profile Info */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="text-center">
              {/* Avatar */}
              <div className="mb-4">
                {profile.avatar ? (
                  <img
                    src={getMediaUrl(profile.avatar)}
                    alt={profile.full_name}
                    className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-primary-100"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full mx-auto bg-primary-100 flex items-center justify-center">
                    <User className="w-12 h-12 text-primary-600" />
                  </div>
                )}
              </div>

              {/* Name */}
              <h1 className="text-xl font-bold text-gray-900 mb-1">
                {profile.full_name || profile.username}
              </h1>
              <p className="text-gray-500 text-sm mb-4">@{profile.username}</p>

              {/* Stats */}
              <div className="border-t pt-4 space-y-3">
                <div className="flex items-center justify-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Membre depuis {profile.member_since}</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-600">
                  <Package className="w-4 h-4" />
                  <span className="text-sm">
                    {profile.ads_count} annonce{profile.ads_count > 1 ? 's' : ''} active{profile.ads_count > 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Main Content - User's Ads */}
        <div className="lg:col-span-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Annonces de {profile.first_name || profile.username}
            </h2>

            {adsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
              </div>
            ) : userAds.length === 0 ? (
              <Card className="text-center py-12">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Aucune annonce active pour le moment</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {userAds.map((ad, index) => (
                  <motion.div
                    key={ad.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <AdCard ad={ad} />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
