export interface User {
  id: number
  email: string
  username: string
  first_name: string
  last_name: string
  full_name: string
  phone: string
  avatar?: string
  role: 'acheteur' | 'vendeur' | 'admin'
  is_email_verified: boolean
  date_joined: string
}

export interface AuthTokens {
  access: string
  refresh: string
}

export interface Category {
  id: number
  name: string
  slug: string
  icon?: string
  description?: string
  annonces_count?: number
}

export interface AdImage {
  id: number
  image: string
  is_primary: boolean
  order?: number
}

export interface AdUser {
  id: number
  username: string
  full_name: string
  avatar?: string
  phone?: string
  date_joined?: string
}

export interface Ad {
  id: number
  title: string
  slug: string
  description?: string
  price: number
  is_negotiable?: boolean
  region: string
  department?: string
  neighborhood?: string
  address?: string
  category?: Category
  category_name?: string
  user?: AdUser
  user_name?: string
  images?: AdImage[]
  primary_image?: string
  status?: string
  is_featured: boolean
  is_favorited?: boolean
  is_owner?: boolean
  views_count?: number
  favorites_count?: number
  created_at: string
  published_at?: string
  updated_at?: string
}

export interface Favorite {
  id: number
  ad: Ad
  created_at: string
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}
