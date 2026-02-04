import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

interface GuestRouteProps {
  children: React.ReactNode
}

/**
 * Route réservée aux utilisateurs NON connectés.
 * Redirige vers l'accueil si l'utilisateur est déjà connecté.
 */
export default function GuestRoute({ children }: GuestRouteProps) {
  const { isAuthenticated } = useAuthStore()

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
