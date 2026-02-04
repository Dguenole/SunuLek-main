import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Upload, X, Plus, Loader2 } from 'lucide-react'
import { useCategories } from '@/hooks/useCategories'
import { useCreateAd } from '@/hooks/useAds'
import { REGIONS_SENEGAL, DEPARTMENTS_BY_REGION } from '@/lib/constants'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Card from '@/components/ui/Card'
import { cn } from '@/lib/utils'

export default function CreateAnnonce() {
  const navigate = useNavigate()
  const { data: categories } = useCategories()
  const createAd = useCreateAd()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    region: '',
    department: '',
    neighborhood: '',
    address: '',
  })

  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + images.length > 5) {
      alert('Maximum 5 images autorisées')
      return
    }

    setImages([...images, ...files])
    
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = () => {
        setPreviews(prev => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
    setPreviews(previews.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const data = new FormData()
    data.append('title', formData.title)
    data.append('description', formData.description)
    data.append('price', formData.price)
    data.append('category', formData.category)
    data.append('region', formData.region)
    data.append('department', formData.department)
    if (formData.neighborhood) data.append('neighborhood', formData.neighborhood)
    if (formData.address) data.append('address', formData.address)
    
    images.forEach((image) => {
      data.append('images', image)
    })

    createAd.mutate(data, {
      onSuccess: (ad) => navigate(`/annonces/${ad.slug}`),
    })
  }

  const categoryOptions = categories?.map(c => ({ value: c.slug, label: c.name })) || []
  const regionOptions = REGIONS_SENEGAL.map(r => ({ value: r, label: r }))
  const departmentOptions = formData.region 
    ? (DEPARTMENTS_BY_REGION[formData.region] || []).map(d => ({ value: d, label: d }))
    : []

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Publier une annonce
          </h1>
          <p className="text-gray-600 mt-2">
            Remplissez les informations ci-dessous pour créer votre annonce
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Photos (max. 5)
              </label>
              
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                {previews.map((preview, index) => (
                  <div key={index} className="relative aspect-square">
                    <img
                      src={preview}
                      alt=""
                      className="w-full h-full object-cover rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {images.length < 5 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      "aspect-square rounded-xl border-2 border-dashed border-gray-300",
                      "flex flex-col items-center justify-center gap-2",
                      "text-gray-400 hover:text-primary-500 hover:border-primary-500",
                      "transition-colors"
                    )}
                  >
                    <Plus className="w-6 h-6" />
                    <span className="text-xs">Ajouter</span>
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {/* Title */}
            <Input
              label="Titre de l'annonce"
              placeholder="Ex: iPhone 13 Pro Max 256Go"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />

            {/* Category & Region */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Catégorie"
                options={categoryOptions}
                placeholder="Sélectionner"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
              <Select
                label="Région"
                options={regionOptions}
                placeholder="Sélectionner"
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value, department: '' })}
                required
              />
            </div>

            {/* Department & Neighborhood */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Département"
                options={departmentOptions}
                placeholder={formData.region ? "Sélectionner" : "Choisir d'abord une région"}
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                required
              />
              <Input
                label="Quartier (optionnel)"
                placeholder="Ex: Plateau, Almadies, Parcelles..."
                value={formData.neighborhood}
                onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
              />
            </div>

            {/* Address */}
            <Input
              label="Adresse (optionnel)"
              placeholder="Ex: Rue 10, en face du marché..."
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />

            {/* Price */}
            <Input
              label="Prix (FCFA)"
              type="number"
              placeholder="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Description
              </label>
              <textarea
                rows={6}
                placeholder="Décrivez votre article en détail : état, caractéristiques, raison de la vente..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={cn(
                  "w-full px-4 py-3 bg-white border border-gray-200 rounded-xl",
                  "text-gray-900 placeholder:text-gray-400",
                  "transition-all duration-200 resize-none",
                  "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
                  "hover:border-gray-300"
                )}
                required
              />
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="ghost"
                className="flex-1"
                onClick={() => navigate(-1)}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="flex-1"
                isLoading={createAd.isPending}
              >
                Publier l'annonce
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}
