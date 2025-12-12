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
    type: dbProduct.type as 'cake' | 'cupcake' | 'digital' | 'slice',
    available: dbProduct.available
  }
}

// Get all products
export async function getAllProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  })
  return products.map(transformProduct)
}

// Get product by ID (supports both string and number IDs for backwards compatibility)
export async function getProductById(id: number | string): Promise<Product | undefined> {
  const productId = typeof id === 'number' ? `${id}` : id
  const product = await prisma.product.findUnique({
    where: { id: productId }
  })
  return product ? transformProduct(product) : undefined
}

// Get products by category
export async function getProductsByCategory(category: string): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: { category },
    orderBy: { createdAt: 'desc' }
  })
  return products.map(transformProduct)
}

// Get all cakes
export async function getAllCakes(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: { type: 'cake' },
    orderBy: { createdAt: 'desc' }
  })
  return products.map(transformProduct)
}

// Get all cupcakes
export async function getAllCupcakes(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: { type: 'cupcake' },
    orderBy: { createdAt: 'desc' }
  })
  return products.map(transformProduct)
}

// Get all digital products
export async function getAllDigitalProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: { type: 'digital' },
    orderBy: { createdAt: 'desc' }
  })
  return products.map(transformProduct)
}

// Get all slices
export async function getAllSlices(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: { type: 'slice' },
    orderBy: { createdAt: 'desc' }
  })
  return products.map(transformProduct)
}
