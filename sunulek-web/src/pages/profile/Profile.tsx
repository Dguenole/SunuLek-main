import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Camera, User, Mail, Phone, Lock, Save, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useUpdateProfile, useChangePassword } from '@/hooks/useAuth'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import { getMediaUrl } from '@/lib/constants'

export default function Profile() {
  const { user } = useAuthStore()
  const updateProfile = useUpdateProfile()
  const changePassword = useChangePassword()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [profileData, setProfileData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone: user?.phone || '',
  })

  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    new_password_confirm: '',
  })

  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoFile(file)
      const reader = new FileReader()
      reader.onload = () => setPhotoPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('first_name', profileData.first_name)
    formData.append('last_name', profileData.last_name)
    formData.append('phone', profileData.phone)
    if (photoFile) {
      formData.append('avatar', photoFile)
    }
    updateProfile.mutate(formData)
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    changePassword.mutate(passwordData, {
      onSuccess: () => {
        setPasswordData({ old_password: '', new_password: '', new_password_confirm: '' })
      },
    })
  }

  const passwordsMatch = passwordData.new_password === passwordData.new_password_confirm

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mon profil</h1>
          <p className="text-gray-600 mt-2">
            Gérez vos informations personnelles
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Photo & Info */}
          <Card>
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              {/* Photo */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  {photoPreview || user?.avatar ? (
                    <img
                      src={photoPreview || getMediaUrl(user?.avatar)}
                      alt=""
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
                      <User className="w-12 h-12 text-primary-600" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 p-2 bg-primary-500 text-white rounded-full shadow-lg hover:bg-primary-600 transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {user?.first_name} {user?.last_name}
                  </h3>
                  <p className="text-gray-500">{user?.email}</p>
                  <p className="text-sm text-gray-400">@{user?.username}</p>
                </div>
              </div>

              <hr />

              {/* Info Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Prénom"
                  leftIcon={<User className="w-5 h-5" />}
                  value={profileData.first_name}
                  onChange={(e) => setProfileData({ ...profileData, first_name: e.target.value })}
                />
                <Input
                  label="Nom"
                  value={profileData.last_name}
                  onChange={(e) => setProfileData({ ...profileData, last_name: e.target.value })}
                />
              </div>

              <Input
                label="Email"
                type="email"
                leftIcon={<Mail className="w-5 h-5" />}
                value={user?.email || ''}
                disabled
                className="bg-gray-50"
              />

              <Input
                label="Téléphone"
                type="tel"
                leftIcon={<Phone className="w-5 h-5" />}
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              />

              <div className="flex justify-end">
                <Button
                  type="submit"
                  isLoading={updateProfile.isPending}
                  leftIcon={<Save className="w-5 h-5" />}
                >
                  Enregistrer
                </Button>
              </div>
            </form>
          </Card>

          {/* Change Password */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Changer le mot de passe
            </h2>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <Input
                label="Mot de passe actuel"
                type="password"
                leftIcon={<Lock className="w-5 h-5" />}
                value={passwordData.old_password}
                onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
                required
              />
              <Input
                label="Nouveau mot de passe"
                type="password"
                leftIcon={<Lock className="w-5 h-5" />}
                value={passwordData.new_password}
                onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                required
              />
              <Input
                label="Confirmer le nouveau mot de passe"
                type="password"
                leftIcon={<Lock className="w-5 h-5" />}
                value={passwordData.new_password_confirm}
                onChange={(e) => setPasswordData({ ...passwordData, new_password_confirm: e.target.value })}
                error={passwordData.new_password_confirm && !passwordsMatch ? 'Les mots de passe ne correspondent pas' : undefined}
                required
              />
              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  variant="secondary"
                  isLoading={changePassword.isPending}
                  disabled={!passwordsMatch}
                >
                  Modifier le mot de passe
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </motion.div>
    </div>
  )
}
