import { Product } from '@/types/product'

// Mock database - in production, this would be replaced with actual database queries
export const products: Product[] = [
  // Cakes
  {
    id: 1,
    name: 'Chocolate Delight Cake',
    description: 'Rich chocolate cake with chocolate ganache',
    price: 45.99,
    image: '/cakes/chocolate-cake.jpg',
    category: 'chocolate',
    occasion: 'birthday',
    type: 'cake',
    available: true
  },
  {
    id: 2,
    name: 'Vanilla Dream Cake',
    description: 'Classic vanilla sponge with buttercream frosting',
    price: 39.99,
    image: '/cakes/vanilla-cake.jpg',
    category: 'vanilla',
    occasion: 'celebration',
    type: 'cake',
    available: true
  },
  {
    id: 3,
    name: 'Red Velvet Supreme',
    description: 'Red velvet cake with cream cheese frosting',
    price: 49.99,
    image: '/cakes/red-velvet.jpg',
    category: 'specialty',
    occasion: 'anniversary',
    type: 'cake',
    available: true
  },
  {
    id: 4,
    name: 'Lemon Bliss Cake',
    description: 'Light lemon cake with lemon curd filling',
    price: 42.99,
    image: '/cakes/lemon-cake.jpg',
    category: 'fruit',
    occasion: 'celebration',
    type: 'cake',
    available: false
  },
  {
    id: 5,
    name: 'Strawberry Shortcake',
    description: 'Fluffy vanilla cake with fresh strawberries and whipped cream',
    price: 44.99,
    image: '/cakes/strawberry-cake.jpg',
    category: 'fruit',
    occasion: 'birthday',
    type: 'cake',
    available: true
  },
  {
    id: 6,
    name: 'Carrot Cake',
    description: 'Moist carrot cake with cream cheese frosting and walnuts',
    price: 43.99,
    image: '/cakes/carrot-cake.jpg',
    category: 'specialty',
    occasion: 'celebration',
    type: 'cake',
    available: true
  },
  {
    id: 7,
    name: 'Wedding Elegance Cake',
    description: 'Three-tier vanilla cake with white fondant and delicate floral details',
    price: 189.99,
    image: '/cakes/wedding-cake(stock).jpg',
    category: 'vanilla',
    occasion: 'wedding',
    type: 'cake',
    available: true
  },
  {
    id: 8,
    name: 'Anniversary Rose Cake',
    description: 'Champagne-infused cake with raspberry filling and rose buttercream',
    price: 65.99,
    image: '/cakes/anniversary-cake(stock).jpg',
    category: 'specialty',
    occasion: 'anniversary',
    type: 'cake',
    available: true
  },
  // Cupcakes
  {
    id: 101,
    name: 'Classic Chocolate Cupcakes',
    description: 'Rich chocolate cupcakes with chocolate buttercream (6 pack)',
    price: 18.99,
    image: '/cupcakes/chocolate-cupcakes(stock).jpg',
    category: 'chocolate',
    occasion: 'birthday',
    type: 'cupcake',
    available: true
  },
  {
    id: 102,
    name: 'Vanilla Bean Cupcakes',
    description: 'Light vanilla cupcakes with vanilla bean frosting (6 pack)',
    price: 16.99,
    image: '/cupcakes/vanilla-cupcakes(stock).jpg',
    category: 'vanilla',
    occasion: 'celebration',
    type: 'cupcake',
    available: true
  },
  {
    id: 103,
    name: 'Red Velvet Cupcakes',
    description: 'Mini red velvet cupcakes with cream cheese frosting (6 pack)',
    price: 19.99,
    image: '/cupcakes/red-velvet-cupcakes(stock).jpg',
    category: 'specialty',
    occasion: 'anniversary',
    type: 'cupcake',
    available: true
  },
  {
    id: 104,
    name: 'Lemon Zest Cupcakes',
    description: 'Tangy lemon cupcakes with lemon curd filling (6 pack)',
    price: 17.99,
    image: '/cupcakes/lemon-cupcakes(stock).jpg',
    category: 'fruit',
    occasion: 'celebration',
    type: 'cupcake',
    available: true
  },
  {
    id: 105,
    name: 'Birthday Sprinkle Cupcakes',
    description: 'Funfetti cupcakes with rainbow sprinkles (12 pack)',
    price: 24.99,
    image: '/cupcakes/birthday-cupcakes(stock).jpg',
    category: 'vanilla',
    occasion: 'birthday',
    type: 'cupcake',
    available: true
  },
  {
    id: 106,
    name: 'Wedding Elegant Cupcakes',
    description: 'White cupcakes with pearl decorations (24 pack)',
    price: 54.99,
    image: '/cupcakes/wedding-cupcakes(stock).jpg',
    category: 'vanilla',
    occasion: 'wedding',
    type: 'cupcake',
    available: true
  },
  // Digital Products
  {
    id: 201,
    name: 'The Ultimate Cake Baking Guide',
    description: 'A comprehensive e-book with 50+ cake recipes, decorating tips, and professional techniques. Perfect for beginners and experienced bakers alike.',
    price: 14.99,
    image: '/digital/cake-cookbook(stock).jpg',
    category: 'cookbook',
    occasion: 'learning',
    type: 'digital',
    available: true
  },
  {
    id: 202,
    name: 'Cupcake Creations Cookbook',
    description: 'Master the art of cupcakes with 40 unique recipes, frosting techniques, and stunning decoration ideas. Includes video tutorial links.',
    price: 12.99,
    image: '/digital/cupcake-cookbook(stock).jpg',
    category: 'cookbook',
    occasion: 'learning',
    type: 'digital',
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

// Get all cakes
export async function getAllCakes(): Promise<Product[]> {
  await new Promise(resolve => setTimeout(resolve, 100))
  return products.filter(product => product.type === 'cake')
}

// Get all cupcakes
export async function getAllCupcakes(): Promise<Product[]> {
  await new Promise(resolve => setTimeout(resolve, 100))
  return products.filter(product => product.type === 'cupcake')
}

// Get all digital products
export async function getAllDigitalProducts(): Promise<Product[]> {
  await new Promise(resolve => setTimeout(resolve, 100))
  return products.filter(product => product.type === 'digital')
}
