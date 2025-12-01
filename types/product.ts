export interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  category: string
  occasion: string
  type: 'cake' | 'cupcake' | 'digital' | 'slice'
  available: boolean
}
