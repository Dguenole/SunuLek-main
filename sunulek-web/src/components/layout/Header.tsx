import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Menu, X, Search, Heart, User, LogOut, Plus, 
  ChevronDown, Home, Grid3X3, Settings 
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useLogout } from '@/hooks/useAuth'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { isAuthenticated, user } = useAuthStore()
  const logout = useLogout()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout.mutate()
    setIsProfileOpen(false)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-gray-900">
              Sunu<span className="text-primary-500">Lek</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-600 hover:text-primary-500 transition-colors font-medium">
              Accueil
            </Link>
            <Link to="/annonces" className="text-gray-600 hover:text-primary-500 transition-colors font-medium">
              Annonces
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link to="/annonces/creer">
                  <Button size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                    Publier
                  </Button>
                </Link>
                <Link to="/favoris" className="p-2 text-gray-600 hover:text-primary-500 transition-colors">
                  <Heart className="w-5 h-5" />
                </Link>
                
                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    {user?.avatar ? (
                      <img src={user.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-primary-600" />
                      </div>
                    )}
                    <ChevronDown className={cn(
                      "w-4 h-4 text-gray-600 transition-transform",
                      isProfileOpen && "rotate-180"
                    )} />
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <>
                        <div 
                          className="fixed inset-0" 
                          onClick={() => setIsProfileOpen(false)} 
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 overflow-hidden"
                        >
                          <div className="px-4 py-2 border-b border-gray-100">
                            <p className="font-medium text-gray-900">{user?.first_name} {user?.last_name}</p>
                            <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                          </div>
                          <Link
                            to="/profil"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50"
                          >
                            <Settings className="w-4 h-4" />
                            Mon profil
                          </Link>
                          <Link
                            to="/mes-annonces"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50"
                          >
                            <Grid3X3 className="w-4 h-4" />
                            Mes annonces
                          </Link>
                          <Link
                            to="/favoris"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50"
                          >
                            <Heart className="w-4 h-4" />
                            Favoris
                          </Link>
                          <hr className="my-2" />
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 w-full"
                          >
                            <LogOut className="w-4 h-4" />
                            Déconnexion
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Connexion</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">S'inscrire</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <nav className="px-4 py-4 space-y-2">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50"
              >
                <Home className="w-5 h-5 text-gray-600" />
                Accueil
              </Link>
              <Link
                to="/annonces"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50"
              >
                <Search className="w-5 h-5 text-gray-600" />
                Annonces
              </Link>

              <hr className="my-3" />

              {isAuthenticated ? (
                <>
                  <Link
                    to="/annonces/creer"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary-500 text-white"
                  >
                    <Plus className="w-5 h-5" />
                    Publier une annonce
                  </Link>
                  <Link
                    to="/profil"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50"
                  >
                    <User className="w-5 h-5 text-gray-600" />
                    Mon profil
                  </Link>
                  <Link
                    to="/mes-annonces"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50"
                  >
                    <Grid3X3 className="w-5 h-5 text-gray-600" />
                    Mes annonces
                  </Link>
                  <Link
                    to="/favoris"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50"
                  >
                    <Heart className="w-5 h-5 text-gray-600" />
                    Favoris
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 w-full"
                  >
                    <LogOut className="w-5 h-5" />
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center px-4 py-3 rounded-xl border border-gray-200"
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center px-4 py-3 rounded-xl bg-primary-500 text-white"
                  >
                    S'inscrire
                  </Link>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
