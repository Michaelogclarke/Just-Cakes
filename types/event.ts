export interface Event {
  id: number
  title: string
  description: string
  date: string
  time: string
  location: string
  image: string
  category: 'Workshop' | 'Tasting' | 'Pop-up' | 'Class'
  price: number
  spotsLeft: number | null
  isFeatured?: boolean
}
