import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Phone, ArrowRight, Check } from 'lucide-react'
import { useRegister } from '@/hooks/useAuth'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    first_name: '',
    last_name: '',
    phone: '',
    password: '',
    password_confirm: '',
  })

  const register = useRegister()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    register.mutate(formData)
  }

  const passwordsMatch = formData.password === formData.password_confirm
  const passwordStrong = formData.password.length >= 8

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Créer un compte
          </h1>
          <p className="text-gray-600 mt-2">
            Rejoignez la communauté SunuLek
          </p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Prénom"
                placeholder="Moussa"
                leftIcon={<User className="w-5 h-5" />}
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                required
              />
              <Input
                label="Nom"
                placeholder="Diallo"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                required
              />
            </div>

            <Input
              label="Nom d'utilisateur"
              placeholder="moussa_diallo"
              leftIcon={<User className="w-5 h-5" />}
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />

            <Input
              label="Email"
              type="email"
              placeholder="votre@email.com"
              leftIcon={<Mail className="w-5 h-5" />}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <Input
              label="Téléphone"
              type="tel"
              placeholder="+221 77 000 00 00"
              leftIcon={<Phone className="w-5 h-5" />}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />

            <Input
              label="Mot de passe"
              type="password"
              placeholder="••••••••"
              leftIcon={<Lock className="w-5 h-5" />}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />

            <Input
              label="Confirmer le mot de passe"
              type="password"
              placeholder="••••••••"
              leftIcon={<Lock className="w-5 h-5" />}
              value={formData.password_confirm}
              onChange={(e) => setFormData({ ...formData, password_confirm: e.target.value })}
              error={formData.password_confirm && !passwordsMatch ? 'Les mots de passe ne correspondent pas' : undefined}
              required
            />

            {/* Password Requirements */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Exigences :</p>
              <div className="flex items-center gap-2 text-sm">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordStrong ? 'bg-green-500' : 'bg-gray-200'}`}>
                  {passwordStrong && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className={passwordStrong ? 'text-green-600' : 'text-gray-500'}>
                  Au moins 8 caractères
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordsMatch && formData.password_confirm ? 'bg-green-500' : 'bg-gray-200'}`}>
                  {passwordsMatch && formData.password_confirm && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className={passwordsMatch && formData.password_confirm ? 'text-green-600' : 'text-gray-500'}>
                  Les mots de passe correspondent
                </span>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={register.isPending}
              disabled={!passwordsMatch || !passwordStrong}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Créer mon compte
            </Button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            Déjà un compte ?{' '}
            <Link to="/login" className="text-primary-500 font-medium hover:underline">
              Se connecter
            </Link>
          </p>
        </Card>

        <p className="text-center text-sm text-gray-500 mt-6">
          En créant un compte, vous acceptez nos{' '}
          <Link to="#" className="text-primary-500 hover:underline">
            conditions d'utilisation
          </Link>{' '}
          et notre{' '}
          <Link to="#" className="text-primary-500 hover:underline">
            politique de confidentialité
          </Link>
          .
        </p>
      </motion.div>
    </div>
  )
}
