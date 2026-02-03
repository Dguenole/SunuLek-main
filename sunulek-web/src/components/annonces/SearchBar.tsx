import { useState, FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, MapPin, SlidersHorizontal, X } from 'lucide-react'
import { useCategories } from '@/hooks/useCategories'
import { REGIONS_SENEGAL } from '@/lib/constants'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  variant?: 'hero' | 'compact'
  className?: string
}

export default function SearchBar({ variant = 'compact', className }: SearchBarProps) {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { data: categories } = useCategories()
  const [showFilters, setShowFilters] = useState(false)

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    region: searchParams.get('region') || '',
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || '',
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value)
    })
    navigate(`/annonces?${params.toString()}`)
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      region: '',
      min_price: '',
      max_price: '',
    })
    navigate('/annonces')
  }

  const hasActiveFilters = filters.category || filters.region || filters.min_price || filters.max_price

  const categoryOptions = categories?.map(c => ({ value: c.slug, label: c.name })) || []
  const regionOptions = REGIONS_SENEGAL.map(r => ({ value: r, label: r }))

  if (variant === 'hero') {
    return (
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onSubmit={handleSubmit}
        className={cn("w-full max-w-4xl mx-auto", className)}
      >
        <div className="bg-white rounded-2xl shadow-xl p-2">
          <div className="flex flex-col md:flex-row gap-2">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Que recherchez-vous ?"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
              />
            </div>

            {/* Category */}
            <div className="md:w-48">
              <Select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                options={categoryOptions}
                placeholder="Catégorie"
                className="py-4 bg-gray-50 border-0"
              />
            </div>

            {/* Region */}
            <div className="md:w-48">
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                <Select
                  value={filters.region}
                  onChange={(e) => setFilters({ ...filters, region: e.target.value })}
                  options={regionOptions}
                  placeholder="Région"
                  className="py-4 pl-12 bg-gray-50 border-0"
                />
              </div>
            </div>

            {/* Search Button */}
            <Button type="submit" className="py-4 px-8">
              Rechercher
            </Button>
          </div>
        </div>
      </motion.form>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={cn("w-full", className)}>
      <div className="flex flex-col gap-3">
        {/* Main Search Row */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "p-2.5 rounded-xl border transition-colors",
              showFilters || hasActiveFilters
                ? "bg-primary-50 border-primary-200 text-primary-600"
                : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
            )}
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>

          <Button type="submit" className="px-6">
            <Search className="w-5 h-5" />
          </Button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 bg-white rounded-xl border border-gray-200"
          >
            <Select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              options={categoryOptions}
              placeholder="Catégorie"
            />
            <Select
              value={filters.region}
              onChange={(e) => setFilters({ ...filters, region: e.target.value })}
              options={regionOptions}
              placeholder="Région"
            />
            <input
              type="number"
              placeholder="Prix min"
              value={filters.min_price}
              onChange={(e) => setFilters({ ...filters, min_price: e.target.value })}
              className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <input
              type="number"
              placeholder="Prix max"
              value={filters.max_price}
              onChange={(e) => setFilters({ ...filters, max_price: e.target.value })}
              className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-700 col-span-full"
              >
                <X className="w-4 h-4" />
                Réinitialiser les filtres
              </button>
            )}
          </motion.div>
        )}
      </div>
    </form>
  )
}
