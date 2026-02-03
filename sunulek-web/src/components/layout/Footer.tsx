import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold text-white">
                Sunu<span className="text-primary-500">Lek</span>
              </span>
            </Link>
            <p className="text-gray-400 max-w-md mb-6">
              La première plateforme de petites annonces au Sénégal. 
              Achetez, vendez et échangez facilement avec des utilisateurs de confiance.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-primary-500 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-primary-500 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-primary-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Liens rapides</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/annonces" className="hover:text-primary-500 transition-colors">
                  Toutes les annonces
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-primary-500 transition-colors">
                  Créer un compte
                </Link>
              </li>
              <li>
                <Link to="/annonces/creer" className="hover:text-primary-500 transition-colors">
                  Publier une annonce
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary-500" />
                <span>Dakar, Sénégal</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary-500" />
                <span>+221 77 000 00 00</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary-500" />
                <span>contact@sunulek.sn</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} SunuLek. Tous droits réservés.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <Link to="#" className="hover:text-primary-500 transition-colors">
              Conditions d'utilisation
            </Link>
            <Link to="#" className="hover:text-primary-500 transition-colors">
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
