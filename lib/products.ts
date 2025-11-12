import { Product } from '@/types/product'
import { prisma } from './prisma'

// Get all products from database
export async function getAllProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  })
  return products
}

// Get product by ID from database
export async function getProductById(id: number): Promise<Product | undefined> {
  const product = await prisma.product.findUnique({
    where: { id }
  })
  return product || undefined
}

// Get products by category from database
export async function getProductsByCategory(category: string): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: { category },
    orderBy: {
      createdAt: 'desc'
    }
  })
  return products
}
