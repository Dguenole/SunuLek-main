export const API_URL = 'http://192.168.1.5:8000/api/v1'
export const MEDIA_URL = 'http://192.168.1.5:8000'

/**
 * Construit l'URL complète pour un média (avatar, image d'annonce, etc.)
 * @param path - Le chemin relatif du média (ex: /media/avatars/photo.jpg)
 * @returns L'URL complète ou undefined si le chemin est vide
 */
export function getMediaUrl(path: string | undefined | null): string | undefined {
  if (!path) return undefined
  // Si le chemin est déjà une URL complète, le retourner tel quel
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  // Sinon, construire l'URL complète
  return `${MEDIA_URL}${path.startsWith('/') ? '' : '/'}${path}`
}

export const REGIONS_SENEGAL = [
  'Dakar',
  'Thiès',
  'Diourbel',
  'Fatick',
  'Kaffrine',
  'Kaolack',
  'Kédougou',
  'Kolda',
  'Louga',
  'Matam',
  'Saint-Louis',
  'Sédhiou',
  'Tambacounda',
  'Ziguinchor',
]

// Départements par région du Sénégal
export const DEPARTMENTS_BY_REGION: Record<string, string[]> = {
  'Dakar': ['Dakar', 'Pikine', 'Guédiawaye', 'Rufisque', 'Keur Massar'],
  'Thiès': ['Thiès', 'Mbour', 'Tivaouane'],
  'Diourbel': ['Diourbel', 'Bambey', 'Mbacké'],
  'Fatick': ['Fatick', 'Foundiougne', 'Gossas'],
  'Kaffrine': ['Kaffrine', 'Birkelane', 'Koungheul', 'Malem-Hodar'],
  'Kaolack': ['Kaolack', 'Guinguinéo', 'Nioro du Rip'],
  'Kédougou': ['Kédougou', 'Salémata', 'Saraya'],
  'Kolda': ['Kolda', 'Médina Yoro Foulah', 'Vélingara'],
  'Louga': ['Louga', 'Kébémer', 'Linguère'],
  'Matam': ['Matam', 'Kanel', 'Ranérou'],
  'Saint-Louis': ['Saint-Louis', 'Dagana', 'Podor'],
  'Sédhiou': ['Sédhiou', 'Bounkiling', 'Goudomp'],
  'Tambacounda': ['Tambacounda', 'Bakel', 'Goudiry', 'Koumpentoum'],
  'Ziguinchor': ['Ziguinchor', 'Bignona', 'Oussouye'],
}

export const AD_STATUS = {
  draft: 'Brouillon',
  pending: 'En attente',
  active: 'Active',
  paused: 'En pause',
  sold: 'Vendu',
  expired: 'Expirée',
  rejected: 'Rejetée',
}
