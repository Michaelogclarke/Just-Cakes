import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
})

// Disable body parsing for webhook signature verification
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    )
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        // Parse cart items from metadata
        const cartItems = session.metadata?.cart_items
          ? JSON.parse(session.metadata.cart_items)
          : []

        // Create order in database
        await prisma.order.create({
          data: {
            stripeSessionId: session.id,
            stripePaymentIntent: (session.payment_intent as string) || null,
            customerEmail: session.customer_details?.email || '',
            customerName: session.customer_details?.name || null,
            customerPhone: session.customer_details?.phone || null,
            shippingAddress: (session as any).shipping_details || null,
            billingAddress: session.customer_details?.address ? JSON.parse(JSON.stringify(session.customer_details.address)) : null,
            orderItems: cartItems,
            totalAmount: (session.amount_total || 0) / 100, // Convert from cents
            currency: session.currency || 'gbp',
            paymentStatus: session.payment_status === 'paid' ? 'paid' : 'unpaid',
            status: 'pending',
          },
        })

        console.log(`Order created for session ${session.id}`)
        break
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log(`PaymentIntent succeeded: ${paymentIntent.id}`)
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log(`Payment failed: ${paymentIntent.id}`)

        // Update order if it exists
        const order = await prisma.order.findFirst({
          where: { stripePaymentIntent: paymentIntent.id }
        })

        if (order) {
          await prisma.order.update({
            where: { id: order.id },
            data: { paymentStatus: 'failed' }
          })
        }
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        console.log(`Charge refunded: ${charge.id}`)

        // Find and update order
        const order = await prisma.order.findFirst({
          where: { stripePaymentIntent: charge.payment_intent as string }
        })

        if (order) {
          await prisma.order.update({
            where: { id: order.id },
            data: {
              paymentStatus: 'refunded',
              status: 'cancelled'
            }
          })
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed', details: error.message },
      { status: 500 }
    )
  }
}
