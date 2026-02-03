import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Shield, Zap, Users, TrendingUp } from 'lucide-react'
import { useCategories } from '@/hooks/useCategories'
import { useLatestAds, useFeaturedAds } from '@/hooks/useAds'
import { SearchBar } from '@/components/annonces'
import { AdCard } from '@/components/annonces'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

const features = [
  {
    icon: Shield,
    title: 'Sécurisé',
    description: 'Transactions sécurisées et utilisateurs vérifiés',
  },
  {
    icon: Zap,
    title: 'Rapide',
    description: 'Publiez votre annonce en moins de 2 minutes',
  },
  {
    icon: Users,
    title: 'Communauté',
    description: 'Rejoignez des milliers d\'utilisateurs actifs',
  },
  {
    icon: TrendingUp,
    title: 'Visibilité',
    description: 'Vos annonces vues par des milliers de personnes',
  },
]

export default function Home() {
  const { data: categories, isLoading: loadingCategories } = useCategories()
  const { data: latestAds, isLoading: loadingLatest } = useLatestAds()
  const { data: featuredAds, isLoading: loadingFeatured } = useFeaturedAds()

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-600 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold text-white mb-6"
            >
              Achetez et vendez
              <br />
              <span className="text-yellow-300">au Sénégal</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-white/80 max-w-2xl mx-auto"
            >
              La première plateforme de petites annonces au Sénégal. 
              Trouvez ce que vous cherchez près de chez vous.
            </motion.p>
          </div>

          <SearchBar variant="hero" />

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-8 mt-12"
          >
            {[
              { value: '10K+', label: 'Annonces' },
              { value: '5K+', label: 'Utilisateurs' },
              { value: '14', label: 'Régions' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-white/70">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Catégories populaires
              </h2>
              <p className="text-gray-600 mt-1">Explorez par catégorie</p>
            </div>
            <Link to="/annonces">
              <Button variant="ghost" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Voir tout
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {loadingCategories ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-100 rounded-2xl h-32" />
              ))
            ) : (
              categories?.slice(0, 6).map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link to={`/annonces?category=${category.slug}`}>
                    <Card hoverable className="text-center py-6">
                      <span className="text-4xl mb-3 block">{category.icon || '📦'}</span>
                      <h3 className="font-medium text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-500">{category.annonces_count || 0} annonces</p>
                    </Card>
                  </Link>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Featured Ads Section */}
      {featuredAds && featuredAds.length > 0 && (
        <section className="py-16 bg-gradient-to-b from-primary-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  ⭐ À la une
                </h2>
                <p className="text-gray-600 mt-1">Annonces mises en avant</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredAds.slice(0, 4).map((ad, index) => (
                <motion.div
                  key={ad.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <AdCard ad={ad} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Ads Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Dernières annonces
              </h2>
              <p className="text-gray-600 mt-1">Fraîchement publiées</p>
            </div>
            <Link to="/annonces">
              <Button variant="ghost" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Voir tout
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loadingLatest ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse bg-white rounded-2xl h-80" />
              ))
            ) : (
              latestAds?.slice(0, 8).map((ad, index) => (
                <motion.div
                  key={ad.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <AdCard ad={ad} />
                </motion.div>
              ))
            )}
          </div>

          <div className="text-center mt-10">
            <Link to="/annonces">
              <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Voir toutes les annonces
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Pourquoi choisir SunuLek ?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              La plateforme de confiance pour vos achats et ventes au Sénégal
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center h-full">
                  <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-7 h-7 text-primary-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-500 to-secondary-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Prêt à vendre ?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Publiez votre première annonce gratuitement en quelques minutes
            </p>
            <Link to="/annonces/creer">
              <Button 
                size="lg" 
                className="bg-white text-primary-600 hover:bg-gray-100"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Publier une annonce
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
