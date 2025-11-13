import { Product } from '@/types/product'

// Mock database - in production, this would be replaced with actual database queries
export const products: Product[] = [
  {
    id: 1,
    name: 'Chocolate Delight Cake',
    description: 'Rich chocolate cake with chocolate ganache',
    price: 45.99,
    image: '/cakes/chocolate-cake.jpg',
    category: 'chocolate',
    available: true
  },
  {
    id: 2,
    name: 'Vanilla Dream Cake',
    description: 'Classic vanilla sponge with buttercream frosting',
    price: 39.99,
    image: '/cakes/vanilla-cake.jpg',
    category: 'vanilla',
    available: true
  },
  {
    id: 3,
    name: 'Red Velvet Supreme',
    description: 'Red velvet cake with cream cheese frosting',
    price: 49.99,
    image: '/cakes/red-velvet.jpg',
    category: 'specialty',
    available: true
  },
  {
    id: 4,
    name: 'Lemon Bliss Cake',
    description: 'Light lemon cake with lemon curd filling',
    price: 42.99,
    image: '/cakes/lemon-cake.jpg',
    category: 'fruit',
    available: false
  },
  {
    id: 5,
    name: 'Strawberry Shortcake',
    description: 'Fluffy vanilla cake with fresh strawberries and whipped cream',
    price: 44.99,
    image: '/cakes/strawberry-cake.jpg',
    category: 'fruit',
    available: true
  },
  {
    id: 6,
    name: 'Carrot Cake',
    description: 'Moist carrot cake with cream cheese frosting and walnuts',
    price: 43.99,
    image: '/cakes/carrot-cake.jpg',
    category: 'specialty',
    available: true
  }
]

// Get all products
export async function getAllProducts(): Promise<Product[]> {
  // Simulate database delay
  await new Promise(resolve => setTimeout(resolve, 100))
  return products
}

// Get product by ID
export async function getProductById(id: number): Promise<Product | undefined> {
  await new Promise(resolve => setTimeout(resolve, 100))
  return products.find(product => product.id === id)
}

// Get products by category
export async function getProductsByCategory(category: string): Promise<Product[]> {
  await new Promise(resolve => setTimeout(resolve, 100))
  return products.filter(product => product.category === category)
}
