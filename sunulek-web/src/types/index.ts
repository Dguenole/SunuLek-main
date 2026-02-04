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
  ads_count?: number
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
  status?: 'draft' | 'pending' | 'active' | 'sold' | 'expired' | 'rejected'
  is_featured: boolean
  is_favorited?: boolean
  is_owner?: boolean
  views_count?: number
  favorites_count?: number
  created_at: string
  published_at?: string
  updated_at?: string
  deleted_at?: string | null
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

// Messaging types
export interface MessageUser {
  id: number
  username: string
  full_name: string
  avatar?: string
}

export interface Message {
  id: number
  sender: MessageUser
  content: string
  is_read: boolean
  is_mine: boolean
  created_at: string
}

export interface LastMessage {
  content: string
  created_at: string
  is_mine: boolean
}

export interface Conversation {
  id: number
  ad_title: string
  ad_slug: string
  ad_image?: string
  ad_price?: number
  other_user: MessageUser
  last_message?: LastMessage
  unread_count: number
  created_at: string
  updated_at: string
  messages?: Message[]
}

// Legacy - keep for backward compatibility
export interface ContactMessage {
  id: number
  ad: number
  ad_title: string
  message: string
  phone?: string
  sender_name: string
  is_read: boolean
  created_at: string
}

export interface PublicProfile {
  id: number
  username: string
  first_name: string
  full_name: string
  avatar?: string
  member_since: string
  ads_count: number
  date_joined: string
}
