export interface Product {
  id: number | string
  name: string
  description: string
  price: number
  image: string
  category: string
  occasion: string
  type: 'cake' | 'cupcake' | 'digital' | 'letterbox'
  available: boolean
}
