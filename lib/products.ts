import { Product } from '@/types/product'
import { prisma } from './prisma'

// Helper function to transform Prisma Product to our Product type
function transformProduct(dbProduct: any): Product {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    description: dbProduct.description,
    price: dbProduct.price,
    image: dbProduct.image,
    category: dbProduct.category,
    occasion: dbProduct.occasion,
    type: dbProduct.type as 'cake' | 'cupcake' | 'digital' | 'letterbox',
    available: dbProduct.available,
    digitalAssetUrl: dbProduct.digitalAssetUrl
  }
}

// Get all products (customer-facing: only visible/available products)
export async function getAllProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: { available: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }]
  })
  return products.map(transformProduct)
}

// Get product by ID (supports both string and number IDs for backwards compatibility)
// Customer-facing: returns undefined for hidden products
export async function getProductById(id: number | string): Promise<Product | undefined> {
  const productId = typeof id === 'number' ? `${id}` : id
  const product = await prisma.product.findUnique({
    where: { id: productId }
  })
  if (!product || !product.available) return undefined
  return transformProduct(product)
}

// Get products by category (customer-facing: only visible/available products)
export async function getProductsByCategory(category: string): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: { category, available: true },
    orderBy: { createdAt: 'desc' }
  })
  return products.map(transformProduct)
}

// Get all cakes (customer-facing: only visible/available products)
export async function getAllCakes(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: { type: 'cake', available: true },
    orderBy: { createdAt: 'desc' }
  })
  return products.map(transformProduct)
}

// Get all cupcakes (customer-facing: only visible/available products)
export async function getAllCupcakes(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: { type: 'cupcake', available: true },
    orderBy: { createdAt: 'desc' }
  })
  return products.map(transformProduct)
}

// Get all digital products (customer-facing: only visible/available products)
export async function getAllDigitalProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: { type: 'digital', available: true },
    orderBy: { createdAt: 'desc' }
  })
  return products.map(transformProduct)
}

// Get all letterbox cakes (customer-facing: only visible/available products)
export async function getAllLetterboxCakes(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: { type: 'letterbox', available: true },
    orderBy: { createdAt: 'desc' }
  })
  return products.map(transformProduct)
}
