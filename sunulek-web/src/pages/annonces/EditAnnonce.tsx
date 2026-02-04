import { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { X, Plus, Loader2, Trash2 } from 'lucide-react'
import { useCategories } from '@/hooks/useCategories'
import { useAd, useUpdateAd, useDeleteAd } from '@/hooks/useAds'
import { REGIONS_SENEGAL, DEPARTMENTS_BY_REGION } from '@/lib/constants'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Card from '@/components/ui/Card'
import { cn } from '@/lib/utils'

export default function EditAnnonce() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { data: ad, isLoading: adLoading } = useAd(slug || '')
  const { data: categories } = useCategories()
  const updateAd = useUpdateAd()
  const deleteAd = useDeleteAd()
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

  const [existingImages, setExistingImages] = useState<{ id: number; image: string }[]>([])
  const [imagesToDelete, setImagesToDelete] = useState<number[]>([])
  const [newImages, setNewImages] = useState<File[]>([])
  const [newPreviews, setNewPreviews] = useState<string[]>([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // Populate form when ad loads
  useEffect(() => {
    if (ad) {
      setFormData({
        title: ad.title || '',
        description: ad.description || '',
        price: String(ad.price) || '',
        category: ad.category?.slug || '',
        region: ad.region || '',
        department: ad.department || '',
        neighborhood: ad.neighborhood || '',
        address: ad.address || '',
      })
      setExistingImages(ad.images?.map(img => ({ id: img.id, image: img.image })) || [])
    }
  }, [ad])

  // Redirect if not owner
  useEffect(() => {
    if (ad && !ad.is_owner) {
      navigate(`/annonces/${slug}`)
    }
  }, [ad, slug, navigate])

  const handleNewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const totalImages = existingImages.length - imagesToDelete.length + newImages.length + files.length
    
    if (totalImages > 5) {
      alert('Maximum 5 images autorisées')
      return
    }

    setNewImages([...newImages, ...files])
    
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = () => {
        setNewPreviews(prev => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeExistingImage = (imageId: number) => {
    setImagesToDelete([...imagesToDelete, imageId])
  }

  const restoreExistingImage = (imageId: number) => {
    setImagesToDelete(imagesToDelete.filter(id => id !== imageId))
  }

  const removeNewImage = (index: number) => {
    setNewImages(newImages.filter((_, i) => i !== index))
    setNewPreviews(newPreviews.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!slug) return

    const data = new FormData()
    data.append('title', formData.title)
    data.append('description', formData.description)
    data.append('price', formData.price)
    data.append('category', formData.category)
    data.append('region', formData.region)
    data.append('department', formData.department)
    if (formData.neighborhood) data.append('neighborhood', formData.neighborhood)
    if (formData.address) data.append('address', formData.address)
    
    // Add images to delete
    if (imagesToDelete.length > 0) {
      data.append('delete_images', JSON.stringify(imagesToDelete))
    }
    
    // Add new images
    newImages.forEach((image) => {
      data.append('images', image)
    })

    updateAd.mutate(
      { slug, formData: data },
      {
        onSuccess: (updatedAd) => navigate(`/annonces/${updatedAd.slug}`),
      }
    )
  }

  const handleDelete = () => {
    if (!slug) return
    
    deleteAd.mutate(slug, {
      onSuccess: () => navigate('/mes-annonces'),
    })
  }

  const categoryOptions = categories?.map(c => ({ value: c.slug, label: c.name })) || []
  const regionOptions = REGIONS_SENEGAL.map(r => ({ value: r, label: r }))
  const departmentOptions = formData.region 
    ? (DEPARTMENTS_BY_REGION[formData.region] || []).map(d => ({ value: d, label: d }))
    : []

  const visibleExistingImages = existingImages.filter(img => !imagesToDelete.includes(img.id))
  const totalImages = visibleExistingImages.length + newImages.length

  if (adLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    )
  }

  if (!ad) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Annonce non trouvée</h1>
        <Button onClick={() => navigate('/mes-annonces')} className="mt-4">
          Retour à mes annonces
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Modifier l'annonce
          </h1>
          <p className="text-gray-600 mt-2">
            Modifiez les informations de votre annonce
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
                {/* Existing images */}
                {existingImages.map((img) => {
                  const isDeleted = imagesToDelete.includes(img.id)
                  return (
                    <div key={img.id} className={cn("relative aspect-square", isDeleted && "opacity-40")}>
                      <img
                        src={img.image}
                        alt=""
                        className="w-full h-full object-cover rounded-xl"
                      />
                      {isDeleted ? (
                        <button
                          type="button"
                          onClick={() => restoreExistingImage(img.id)}
                          className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl text-white text-sm"
                        >
                          Restaurer
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => removeExistingImage(img.id)}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )
                })}

                {/* New image previews */}
                {newPreviews.map((preview, index) => (
                  <div key={`new-${index}`} className="relative aspect-square">
                    <img
                      src={preview}
                      alt=""
                      className="w-full h-full object-cover rounded-xl ring-2 ring-primary-500"
                    />
                    <span className="absolute top-1 left-1 bg-primary-500 text-white text-xs px-1.5 py-0.5 rounded">
                      Nouveau
                    </span>
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {totalImages < 5 && (
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
                onChange={handleNewImageChange}
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

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowDeleteModal(true)}
                className="text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer
              </Button>
              <div className="flex-1" />
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate(-1)}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                isLoading={updateAd.isPending}
              >
                Enregistrer les modifications
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-sm w-full"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Supprimer l'annonce ?
            </h3>
            <p className="text-gray-600 mb-6">
              Cette action est irréversible. L'annonce sera définitivement supprimée.
            </p>
            <div className="flex gap-3">
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => setShowDeleteModal(false)}
              >
                Annuler
              </Button>
              <Button
                variant="primary"
                className="flex-1 bg-red-600 hover:bg-red-700"
                onClick={handleDelete}
                isLoading={deleteAd.isPending}
              >
                Supprimer
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
