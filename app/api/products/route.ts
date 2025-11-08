import { NextResponse } from 'next/server'
import { getAllProducts } from '@/lib/products'

// GET /api/products - Get all products
export async function GET() {
  try {
    const products = await getAllProducts()
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
