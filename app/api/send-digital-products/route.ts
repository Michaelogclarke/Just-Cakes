import { NextRequest, NextResponse } from 'next/server'
import { sendDigitalProductEmail, DigitalProduct } from '@/lib/email'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { orderId, customerEmail, customerName, digitalProducts } = await request.json()

    // Validate required fields
    if (!orderId || !customerEmail || !customerName || !digitalProducts || !Array.isArray(digitalProducts)) {
      return NextResponse.json(
        { error: 'Missing required fields: orderId, customerEmail, customerName, digitalProducts' },
        { status: 400 }
      )
    }

    // Send the email with digital products
    await sendDigitalProductEmail({
      to: customerEmail,
      customerName,
      orderId,
      digitalProducts: digitalProducts as DigitalProduct[]
    })

    // Optional: Update order status in database
    try {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'fulfilled',
          digitalProductsDelivered: true,
          digitalProductsDeliveredAt: new Date()
        }
      })
    } catch (dbError) {
      console.warn('Could not update order status in database:', dbError)
      // Don't fail the email sending if DB update fails
    }

    return NextResponse.json({
      success: true,
      message: 'Digital products email sent successfully'
    })

  } catch (error) {
    console.error('Error sending digital products email:', error)
    return NextResponse.json(
      { error: 'Failed to send digital products email' },
      { status: 500 }
    )
  }
}