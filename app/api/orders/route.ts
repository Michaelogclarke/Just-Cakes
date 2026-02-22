import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { processOrderFulfillment } from '@/lib/order-fulfillment'

export const dynamic = 'force-dynamic'

// GET /api/orders - Get all orders
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(orders)
  } catch (error) {
    console.error('Failed to fetch orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json()

    // Validate required fields
    if (!orderData.customerName || !orderData.customerEmail || !orderData.items) {
      return NextResponse.json(
        { error: 'Missing required fields: customerName, customerEmail, items' },
        { status: 400 }
      )
    }

    // Create the order in database
    const newOrder = await prisma.order.create({
      data: {
        customerName: orderData.customerName,
        customerEmail: orderData.customerEmail,
        items: orderData.items,
        total: orderData.total || 0,
        status: 'pending',
        createdAt: new Date()
      }
    })

    // Process order fulfillment (send digital products if any)
    try {
      const fulfillmentSuccess = await processOrderFulfillment({
        id: newOrder.id,
        customerName: newOrder.customerName,
        customerEmail: newOrder.customerEmail,
        items: orderData.items,
        status: newOrder.status
      })

      if (!fulfillmentSuccess) {
        console.warn(`Order ${newOrder.id} created but digital product delivery failed`)
      }
    } catch (fulfillmentError) {
      console.error(`Order ${newOrder.id} created but fulfillment failed:`, fulfillmentError)
      // Don't fail the order creation if email fails
    }

    return NextResponse.json(newOrder, { status: 201 })

  } catch (error) {
    console.error('Failed to create order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
