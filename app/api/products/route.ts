// import { NextResponse } from 'next/server'
// import { getAllProducts } from '@/lib/products'

// // GET /api/products - Get all products
// export async function GET() {
//   try {
//     const products = await getAllProducts()
//     return NextResponse.json(products)
//   } catch (error) {
//     return NextResponse.json(
//       { error: 'Failed to fetch products' },
//       { status: 500 }
//     )
//   }
// }

import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { available: true },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        category: body.category,
        imageUrl: body.imageUrl,
      }
    })
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}