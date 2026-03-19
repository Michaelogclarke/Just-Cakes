import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set')
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2026-01-28.clover',
  })
}

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripe()
    const { items, deliveryDate } = await request.json()

    // Create line items for Stripe
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'GBP',
        product_data: {
          name: item.name,
          description: deliveryDate
            ? `${item.description} - Delivery: ${deliveryDate}`
            : item.description,
          images: item.image ? [`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}${item.image}`] : [],
        },

        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }))

    const isDigitalOnly = items.every((item: any) => item.type === 'digital')

    // Create Stripe checkout session
    // Note: digitalAssetUrl is intentionally excluded from metadata to stay within
    // Stripe's 500 char limit — it's fetched from the DB in send-order-emails instead
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/cart`,
      ...(isDigitalOnly ? {} : {
        shipping_address_collection: { allowed_countries: ['GB'] },
      }),
      metadata: {
        cart_items: JSON.stringify(items.map((item: any) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          type: item.type || 'cake',
        }))),
        delivery_date: deliveryDate || ''
      }
    })

    return NextResponse.json({
      sessionId: session.id,
      url: session.url
    })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
