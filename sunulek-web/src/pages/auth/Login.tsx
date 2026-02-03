import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowRight } from 'lucide-react'
import { useLogin } from '@/hooks/useAuth'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const login = useLogin()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login.mutate(formData)
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Bon retour !
          </h1>
          <p className="text-gray-600 mt-2">
            Connectez-vous pour accéder à votre compte
          </p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
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
              label="Mot de passe"
              type="password"
              placeholder="••••••••"
              leftIcon={<Lock className="w-5 h-5" />}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500" />
                <span className="text-gray-600">Se souvenir de moi</span>
              </label>
              <Link to="/forgot-password" className="text-primary-500 hover:underline">
                Mot de passe oublié ?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={login.isPending}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Se connecter
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">ou</span>
            </div>
          </div>

          <p className="text-center text-gray-600">
            Pas encore de compte ?{' '}
            <Link to="/register" className="text-primary-500 font-medium hover:underline">
              S'inscrire
            </Link>
          </p>
        </Card>
      </motion.div>
    </div>
  )
}
