import { Routes, Route } from 'react-router-dom'
import Toaster from '@/components/ui/Toaster'
import Layout from '@/components/layout/Layout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

// Pages
import Home from '@/pages/Home'
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'
import Annonces from '@/pages/annonces/Annonces'
import AnnonceDetail from '@/pages/annonces/AnnonceDetail'
import CreateAnnonce from '@/pages/annonces/CreateAnnonce'
import Profile from '@/pages/profile/Profile'
import MyAnnonces from '@/pages/profile/MyAnnonces'
import Favorites from '@/pages/profile/Favorites'

export default function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/annonces" element={<Annonces />} />
          <Route path="/annonces/:slug" element={<AnnonceDetail />} />
          
          {/* Routes protégées */}
          <Route path="/annonces/creer" element={<ProtectedRoute><CreateAnnonce /></ProtectedRoute>} />
          <Route path="/profil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/mes-annonces" element={<ProtectedRoute><MyAnnonces /></ProtectedRoute>} />
          <Route path="/favoris" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
        </Route>
      </Routes>
      <Toaster />
    </>
  )
}
